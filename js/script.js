/* =============================================================
   script.js - LOGIKA APLIKASI "BUKU KITA" (HTML/CSS/JS)
   Teknik yang dipakai: DOM manipulasi, validasi form,
   alert box (custom modal), Event Listener, localStorage.
   ============================================================= */

/* ---------------- 1. UTILITAS ---------------- */
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const fmtRupiah = (n) =>
  'Rp ' + Number(n || 0).toLocaleString('id-ID');

/* greeting sesuai waktu local komputer */
function salamWaktu() {
  const j = new Date().getHours();
  if (j >= 4 && j < 11) return 'Selamat pagi';
  if (j >= 11 && j < 15) return 'Selamat siang';
  if (j >= 15 && j < 18) return 'Selamat sore';
  return 'Selamat malam';
}

/* ---------------- 2. SISTEM MODAL (pop-up & alert box) ---------------- */
function bukaModal(id) {
  const m = $(id);
  if (m) m.classList.add('tampil');
}
function tutupModal(id) {
  const m = $(id);
  if (m) m.classList.remove('tampil');
}
/* custom alert box menggantikan alert() bawaan browser */
function alertBox(judul, pesan, tipe) {
  $('#alertJudul').textContent = judul;
  $('#alertPesan').textContent = pesan;
  $('#alertIkon').textContent = (tipe === 'ok') ? '✅' : (tipe === 'warning' ? '⚠️' : '❌');
  bukaModal('#modalAlert');
}
/* custom confirm dengan callback */
let onConfirmOk = null;
function confirmBox(pesan, cb) {
  $('#confirmPesan').textContent = pesan;
  onConfirmOk = cb;
  bukaModal('#modalConfirm');
}
$('#btnConfirmOk') && $('#btnConfirmOk').addEventListener('click', () => {
  tutupModal('#modalConfirm');
  if (typeof onConfirmOk === 'function') {
    const f = onConfirmOk; onConfirmOk = null; f();
  }
});

/* klik latar modal untuk menutup */
$$('.modal-layar').forEach((ly) => {
  ly.addEventListener('click', (e) => {
    if (e.target === ly) ly.classList.remove('tampil');
  });
});

/* berjaga bila tombol data attribute */
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-tutup]');
  if (t) tutupModal(t.dataset.tutup);
});

/* ---------------- 3. SESI LOGIN (localStorage) ---------------- */
function simpanSesi(user) {
  localStorage.setItem('bkSesi', JSON.stringify(user));
}
function ambilSesi() {
  try { return JSON.parse(localStorage.getItem('bkSesi')); }
  catch (e) { return null; }
}
function keluar() {
  localStorage.removeItem('bkSesi');
  window.location.href = 'index.html';
}

/* ---------------- 4. HALAMAN LOGIN (index.html) ---------------- */
function initLogin() {
  /* sudah login? langsung ke dashboard */
  if (ambilSesi()) window.location.href = 'dashboard.html';

  $('#formLogin').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#lemail').value.trim();
    const pass  = $('#lpass').value.trim();
    const rEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let pesan = '';

    if (!rEmail.test(email)) pesan = 'Format email tidak valid!';
    else if (pass.length < 5) pesan = 'Password minimal 5 karakter!';

    if (pesan) { alertBox('Validasi Gagal', pesan, 'warning'); return; }

    const user = akunDemo.find((a) => a.email === email && a.password === pass);
    if (!user) {
      /* sesuai soal: pop-up/alert email/password salah */
      alertBox('Login Gagal', 'Email/password yang anda masukkan salah!', 'error');
      $('#lpass').value = '';
      return;
    }
    simpanSesi(user);
    window.location.href = 'dashboard.html';
  });

  /* modal lupa password */
  $('#formLupa').addEventListener('submit', (e) => {
    e.preventDefault();
    const em = $('#lupaEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      alertBox('Validasi Gagal', 'Format email tidak valid!', 'warning');
      return;
    }
    tutupModal('#modalLupa');
    alertBox('Terkirim', 'Instruksi reset password telah dikirim ke ' + em, 'ok');
  });

  /* modal daftar akun baru */
  $('#formDaftar').addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = $('#daftarNama').value.trim();
    const em   = $('#daftarEmail').value.trim();
    const p1   = $('#daftarPass').value;
    const p2   = $('#daftarPass2').value;
    if (nama === '' || p1 === '' || p2 === '') {
      alertBox('Validasi Gagal', 'Semua kolom wajib diisi!', 'warning'); return;
    }
    if (p1.length < 5) {
      alertBox('Validasi Gagal', 'Password minimal 5 karakter!', 'warning'); return;
    }
    if (p1 !== p2) {
      alertBox('Validasi Gagal', 'Konfirmasi password tidak sama!', 'error'); return;
    }
    akunDemo.push({ nama: nama, email: em, password: p1 });
    tutupModal('#modalDaftar');
    $('#formDaftar').reset();
    alertBox('Berhasil!', 'Pendaftaran berhasil. Silakan login dengan akun Anda.', 'ok');
  });
}

