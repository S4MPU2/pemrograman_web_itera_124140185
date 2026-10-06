# Mini POS Kantin

## Identitas
- Nama Lengkap : [Samuel Purba]
- NIM          : [124140185]
- Kelas        : [RB]

## Deskripsi Aplikasi
Aplikasi kasir sederhana untuk kantin/toko kampus. Kasir dapat menambah barang ke keranjang, melihat total dan diskon otomatis, serta menghitung kembalian. Data keranjang disimpan di localStorage sehingga tidak hilang saat halaman di-refresh.

## Cara Menjalankan
1. Buka folder proyek di VS Code.
2. Install ekstensi **Live Server**.
3. Klik kanan `index.html` lalu pilih **Open with Live Server**
   (atau cukup buka `index.html` langsung di browser).

## Daftar Fitur
- [x] Validasi nama barang (min. 3 karakter)
- [x] Validasi harga (angka, min. Rp 500)
- [x] Validasi qty (bilangan bulat, min. 1)
- [x] Pesan error merah di bawah input & form reset otomatis jika berhasil
- [x] Subtotal per barang (harga × qty)
- [x] Total belanja otomatis
- [x] Diskon 10% jika total ≥ Rp 50.000
- [x] Kalkulator uang bayar & kembalian (ada pesan jika uang kurang)
- [x] Tabel keranjang + tombol Hapus per item
- [x] Penyimpanan keranjang di localStorage
- [x] Tombol Transaksi Baru (reset keranjang & localStorage)

## Screenshot
(Tambahkan minimal 3 screenshot di folder `screenshot/`)
1. Tampilan form input utama
2. Tampilan saat validasi error muncul
3. Tampilan tabel keranjang dan hasil perhitungan

## Penjelasan Teknis Singkat
- **Validasi**: fungsi `validasiForm()` memeriksa tiga input. Jika salah, pesan error ditampilkan di elemen `<small class="error">` di bawah input dan fungsi `tambahBarang()` berhenti.
- **Kalkulator**: `hitungTotal()` menjumlahkan `harga × qty` semua item dengan `reduce`. `hitungDiskon()` memberi 10% jika total ≥ 50.000. `hitungKembalian()` menghitung `uang bayar − total akhir`.
- **localStorage**: `simpanKeranjang()` memakai `JSON.stringify()` untuk menyimpan array keranjang, dan `muatKeranjang()` memakai `JSON.parse()` saat halaman dibuka.