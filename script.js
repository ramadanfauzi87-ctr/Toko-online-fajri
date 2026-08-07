function beliProduk(namaProduk, hargaProduk) {
    // ⚠️ Ganti angka di bawah ini dengan nomor WhatsApp Anda sendiri (Gunakan format 62)
    let nomorWA = "6285363570113"; 

    // Pesan otomatis yang akan masuk ke WhatsApp Anda
    let pesan = `Halo TokoSaya.id, saya ingin memesan:\n\n` +
                `📦 *Produk:* ${namaProduk}\n` +
                `💰 *Harga:* Rp ${hargaProduk}\n\n` +
                `Apakah stok masih tersedia dan bisa dikirim hari ini?`;

    // Membuka tautan WhatsApp
    let urlWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWA, '_blank');
}
function cariProduk() {
    // 1. Ambil teks dari input pencarian
    let input = document.getElementById('keyword').value.toLowerCase();
    
    // 2. Ambil semua elemen dengan class "card-produk"
    let items = document.querySelectorAll('.card-produk');

    // 3. Looping untuk mengecek judul produk di tiap kartu
    items.forEach(item => {
        // Mengambil teks di dalam tag <h3> (judul produk)
        let judul = item.querySelector('h3').textContent.toLowerCase();

        // 4. Jika judul mengandung kata yang diketik, tampilkan. Jika tidak, sembunyikan.
        if (judul.includes(input)) {
            item.style.display = ""; 
        } else {
            item.style.display = "none";
        }
    });
}
function filterKategori(kategori) {
    let items = document.querySelectorAll('.card-produk');

    items.forEach(item => {
        // Ambil kategori produk dari data-kategori
        let itemKategori = item.getAttribute('data-kategori');

        // Tampilkan semua jika klik 'semua' / Dashboard, atau tampilkan yang kategorinya cocok
        if (kategori === 'semua' || itemKategori === kategori) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}