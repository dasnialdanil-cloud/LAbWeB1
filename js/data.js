/* =====================================================
   data.js - DATA DUMMY TOKO BUKU
   Semua data aplikasi diambil dari file ini (Array JSON),
   bukan dari server/database karena tugas berfokus front-end.
   ===================================================== */

/* 1. KATALOG BUKU (variabel konstanta sesuai soal) */
const dataKatalogBuku = [
  { id: 1, judul: 'Laskar Hikmah',  penulis: 'Andrea Hirata', genre: 'Novel',     harga: 85000,  stok: 12, gbr: 'img/buku1.png' },
  { id: 2, judul: 'Rumah Pelangi',  penulis: 'Andrea Hirata', genre: 'Novel',     harga: 92000,  stok: 8,  gbr: 'img/buku2.png' },
  { id: 3, judul: 'Sang Pemimpi',   penulis: 'Andrea Hirata', genre: 'Novel',     harga: 88000,  stok: 15, gbr: 'img/buku3.png' },
  { id: 4, judul: 'Bumi Manusia',   penulis: 'Pramoedya',     genre: 'Klasik',    harga: 115000, stok: 5,  gbr: 'img/buku4.png' },
  { id: 5, judul: 'Salah Asuhan',   penulis: 'Abdul Muis',    genre: 'Klasik',    harga: 78000,  stok: 10, gbr: 'img/buku5.png' },
  { id: 6, judul: 'Perahu Kertas',  penulis: 'Dee Lestari',   genre: 'Novel',     harga: 95000,  stok: 7,  gbr: 'img/buku6.png' },
  { id: 7, judul: 'Hujan',          penulis: 'Tere Liye',     genre: 'Novel',     harga: 89000,  stok: 20, gbr: 'img/buku7.png' },
  { id: 8, judul: 'Jejak Langkah',  penulis: 'Pramoedya',     genre: 'Klasik',    harga: 105000, stok: 6,  gbr: 'img/buku8.png' }
];

/* 2. DATA TRACKING PENGIRIMAN
   status: 0 Dikemas | 1 Dikirim | 2 Dalam Transit | 3 Sampai Tujuan | 4 Diterima */
const dataPengiriman = [
  { do: 'DO-2026-0001', pemesan: 'Daniel Dasnial', status: 2, ekspedisi: 'JNE Express',
    tgl: '03-11-2026', paket: 'Hemisphere', total: 119000, kota: 'Cikarang, Bekasi' },
  { do: 'DO-2026-0002', pemesan: 'Siti Aisyah',    status: 4, ekspedisi: 'J&T Cargo',
    tgl: '02-11-2026', paket: 'Merpati Putih', total: 88000,  kota: 'Bandung' },
  { do: 'DO-2026-0003', pemesan: 'Budi Santoso',   status: 1, ekspedisi: 'SiCepat',
    tgl: '03-11-2026', paket: 'Best',          total: 263000, kota: 'Surabaya' },
  { do: 'DO-2026-0004', pemesan: 'Rina Maharani',  status: 0, ekspedisi: 'Anteraja',
    tgl: '04-11-2026', paket: 'Reguler',       total: 95000,  kota: 'Semarang' }
];

/* 3. HISTORY TRANSAKSI (riwayat pembelian) */
const dataTransaksi = [
  { faktur: 'INV-2026-001', tgl: '2026-10-28', nim: '312510492', pemesan: 'Daniel Dasnial',
    buku: 'Laskar Hikmah', qty: 1, total: 85000, metode: 'Transfer BCA', status: 'Selesai' },
  { faktur: 'INV-2026-002', tgl: '2026-10-30', nim: '312510492', pemesan: 'Daniel Dasnial',
    buku: 'Hujan', qty: 2, total: 178000, metode: 'QRIS', status: 'Selesai' },
  { faktur: 'INV-2026-003', tgl: '2026-11-02', nim: '312510492', pemesan: 'Daniel Dasnial',
    buku: 'Bumi Manusia', qty: 1, total: 115000, metode: 'Transfer BCA', status: 'Dikemas' }
];

/* 4. LAPORAN PEMESANAN (keranjang yang sedang diproses) */
const dataPesanan = [
  { id: 1, buku: 'Laskar Hikmah', qty: 1, harga: 85000,  pembeli: 'Daniel Dasnial', status: 'Baru' },
  { id: 2, buku: 'Sang Pemimpi',  qty: 2, harga: 88000,  pembeli: 'Daniel Dasnial', status: 'Baru' }
];

/* 5. AKUN LOGIN DEMO (simulasi, karena tanpa backend) */
const akunDemo = [
  { nama: 'Daniel Dasnial', email: 'daniel@bukukita.id', password: 'uts123' },
  { nama: 'Admin Bukukita', email: 'admin@bukukita.id',  password: 'admin123' }
];