/* ---------------- 5. DASHBOARD ---------------- */
function initDashboard() {
  const sesi = ambilSesi();
  if (!sesi) window.location.href = 'index.html';
  $('#userChip').textContent = '👤 ' + sesi.nama;

  $('#greet').textContent = salamWaktu() + ', ' + sesi.nama + '!';
  $('#greetSub').textContent =
    'Selamat belanja buku. Terakhir login: ' + new Date().toLocaleString('id-ID');

  /* tombol menu -> scroll ke panel yang sesuai / pindah halaman */
  $$('.menu-item[data-panel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.panel;
      const target = $(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.style.outline = '2px solid #f4b41a';
        setTimeout(() => { target.style.outline = 'none'; }, 1500);
      }
    });
  });

  renderLaporan();
  renderHistory();
}

/* Laporan Pemesanan: tabel dari dataPesanan */
function renderLaporan() {
  const tb = $('#tbodyLaporan');
  if (!tb) return;
  let totalItem = 0, totalNilai = 0;
  tb.innerHTML = '';
  dataPesanan.forEach((p) => {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + p.id + '</td>' +
      '<td>' + p.buku + '</td>' +
      '<td>' + p.qty + '</td>' +
      '<td>' + fmtRupiah(p.harga) + '</td>' +
      '<td>' + fmtRupiah(p.harga * p.qty) + '</td>' +
      '<td><span class="status-chip" style="background:#1f4e79">' + p.status + '</span></td>';
    tb.appendChild(tr);
    totalItem += p.qty;
    totalNilai += p.harga * p.qty;
  });
  $('#lapTotal').textContent = 'Total ' + dataPesanan.length +
    ' pesanan, ' + totalItem + ' buku, nilai ' + fmtRupiah(totalNilai);
}

/* History Transaksi: tabel dari dataTransaksi */
function renderHistory() {
  const tb = $('#tbodyHistory');
  if (!tb) return;
  tb.innerHTML = '';
  dataTransaksi.forEach((t) => {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + t.faktur + '</td>' +
      '<td>' + t.tgl + '</td>' +
      '<td>' + t.buku + ' x' + t.qty + '</td>' +
      '<td>' + fmtRupiah(t.total) + '</td>' +
      '<td>' + t.metode + '</td>' +
      '<td><span class="status-chip" style="background:' +
        (t.status === 'Selesai' ? '#27ae60' : '#f4b41a') + '">' + t.status +
      '</span></td>';
    tb.appendChild(tr);
  });
}

/* ---------------- 6. STOK / KATALOG (stok.html) ---------------- */
function kunciKatalog() {
  try { localStorage.setItem('bkKatalog', JSON.stringify(dataKatalogBuku)); }
  catch (e) { /* abaikan */ }
}
function loadKatalog() {
  try {
    const s = JSON.parse(localStorage.getItem('bkKatalog'));
    if (Array.isArray(s) && s.length) {
      dataKatalogBuku.length = 0;
      s.forEach((b) => dataKatalogBuku.push(b));
    }
  } catch (e) { /* pakai data.js default */ }
}
function badgeStok(stok) {
  let kelas = 'aman', teks = 'Stok aman';
  if (stok <= 3) { kelas = 'habis'; teks = 'Stok kritis'; }
  else if (stok <= 10) { kelas = 'tipis'; teks = 'Stok menipis'; }
  return '<span class="badge-stok ' + kelas + '">' + teks + ' (' + stok + ')</span>';
}

