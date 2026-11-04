=====================================================
 TUGAS UTS PEMROGRAMAN WEB 1 - TOKO BUKU "BUKU KITA"
 Daniel Dasnial - 312510492 - Kelas I252A
 Teknik Informatika - Universitas Pelita Bangsa
=====================================================

AKUN LOGIN DEMO
  Email    : daniel@bukukita.id    Password: uts123
  Email    : admin@bukukita.id     Password: admin123
  (bisa juga daftar lewat tombol "Daftar" di halaman login)

CARA MENJALANKAN
  1. Unzip / pakai folder ini apa adanya.
  2. Klik dua kali file index.html (browser apa saja: Chrome/Edge/Firefox).
  3. Login dengan akun demo di atas.
  4. Ikuti menu: Dashboard -> Stok/Katalog -> Pemesanan -> Tracking.

NOMOR TRACKING DEMO (halaman tracking)
  DO-2026-0001  DO-2026-0002  DO-2026-0003  DO-2026-0004

STRUKTUR FILE (sesuai format penilaian)
  tugas-uts-web1/
    index.html      halaman login (email, password, lupa password, daftar)
    dashboard.html  menu utama + greeting waktu pagi/siang/sore + laporan + history
    stok.html       katalog grid + tabel stok + fitur tambah stok (DOM)
    checkout.html   keranjang (tambah/ubah/hapus) + form pemesan/pembayaran
    tracking.html   input Nomor DO -> progress bar + detail pengiriman
    css/style.css   semua desain (external CSS)
    js/data.js      data Array JSON: dataKatalogBuku, dataPengiriman,
                    dataTransaksi, dataPesanan, akunDemo
    js/script.js    logika: DOM, validasi form, modal/alert, localStorage
    assets/logo.png logo aplikasi
    img/buku1..8    gambar katalog buku

PETA KODE vs KRITERIA PENILAIAN
  a. HTML semantik: header, nav, main, section, footer, form, label,
     fieldset, legend, table, thead/tbody, aria-label.
  b. CSS: external (css/style.css), internal (<style> di dashboard /
     tracking), inline (style="..." di beberapa elemen).
  c. JavaScript DOM: document.createElement untuk baris tabel baru,
     innerHTML render kartu/tabel, addEventListener, querySelector,
     event delegation (edit/hapus), localStorage (katalog & sesi).
  d. Validasi form & alert: format email, password min. 5,
     harga/stok, alamat min. 10 karakter, no HP 08..., stok cukup;
     feedback lewat custom alert box (modal) - BUKAN alert bawaan saja.
  e. Modularitas: HTML/CSS/JS/data terpisah, id/kelas konsisten.
  f. Kreativitas: tema warna卵 khas Logo, modal popup animasi,
     progress bar tracking, kartu buku hover, responsif mobile.
  g. Penjelasan: lihat dokumen "Naskah Penjelasan Video 15 Menit".
