# BonKu — Abon Ayam Rumahan

Website katalog & pemesanan **BonKu**, produk UMKM abon ayam rumahan dalam kemasan retort pouch food grade. Dibangun dengan React 19 + TypeScript + Vite 8 + Tailwind CSS v4.

Produk: **Abon Ayam Pouch 100g** dan **Roti Isi Abon**. Pemesanan terhubung langsung ke **Google Spreadsheet (SPS)** dan dikonfirmasi via WhatsApp, dengan opsi COD area kampus (Jember).

---

## Fitur Halaman

- **Hero interaktif kanvas**: simulasi saus bumbu 2D, karakter ayam & cabai terbang yang bisa di-drag dengan dialog jenaka.
- **Katalog produk**: kartu produk dengan modal detail (komposisi, kemasan, cara penyajian).
- **Formulir Pemesanan Web Langsung ke SPS**: pesan langsung di web dengan kalkulasi harga otomatis, kirim data instan ke Google Spreadsheet (SPS), dan link konfirmasi WhatsApp otomatis.
- **Bauran pemasaran 4P**: Product, Price, Place, Promotion dalam grid interaktif.
- **Alur pemesanan**: timeline 4 langkah dari pilih produk sampai serah terima.
- **Kontak & pemesanan**: tombol Google Form, chat WhatsApp, dan informasi pemesanan.
- **Aksesibilitas**: skip-link, urutan heading rapi, `prefers-reduced-motion` dihormati, kontras teks memenuhi WCAG AA.
- **Arsitektur Static Murni**: 100% client-side SPA tanpa backend lokal/database server terpisah, ramah hosting gratis (Vercel, Netlify, GitHub Pages).

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
```

---

## Mengubah Konten & Integrasi SPS

Seluruh konfigurasi dan teks website terpusat di **satu file**:

`src/data/bonkuData.ts`

- **Nomor WhatsApp**: ubah `WA_NUMBER` (format internasional tanpa `+`, mis. `6282338929138`).
- **Webhook Google Spreadsheet (SPS)**: masukkan Web App URL Google Apps Script pada `contact.spreadsheetWebhookUrl`. Setiap pemesanan di web akan otomatis tercatat ke baris Google Spreadsheet Anda. (Lihat panduan lengkap di [docs/SPS_INTEGRATION_GUIDE.md](docs/SPS_INTEGRATION_GUIDE.md)).
- **Link Google Form Cadangan**: ubah `contact.orderFormUrl` — bila diisi, tersedia tombol cadangan untuk membuka Google Form resmi.
- **Instagram**: isi `contact.instagram` dengan URL profil. Selama kosong, tombol Instagram disembunyikan.
- **Produk, harga, keunggulan**: sunting array terkait di file yang sama.

Cek konsistensi data setelah mengedit:

```bash
node --experimental-strip-types src/data/bonkuData.check.ts
```

---

## Struktur Folder

```text
bonku/
├── docs/                     # Panduan integrasi (SPS, dll.)
├── public/                   # Logo & gambar produk (PNG/SVG)
├── src/
│   ├── components/
│   │   ├── about/            # Section produk & highlight
│   │   ├── common/           # ErrorBoundary
│   │   ├── contact/          # Kontak, kanvas saus, footer
│   │   ├── hero/             # Hero, kanvas bumbu, karakter interaktif
│   │   ├── marketing/        # Grid bauran pemasaran 4P
│   │   ├── navigation/       # Navbar floating
│   │   ├── order/            # Timeline alur pemesanan
│   │   ├── products/         # Katalog, dock filter, modal detail
│   │   └── ui/               # Tombol taktil, logo, notifikasi
│   ├── data/bonkuData.ts     # SEMUA TEKS & KONFIGURASI DIEDIT DI SINI
│   ├── hooks/                # Custom hooks (Lenis, routing halaman, tilt)
│   ├── pages/
│   │   └── OrderPage.tsx     # Halaman pemesanan web terhubung ke SPS
│   ├── services/
│   │   └── apiService.ts     # Pengirim data ke Webhook Google Spreadsheet
│   ├── types/bonku.ts        # Definisi tipe TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css             # Konfigurasi Tailwind CSS v4
├── index.html
├── package.json
└── vite.config.ts
```

---

## Deploy

SPA murni berbasis Vite — bisa langsung di-deploy ke Vercel, Netlify, Cloudflare Pages, atau GitHub Pages tanpa konfigurasi server tambahan.

---

## Lisensi

Dirilis di bawah lisensi [MIT](LICENSE).
