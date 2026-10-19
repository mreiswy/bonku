# Desain Spesifikasi: Dashboard Admin & Database SQLite Lokal BonKu

## 1. Ringkasan Eksekutif
Fitur ini menambahkan integrasi database SQLite lokal (`bonku.db`) dan Dashboard Admin interaktif ke dalam website BonKu. Sistem ini memungkinkan:
1. Pelanggan dapat melakukan pemesanan langsung dari website (tersimpan ke database lokal dengan konfirmasi otomatis via WhatsApp).
2. Pemilik bisnis (admin) dapat memantau pesanan masuk, mengubah status pesanan (Pending, Dikonfirmasi, Siap COD, Selesai, Dibatalkan), mencatat pesanan manual offline, memantau kuota batch pre-order (PO), melihat analitik penjualan, dan mengekspor data ke CSV.
3. Seluruh antarmuka mempertahankan tema visual BonKu yang hangat, ramah, dan taktil (krem `#fdf3e3`, aksen terakota `#b2430f`, border tegas `#2a1710`, bayangan kartun neo-brutalis).

---

## 2. Kepatuhan Arsitektur & Aturan Proyek (`AI_INSTRUCTION.md`)
- **Framework & Runtime**: Memanfaatkan stack aktif (React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Framer Motion + Lucide React).
- **Backend Ringan & Zero Overhead**: Dijalankan langsung melalui Vite Dev Server Middleware menggunakan plugin internal Vite (`vite-plugin-api.ts`) dan `better-sqlite3`. Pengembang cukup menjalankan `pnpm run dev` tanpa perlu menjalankan terminal terpisah atau `concurrently`.
- **Integritas Bisnis**: Menggunakan produk asli BonKu (`Abon Ayam Pouch 100g` @ Rp 18.000 dan `Roti Isi Abon` @ Rp 6.000) dari `src/data/bonkuData.ts`.
- **Konsistensi Visual**: Tidak menggunakan template korporat asing; seluruh elemen UI dashboard dan modal menggunakan token warna, sudut lengkung (`rounded-2xl` / `rounded-3xl`), border `#2a1710`, dan bayangan offset yang identik dengan komponen BonKu lainnya.

---

## 3. Skema Database SQLite (`bonku.db`)

Database disimpan secara persisten di root proyek sebagai file `bonku.db`.

### 3.1 Tabel `orders`
```sql
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,                       -- Format: BK-YYYYMMDD-XXXX (contoh: BK-20261019-A1B2)
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  location_note TEXT,                        -- Alamat / titik temu COD area kampus
  items TEXT NOT NULL,                       -- JSON string array: [{ productId, title, quantity, price, subtotal }]
  total_price INTEGER NOT NULL,
  notes TEXT,                                -- Catatan pesanan khusus
  status TEXT NOT NULL DEFAULT 'pending',    -- 'pending' | 'confirmed' | 'ready_cod' | 'completed' | 'cancelled'
  payment_status TEXT NOT NULL DEFAULT 'unpaid', -- 'unpaid' | 'paid'
  source TEXT NOT NULL DEFAULT 'web',        -- 'web' | 'manual' | 'whatsapp'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
```