function initStok() {
  if (!ambilSesi()) window.location.href = 'index.html';
  $('#userChip').textContent = '👤 ' + ambilSesi().nama;
  loadKatalog();
  renderKatalog();
  renderTabelStok();

  /* pencarian dinamis */
  $('#caribuku').addEventListener('input', renderKatalog);

  /* form tambah stok via MODAL -> DOM manipulation pembuatan baris tabel */
  $('#formTambah').addEventListener('submit', (e) => {
    e.preventDefault();
    const judul  = $('#tJudul').value.trim();
    const penulis= $('#tPenulis').value.trim();
    const genre  = $('#tGenre').value;
    const harga  = Number($('#tHarga').value);
    const stok   = Number($('#tStok').value);
    if (judul === '' || penulis === '') {
      alertBox('Validasi Gagal', 'Judul dan penulis wajib diisi!', 'warning'); return;
    }
    if (!harga || harga < 1000) {
      alertBox('Validasi Gagal', 'Harga minimal Rp 1.000!', 'warning'); return;
    }
    if (stok < 0) {
      alertBox('Validasi Gagal', 'Stok tidak boleh minus!', 'warning'); return;
    }
    const baru = {
      id: Date.now(), judul: judul, penulis: penulis, genre: genre,
      harga: harga, stok: stok, gbr: 'img/buku1.png'
    };
    dataKatalogBuku.push(baru);
    kunciKatalog();
    tambahBarisStokDOM(baru);
    renderKatalog();
    $('#formTambah').reset();
    tutupModal('#modalTambah');
    alertBox('Berhasil!', 'Buku "' + judul + '" berhasil ditambahkan ke stok.', 'ok');
  });
}

/* grid kartu buku (dengan filter pencarian) */
function renderKatalog() {
  const grid = $('#gridBuku');
  if (!grid) return;
  const q = ($('#caribuku').value || '').toLowerCase();
  grid.innerHTML = '';
  dataKatalogBuku
    .filter((b) => (b.judul + ' ' + b.penulis + ' ' + b.genre).toLowerCase().includes(q))
    .forEach((b) => {
      const d = document.createElement('div');
      d.className = 'kartu-buku';
      d.innerHTML =
        '<img src="' + b.gbr + '" alt="Cover ' + b.judul + '">' +
        '<div class="isi">' +
          '<h3>' + b.judul + '</h3>' +
          '<div class="penulis">' + b.penulis + ' · ' + b.genre + '</div>' +
          '<div class="harga">' + fmtRupiah(b.harga) + '</div>' +
          '<div style="margin-top:8px">' + badgeStok(b.stok) + '</div>' +
        '</div>';
      grid.appendChild(d);
    });
}

/* tabel stok: render awal */
function renderTabelStok() {
  const tb = $('#tbodyStok');
  if (!tb) return;
  tb.innerHTML = '';
  dataKatalogBuku.forEach((b) => tambahBarisStokDOM(b, true));
  $('#infoStok').textContent = 'Total ' + dataKatalogBuku.length + ' judul buku';
}

/* PEMBUATAN BARIS TABEL DENGAN document.createElement (bukti DOM) */
function tambahBarisStokDOM(b, lama = false) {
  const tb = $('#tbodyStok');
  if (!tb) return;
  const tr = document.createElement('tr');
  const td = (txt) => {
    const c = document.createElement('td');
    c.textContent = txt;
    return c;
  };
  tr.appendChild(td(b.id));
  tr.appendChild(td(b.judul));
  tr.appendChild(td(b.penulis));
  tr.appendChild(td(b.genre));
  tr.appendChild(td(fmtRupiah(b.harga)));
  const tdS = document.createElement('td');
  tdS.appendChild(document.createTextNode(String(b.stok)));
  tr.appendChild(tdS);
  if (!lama) tr.style.background = '#fffbea';
  tr.style.animation = 'naik .4s ease';
  tb.appendChild(tr);
}

/* ---------------- 7. CHECKOUT (checkout.html) ---------------- */
let editId = null;

function initCheckout() {
  if (!ambilSesi()) window.location.href = 'index.html';
  const sesi = ambilSesi();
  $('#userChip').textContent = '👤 ' + sesi.nama;

  /* isi form data pemesan dari sesi */
  $('#cNama').value = sesi.nama;

  renderPesanan();
  renderOpsibuku();

  $('#formPesanan').addEventListener('submit', simpanPesanan);
  $('#formBayar').addEventListener('submit', kirimPesanan);
  $('#cQty').addEventListener('input', rincian);
  $('#cBuku').addEventListener('change', rincian);
}

function renderOpsibuku() {
  const sel = $('#cBuku');
  sel.innerHTML = '<option value="">-- Pilih buku --</option>';
  dataKatalogBuku.forEach((b) => {
    const o = document.createElement('option');
    o.value = b.id;
    o.textContent = b.judul + ' - ' + b.penulis + ' (' + fmtRupiah(b.harga) + ')';
    sel.appendChild(o);
  });
}

