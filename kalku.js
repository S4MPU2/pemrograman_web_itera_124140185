// ===== Data & Elemen =====
const KUNCI_STORAGE = "keranjangKasir";
let keranjang = [];

const form = document.getElementById("form-barang");
const inputNama = document.getElementById("nama");
const inputHarga = document.getElementById("harga");
const inputQty = document.getElementById("qty");
const inputBayar = document.getElementById("bayar");
const isiKeranjang = document.getElementById("isi-keranjang");

// ===== Helper =====
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// ===== LocalStorage =====
function simpanKeranjang() {
  localStorage.setItem(KUNCI_STORAGE, JSON.stringify(keranjang));
}

function muatKeranjang() {
  const data = localStorage.getItem(KUNCI_STORAGE);
  keranjang = data ? JSON.parse(data) : [];
}

// ===== Validasi =====
function tampilkanError(id, pesan) {
  document.getElementById("error-" + id).textContent = pesan;
}

function validasiForm() {
  let valid = true;
  const nama = inputNama.value.trim();
  const harga = Number(inputHarga.value);
  const qty = Number(inputQty.value);

  if (nama.length < 3) {
    tampilkanError("nama", "Nama barang minimal 3 karakter.");
    valid = false;
  } else tampilkanError("nama", "");

  if (inputHarga.value === "" || isNaN(harga) || harga < 500) {
    tampilkanError("harga", "Harga harus berupa angka minimal Rp 500.");
    valid = false;
  } else tampilkanError("harga", "");

  if (inputQty.value === "" || !Number.isInteger(qty) || qty < 1) {
    tampilkanError("qty", "Jumlah harus bilangan bulat minimal 1.");
    valid = false;
  } else tampilkanError("qty", "");

  return valid;
}

// ===== Aksi Keranjang =====
function tambahBarang(event) {
  event.preventDefault();
  if (!validasiForm()) return;

  keranjang.push({
    nama: inputNama.value.trim(),
    harga: Number(inputHarga.value),
    qty: Number(inputQty.value),
  });
  simpanKeranjang();
  form.reset();
  render();
}

function hapusBarang(index) {
  keranjang.splice(index, 1);
  simpanKeranjang();
  render();
}

function transaksiBaru() {
  keranjang = [];
  localStorage.removeItem(KUNCI_STORAGE);
  inputBayar.value = "";
  render();
}

// ===== Perhitungan =====
function hitungTotal() {
  return keranjang.reduce((jumlah, item) => jumlah + item.harga * item.qty, 0);
}

function hitungDiskon(total) {
  return total >= 50000 ? total * 0.1 : 0;
}

function hitungKembalian() {
  const total = hitungTotal();
  const totalAkhir = total - hitungDiskon(total);
  const info = document.getElementById("kembalian");

  if (inputBayar.value === "") {
    info.textContent = "";
    info.className = "info";
    return;
  }
  const bayar = Number(inputBayar.value);
  if (bayar < totalAkhir) {
    info.textContent = "Uang belum mencukupi (kurang " + formatRupiah(totalAkhir - bayar) + ").";
    info.className = "info kurang";
  } else {
    info.textContent = "Kembalian: " + formatRupiah(bayar - totalAkhir);
    info.className = "info ok";
  }
}

// ===== Tampilan =====
function render() {
  isiKeranjang.innerHTML = "";

  if (keranjang.length === 0) {
    isiKeranjang.innerHTML = '<tr><td colspan="6" class="kosong">Keranjang masih kosong.</td></tr>';
  }

  keranjang.forEach((item, i) => {
    const baris = document.createElement("tr");
    baris.innerHTML =
      "<td>" + (i + 1) + "</td>" +
      "<td></td>" +
      "<td>" + formatRupiah(item.harga) + "</td>" +
      "<td>" + item.qty + "</td>" +
      "<td>" + formatRupiah(item.harga * item.qty) + "</td>" +
      '<td><button class="hapus" data-index="' + i + '">Hapus</button></td>';
    baris.children[1].textContent = item.nama; // aman dari HTML injection
    isiKeranjang.appendChild(baris);
  });

  const total = hitungTotal();
  const diskon = hitungDiskon(total);
  document.getElementById("total").textContent = formatRupiah(total);
  document.getElementById("diskon").textContent = formatRupiah(diskon);
  document.getElementById("total-akhir").textContent = formatRupiah(total - diskon);
  hitungKembalian();
}

// ===== Event =====
form.addEventListener("submit", tambahBarang);
inputBayar.addEventListener("input", hitungKembalian);
document.getElementById("btn-reset").addEventListener("click", transaksiBaru);
isiKeranjang.addEventListener("click", (e) => {
  if (e.target.classList.contains("hapus")) {
    hapusBarang(Number(e.target.dataset.index));
  }
});

// ===== Mulai =====
muatKeranjang();
render();