### 3.2 Tabel `batches` (Manajemen Batch Pre-Order)
```sql
CREATE TABLE IF NOT EXISTS batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_name TEXT NOT NULL,                  -- Contoh: "PO Batch 1 - Oktober"
  start_date TEXT,
  end_date TEXT,
  quota_pouch INTEGER DEFAULT 50,
  quota_roti INTEGER DEFAULT 30,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 Tabel `settings`
```sql
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
-- Default: admin_pin = "1234"
```

---

## 4. Spesifikasi REST API (`/api/*`)

Semua endpoint dilayani oleh Vite server middleware (atau server Node untuk produksi):

| Metode | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/health` | Status server dan konektivitas database |
| `POST` | `/api/auth/verify` | Validasi PIN admin |
| `POST` | `/api/auth/change-pin` | Ubah PIN admin |
| `GET` | `/api/orders` | Ambil daftar pesanan (dukungan query: `status`, `search`) |
| `POST` | `/api/orders` | Buat pesanan baru (dari form web atau manual admin) |
| `PATCH` | `/api/orders/:id` | Update status pesanan / status pembayaran |
| `DELETE` | `/api/orders/:id` | Hapus pesanan |
| `GET` | `/api/stats` | Rekapitulasi: Total omset, total item pouch/roti terjual, pesanan aktif |
| `GET` | `/api/batch/active` | Data batch pre-order aktif & kalkulasi sisa kuota |
| `POST` | `/api/batch/active` | Update nama batch & kuota produksi |
| `GET` | `/api/export/csv` | Download rekap pesanan format CSV |

---

## 5. Komponen Antarmuka & Alur Interaksi

### 5.1 Modal Pemesanan Pelanggan (`QuickOrderModal.tsx`)
- Tombol akses di Section Hero, Katalog Produk, dan Kontak: "Pesan Langsung di Web" (selain opsi Google Form & WhatsApp).
- Form interaktif dengan validasi:
  - Pilihan jumlah Abon Ayam Pouch 100g (Rp 18.000) & Roti Isi Abon (Rp 6.000).
  - Ringkasan kalkulasi harga seketika (subtotal + total).
  - Input Nama Lengkap, Nomor WhatsApp, Titik Antar / COD Kampus, dan Catatan.
- Saat dikirim (`Submit`):
  - Menyimpan data ke SQLite via `POST /api/orders`.
  - Menampilkan modal sukses dengan ID Pesanan resmi (misal `BK-20261019-7F3A`).
  - Tombol aksi: "Buka WhatsApp untuk Konfirmasi Otomatis" yang memuat pesan siap kirim dengan nomor pesanan tersebut.

### 5.2 Akses Admin & Modal PIN (`AdminAuthModal.tsx`)
- Tautan taktil di bagian bawah website (footer dock): Tombol "Area Admin BonKu" dengan ikon gembok rapi.
- Membuka modal input PIN 4-digit dengan keypad bergaya neo-brutalis.
- PIN default: `1234`. Berhasil verifikasi menyimpan sesi sementara di `sessionStorage`.

### 5.3 Admin Dashboard (`AdminDashboardModal.tsx`)
Ditata dengan tab bernuansa krem dan kartu taktil:
1. **Tab Ringkasan (Overview)**:
   - Kartu metrik: Total Omset (Rp), Total Pesanan Masuk, Pouch Terjual, Rti Terjual.
   - Progress bar kuota Batch PO aktif (Pouch & Roti).
2. **Tab Pesanan (Orders)**:
   - Filter cepat: `Semua`, `Pending`, `Dikonfirmasi`, `Siap COD`, `Selesai`, `Batal`.
   - Pencarian real-time berdasarkan Nama atau Nomor HP.
   - Kartu daftar pesanan lengkap dengan rincian item, catatan, badge status warna, tombol ubah status, dan tombol pintas WhatsApp pelanggan.
3. **Tab Tambah Pesanan Manual**:
   - Form cepat bagi admin untuk mencatat penjualan offline/tunai langsung ke database.
4. **Tab Batch & Kuota**:
   - Form pengaturan nama batch dan target kuota produksi.
5. **Aksi Header**:
   - Tombol "Ekspor CSV" untuk rekap pembukuan Excel.
   - Tombol Keluar (Logout).

---

## 6. Penanganan Galat & Edge Cases
- **Database File Locking / Concurrency**: Mengaktifkan WAL mode (`PRAGMA journal_mode = WAL;`) pada SQLite untuk pembacaan bersamaan yang cepat dan aman.
- **Validasi Data Input**: Sanitasi string nama, validasi nomor HP angka, kalkulasi ulang total harga di backend agar tidak bisa dimanipulasi dari frontend.
- **Offline / Server Tidak Tersedia**: Jika API server tidak merespons, frontend memberikan pesan ramah dan mengarahkan pengguna secara elegan ke WhatsApp langsung.

---

## 7. Rencana Pengujian & Verifikasi
- Validasi build TypeScript & Vite: `npm run build`
- Validasi Linting: `npm run lint`
- Pemeriksaan konsistensi data: `node --experimental-strip-types src/data/bonkuData.check.ts`
- Pengujian fungsional API: pembuatan pesanan, kalkulasi omset, perubahan status, dan ekspor CSV.
- Verifikasi antarmuka: memastikan tidak ada pergeseran visual atau perubahan warna pada halaman utama BonKu.