function rincian() {
  const id = Number($('#cBuku').value);
  const b = dataKatalogBuku.find((x) => x.id === id) || null;
  const qty = Number($('#cQty').value) || 0;
  const total = b ? b.harga * qty : 0;
  $('#rincianQty').textContent = qty || '-';
  $('#rincianHarga').textContent = b ? fmtRupiah(b.harga) : '-';
  $('#rincianTotal').textContent = b ? fmtRupiah(total) : '-';
  return { buku: b, qty: qty, total: total };
}

function renderPesanan() {
  const tb = $('#tbodyPesanan');
  tb.innerHTML = '';
  let total = 0;
  dataPesanan.forEach((p) => {
    total += p.harga * p.qty;
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + p.id + '</td>' +
      '<td>' + p.buku + '</td>' +
      '<td>' + p.qty + '</td>' +
      '<td>' + fmtRupiah(p.harga) + '</td>' +
      '<td>' + fmtRupiah(p.harga * p.qty) + '</td>' +
      '<td>' +
        '<button class="btn small putih" data-edit="' + p.id + '">✏️ Edit</button> ' +
        '<button class="btn small merah" data-del="' + p.id + '">🗑️ Hapus</button>' +
      '</td>';
    tb.appendChild(tr);
  });
  $('#checkoutTotal').textContent = fmtRupiah(total);
  $('#rincianTotalAll').textContent = fmtRupiah(total);
  const judul = $('#btnPesanan');
  judul.textContent = editId ? '💾 Simpan Perubahan' : '＋ Tambah Pesanan';
}

/* klik edit / hapus di tabel (event delegation) */
$('#tbodyPesanan') && $('#tbodyPesanan').addEventListener('click', (e) => {
  const ed = e.target.closest('[data-edit]');
  const de = e.target.closest('[data-del]');
  if (ed) {
    const p = dataPesanan.find((x) => x.id == ed.dataset.edit);
    if (!p) return;
    editId = p.id;
    const b = dataKatalogBuku.find((x) => x.judul === p.buku);
    $('#cBuku').value = b ? b.id : '';
    $('#cQty').value = p.qty;
    $('#cPembeli').value = p.pembeli;
    rincian();
    document.getElementById('formPesanan').scrollIntoView({ behavior: 'smooth' });
    renderPesanan();
  }
  if (de) {
    confirmBox('Hapus pesanan ID ' + de.dataset.del + '?', () => {
      const i = dataPesanan.findIndex((x) => x.id == de.dataset.del);
      if (i >= 0) {
        dataPesanan.splice(i, 1);
        if (editId == de.dataset.del) editId = null;
        renderPesanan();
        alertBox('Terhapus', 'Pesanan berhasil dihapus.', 'ok');
      }
    });
  }
});

function simpanPesanan(e) {
  e.preventDefault();
  const { buku, qty } = rincian();
  const pembeli = $('#cPembeli').value.trim();
  if (!buku) { alertBox('Validasi Gagal', 'Pilih buku terlebih dahulu!', 'warning'); return; }
  if (qty < 1 || qty > 99) {
    alertBox('Validasi Gagal', 'Jumlah harus 1 sampai 99!', 'warning'); return;
  }
  if (pembeli === '') {
    alertBox('Validasi Gagal', 'Nama pembeli wajib diisi!', 'warning'); return;
  }
  if (buku.stok < qty) {
    alertBox('Stok Tidak Cukup',
      'Stok "' + buku.judul + '" hanya ' + buku.stok + ' buah.', 'error');
    return;
  }
  if (editId) {
    const p = dataPesanan.find((x) => x.id === editId);
    p.buku = buku.judul; p.qty = qty; p.harga = buku.harga; p.pembeli = pembeli;
    editId = null;
    alertBox('Diperbarui', 'Pesanan berhasil diubah!', 'ok');
  } else {
    dataPesanan.push({
      id: dataPesanan.length + 1, buku: buku.judul, qty: qty,
      harga: buku.harga, pembeli: pembeli, status: 'Baru'
    });
    alertBox('Berhasil!', 'Pesanan "' + buku.judul + '" sebanyak ' + qty +
      ' buah ditambahkan.', 'ok');
  }
  $('#formPesanan').reset();
  $('#rincianQty').textContent = '-'; $('#rincianHarga').textContent = '-';
  $('#rincianTotal').textContent = '-';
  renderPesanan();
}

