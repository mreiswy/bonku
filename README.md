# BonKu — Abon Ayam Rumahan

Website katalog & pemesanan **BonKu**, produk UMKM abon ayam rumahan dalam kemasan retort pouch food grade. Dibangun dengan React 19 + TypeScript + Vite 8 + Tailwind CSS v4.

Produk: **Abon Ayam Pouch 100g** dan **Roti Isi Abon**. Pemesanan lewat Google Form, dikonfirmasi via WhatsApp, dengan opsi COD area kampus (Jember).

---

## Fitur Halaman

- **Hero interaktif kanvas**: simulasi saus bumbu 2D, karakter ayam & cabai terbang yang bisa di-drag dengan dialog jenaka.
- **Katalog produk**: kartu produk dengan modal detail (komposisi, kemasan, cara penyajian).
- **Bauran pemasaran 4P**: Product, Price, Place, Promotion dalam grid interaktif.
- **Alur pemesanan**: timeline 4 langkah dari pilih produk sampai serah terima.
- **Kontak & pemesanan**: tombol Google Form, chat WhatsApp, dan kartu flip "pesan rahasia".
- **Aksesibilitas**: skip-link, urutan heading rapi, `prefers-reduced-motion` dihormati, kontras teks memenuhi WCAG AA.

---

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Motion**: Framer Motion
- **Smooth Scrolling**: Lenis
- **Icons**: Lucide React

---

## Menjalankan Lokal

```bash
git clone https://github.com/mreiswy/bonku.git
cd bonku
npm install
npm run dev
```

Buka `http://localhost:5173`.

Build produksi:

```bash
npm run build     # hasil di dist/
npm run preview   # cek hasil build secara lokal
npm run lint
```

Opsional: repo ini menyertakan `flake.nix` + `.envrc` untuk devshell Nix (direnv). Bisa diabaikan bila tidak memakai Nix.

---

## Mengubah Konten

Seluruh teks website (nama, bio, kontak, produk, harga, langkah pemesanan) terpusat di **satu file**:

`src/data/bonkuData.ts`

- **Nomor WhatsApp**: ubah `WA_NUMBER` (format internasional tanpa `+`, mis. `6285732897954`).
- **Link Google Form**: ubah `contact.orderFormUrl` — bila diisi `''`, tombol pesan otomatis mengarah ke WhatsApp.
- **Instagram**: isi `contact.instagram` dengan URL profil (mis. `https://instagram.com/bonku.id`). Selama kosong, tombol Instagram tidak ditampilkan.
- **Produk, harga, langkah pemesanan**: sunting array terkait di file yang sama.
- **Ikon tahap pemesanan**: opsional, isi `iconUrl` per langkah.

Cek konsistensi data setelah mengedit:

```bash
node --experimental-strip-types src/data/bonkuData.check.ts
```

---

## Struktur Folder

```text
bonku/
├── public/                 # Logo & gambar produk (PNG/SVG)
├── src/
│   ├── components/
│   │   ├── about/          # Section produk & highlight
│   │   ├── common/         # ErrorBoundary
│   │   ├── contact/        # Kontak, kartu flip, kanvas saus
│   │   ├── hero/           # Hero, kanvas bumbu, karakter interaktif
│   │   ├── marketing/      # Grid bauran pemasaran 4P
│   │   ├── navigation/     # Navbar floating
│   │   ├── order/          # Timeline alur pemesanan
│   │   ├── products/       # Katalog, dock filter, modal detail
│   │   └── ui/             # Tombol taktil, logo, notifikasi
│   ├── data/bonkuData.ts   # SEMUA TEKS DIEDIT DI SINI
│   ├── hooks/              # Custom hooks (Lenis, tilt, aktivitas canvas)
│   ├── types/bonku.ts      # Definisi TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css           # Konfigurasi Tailwind CSS v4
├── index.html
├── package.json
└── vite.config.ts
```

---

## Deploy

SPA murni berbasis Vite — bisa langsung ditautkan ke Vercel atau Netlify tanpa konfigurasi server tambahan.

---

## Lisensi

Dirilis di bawah lisensi [MIT](LICENSE). Awalnya diturunkan dari template open source [template-porto-pantai](https://github.com/ryhndastra/template-porto-pantai) karya Reyhand Astra, lalu diubah total menjadi katalog produk BonKu.
