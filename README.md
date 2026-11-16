# Ardan Tools — 22 utilitas online yang berjalan 100% di browser

Situs statis (HTML + CSS + JavaScript murni, tanpa build step). Semua file diproses di perangkat pengguna, tidak ada upload ke server.

## Struktur

```
index.html            Halaman utama (SPA: semua rute dirender oleh js/app.js)
vercel.json           Rewrite /tools/*, /categories/*, /about, /privacy, /terms, /contact → index.html
_redirects            Sama, untuk Netlify
css/style.css         Semua gaya tampilan
js/data.js            ⚙️ KONFIGURASI: nama situs, email kontak, iklan, daftar tool + konten (FAQ, how-to, dll)
js/app.js             Router, header/footer, beranda, kategori, About/Privacy/Terms/Contact
js/qr.js              Encoder QR code (versi 1–40, level L/M/Q/H)
js/tools-text.js      Word Counter, JSON, Base64, CSV↔JSON, Case, Markdown, Hash/UUID, Minifier, RNG, File Translator
js/tools-media.js     Kompresor/Resizer/Konverter gambar, HEIC, SVG, PDF, QR, HD Photo Enhancer (Upscaler 4K)
vendor/               JSZip, pdf-lib, pdf.js, marked (disertakan lokal, tidak perlu CDN)
serve.js              Local web server (port 4000)
start-server.bat      Klik 2x untuk menyalakan server lokal
share-online.bat      Klik 2x untuk membuat link online publik (tunnel) agar bisa diakses orang lain
```

## Rute

- `/` beranda (pencarian + filter kategori)
- `/categories/image|pdf|text|developer`
- `/tools/<slug>` — 22 tool (termasuk `/tools/hd-photo-enhancer`, `/tools/pembuat-foto-hd`, `/tools/foto-hd`, `/tools/file-translator`, `/tools/translate-pdf`, `/tools/rng`)
- `/about`, `/privacy`, `/terms`, `/contact`

## Cara Akses & Menjalankan

### 1. Di Komputer Sendiri / Jaringan Wi-Fi (Lokal & HP)
- Klik 2x file `start-server.bat` (atau ketik `npm start` di terminal).
- Buka di browser: `http://localhost:4000`
- Buka tool RNG langsung: `http://localhost:4000/tools/rng`
- Buka dari HP (dalam 1 Wi-Fi): gunakan IP yang ditampilkan di console (contoh: `http://192.168.1.xxx:4000`).

### 2. Agar Bisa Diakses Orang Lain di Internet (Publik)
- **Cara Instan (Tunnel)**:
  Jalankan `start-server.bat`, lalu klik 2x `share-online.bat`. Anda akan mendapatkan link publik gratis yang bisa dibuka orang lain dari mana saja!
- **Cara Permanen (Hosting Gratis Vercel / Netlify)**:
  1. Upload folder ini ke GitHub.
  2. Buka [Vercel](https://vercel.com) -> **Import Project** -> Deploy (sudah ada konfigurasi `vercel.json`).
  3. Website langsung aktif 24 jam dengan link seperti `https://ardantools.vercel.app`.

## Yang perlu kamu ubah

- `js/data.js` → `SITE.name`, `SITE.contactEmail`.
- `js/data.js` → `ADS` : ganti dengan sponsor/afiliasi kamu sendiri (atau tempel kode AdSense/Adsterra di fungsi `adSlot` di `js/app.js`).
- Teks Privacy Policy & Terms ada di `js/app.js` (`pagePrivacy`, `pageTerms`). Sesuaikan dengan layanan analitik/iklan yang benar-benar kamu pakai.

## Catatan

- HEIC → JPG memuat decoder `heic2any` dari CDN jsDelivr saat pertama dipakai (Safari bisa decode HEIC tanpa itu).
- SHA-1/256/512 memakai Web Crypto API, jadi butuh HTTPS (Vercel otomatis HTTPS).
- Formulir Contact membuka aplikasi email pengunjung (`mailto:`). Untuk kirim langsung, sambungkan ke layanan form seperti Formspree.