/* validasi form informasi pemesan & pembayaran */
function kirimPesanan(e) {
  e.preventDefault();
  const f = [
    ['#cNama',  (v) => v !== '', 'Nama wajib diisi!'],
    ['#cEmail', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Format email tidak valid!'],
    ['#cTelp',  (v) => /^0\d{8,13}$/.test(v), 'Nomor HP harus diawali 0, 9-14 digit!'],
    ['#cAlamat',(v) => v.length >= 10, 'Alamat minimal 10 karakter!'],
    ['#cKota',  (v) => v !== '', 'Kota wajib diisi!'],
  ];
  let gagal = '';
  $$('#formBayar input,#formBayar select').forEach((el) => el.classList.remove('err'));
  for (const [sel, tes, msg] of f) {
    const el = $(sel);
    if (!tes(el.value.trim())) { el.classList.add('err'); gagal = msg; break; }
  }
  const metode = $('#cMetode').value;
  if (!metode) {
    $('#cMetode').classList.add('err');
    gagal = gagal || 'Pilih metode pembayaran!';
  }
  if (gagal) { alertBox('Validasi Gagal', gagal, 'warning'); return; }
  if (dataPesanan.length === 0) {
    alertBox('Kosong', 'Belum ada buku yang dipesan!', 'warning'); return;
  }

  /* sukses: tampilkan ringkasan di modal */
  let rincian = '';
  dataPesanan.forEach((p) => {
    rincian += '• ' + p.buku + ' x' + p.qty + ' = ' + fmtRupiah(p.harga * p.qty) + '\n';
  });
  $('#sumNama').textContent    = $('#cNama').value;
  $('#sumEmail').textContent   = $('#cEmail').value;
  $('#sumAlamat').textContent  = $('#cAlamat').value + ', ' + $('#cKota').value;
  $('#sumMetode').textContent  = metode;
  $('#sumTotal').textContent   = $('#rincianTotalAll').textContent;
  bukaModal('#modalSukses');
  $('#formBayar').reset();
  $('#cNama').value = ambilSesi().nama;
}
$('#btnSumOk') && $('#btnSumOk').addEventListener('click', () => {
  tutupModal('#modalSukses');
});

/* ---------------- 8. TRACKING (tracking.html) ---------------- */
const namaStatus = ['Dikemas', 'Dikirim', 'Dalam Transit', 'Sampai Tujuan', 'Diterima'];
const warnaStatus = ['#8395a7', '#f4b41a', '#e39b0f', '#1f4e79', '#27ae60'];

function initTracking() {
  if (!ambilSesi()) window.location.href = 'index.html';
  $('#userChip').textContent = '👤 ' + ambilSesi().nama;

  $('#formTrack').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('#inputDO').value.trim().toUpperCase();
    if (q === '') {
      alertBox('Validasi Gagal', 'Nomor delivery order belum diisi!', 'warning'); return;
    }
    const d = dataPengiriman.find((x) => x.do.toUpperCase() === q);
    if (!d) {
      alertBox('Tidak Ditemukan',
        'Nomor DO "' + q + '" tidak ada dalam data pengiriman.', 'error');
      $('#hasilLacak').style.display = 'none';
      return;
    }
    tampilkanHasil(d);
  });

  /* bila membawa ?do= dari halaman lain misal dari laporan */
  const q = new URLSearchParams(window.location.search).get('do');
  if (q) { $('#inputDO').value = q; }
}

function tampilkanHasil(d) {
  $('#hasilLacak').style.display = 'block';
  $('#ckNama').textContent   = d.pemesan;
  $('#ckKota').textContent   = d.kota;
  $('#ckEkspedisi').textContent = d.ekspedisi;
  $('#ckTgl').textContent    = d.tgl;
  $('#ckPaket').textContent  = d.paket;
  $('#ckTotal').textContent  = fmtRupiah(d.total);
  const chip = $('#statusChip');
  chip.textContent = namaStatus[d.status];
  chip.style.background = warnaStatus[d.status];
  const persen = (d.status / 4) * 100;
  setTimeout(() => { $('#progressIsi').style.width = persen + '%'; }, 60);
  $$('.progress-label span').forEach((s, i) => {
    s.classList.toggle('aktif', i <= d.status);
  });
}

/* ---------------- 9. INIT PER HALAMAN ---------------- */
window.addEventListener('DOMContentLoaded', () => {
  initSemua();
});
function initSemua() {
  const hal = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (hal === 'index.html') initLogin();
  else if (hal === 'dashboard.html') initDashboard();
  else if (hal === 'stok.html') initStok();
  else if (hal === 'checkout.html') initCheckout();
  else if (hal === 'tracking.html') initTracking();
  const bk = $('#btnKeluar');
  if (bk) bk.addEventListener('click', keluar);
}
