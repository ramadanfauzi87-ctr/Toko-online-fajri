// =====================================================
// TOKOFAJRI.ID - SCRIPT.JS (VERSION OPTIMIZED)
// =====================================================

// State Aplikasi
let semuaProduk = [];
let kategoriAktif = "semua";

// Element HTML Utama
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");

// Element Lightbox / Modal
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const imageModalClose = document.getElementById("imageModalClose");
const imagePrev = document.querySelector(".image-modal-prev");
const imageNext = document.querySelector(".image-modal-next");
const imageCounter = document.querySelector(".image-counter");

// State Lightbox
let gambarLightbox = [];
let indexGambarAktif = 0;
let namaProdukAktif = "";

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Format Angka ke IDR
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka || 0);
}

// Normalisasi Array Gambar (Menghapus String Kosong/Null)
function ambilDaftarGambar(item) {
    if (Array.isArray(item.gambar)) {
        return item.gambar.filter(g => typeof g === "string" && g.trim() !== "");
    }
    if (typeof item.gambar === "string" && item.gambar.trim() !== "") {
        return [item.gambar.trim()];
    }
    return [];
}

// =====================================================
// RENDER PRODUK
// =====================================================

function tampilkanProduk(produk) {
    if (!productContainer) return;
    productContainer.innerHTML = "";

    if (produk.length === 0) {
        productContainer.innerHTML = `
            <div class="produk-kosong">
                <i class="fa-solid fa-box-open"></i>
                <h3>Produk tidak ditemukan</h3>
                <p>Coba gunakan kata kunci lain.</p>
            </div>
        `;
        return;
    }

    produk.forEach(function (item) {
        const card = document.createElement("div");
        card.className = "card-produk";

        const daftarGambar = ambilDaftarGambar(item);
        const gambarPertama = daftarGambar.length > 0 ? daftarGambar[0] : "";

// Hapus / Kosongkan bagian ini:
let thumbnailsHTML = "";
if (daftarGambar.length > 1) {
    thumbnailsHTML = `
        <div class="product-thumbnails">
            ...
        </div>
    `;
}        // Badge
        const badgeHTML = item.badge ? `
            <div class="badge ${item.badge.toLowerCase() === "promo" ? "promo" : ""}">
                ${item.badge}
            </div>
        ` : "";

        // Template HTML Card
        card.innerHTML = `
            ${badgeHTML}

            <div class="product-image" data-product-id="${item.id}">
                ${gambarPertama ? `
                    <img src="${gambarPertama}" alt="${item.nama}" loading="lazy" class="product-img" data-image-index="0">
                ` : `
                    <div class="gambar-tidak-tersedia">
                        <i class="fa-solid fa-image"></i>
                        <span>Tidak ada gambar</span>
                    </div>
                `}
            </div>

            ${thumbnailsHTML}

            <h3>${item.nama}</h3>

            <div class="rating">
                ⭐⭐⭐⭐⭐ (${item.rating || '5.0'})
                <small>${item.terjual || 0} terjual</small>
            </div>

            <p class="harga">${formatRupiah(item.harga)}</p>

            ${item.hargaLama ? `<p class="harga-lama">${formatRupiah(item.hargaLama)}</p>` : ""}

            <p class="deskripsi">${item.deskripsi || ""}</p>

            <button type="button" class="btn-beli" data-nama="${item.nama}" data-harga="${item.harga}">
                <i class="fa-brands fa-whatsapp"></i> Beli via WhatsApp
            </button>
        `;

        // Simpan Data di DOM Element
        card.dataset.gambar = JSON.stringify(daftarGambar);
        card.dataset.nama = item.nama;

        productContainer.appendChild(card);
    });
}

// =====================================================
// LOAD DATA FROM JSON
// =====================================================

async function loadProduk() {
    try {
        const response = await fetch("./products.json");
        if (!response.ok) throw new Error("File products.json tidak ditemukan.");

        semuaProduk = await response.json();
        if (!Array.isArray(semuaProduk)) throw new Error("Format JSON tidak valid.");

        tampilkanProduk(semuaProduk);
    } catch (error) {
        console.error("Error:", error);
        if (productContainer) {
            productContainer.innerHTML = `
                <div class="produk-error">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <h3>Produk gagal dimuat</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}

// =====================================================
// FILTER & SEARCH LOGIC
// =====================================================

function filterProduk() {
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const hasil = semuaProduk.filter(function (item) {
        const kategoriProduk = String(item.kategori || "").toLowerCase();
        const nama = String(item.nama || "").toLowerCase();
        const deskripsi = String(item.deskripsi || "").toLowerCase();

        const cocokKategori = (kategoriAktif === "semua") || (kategoriProduk === kategoriAktif);
        const cocokSearch = nama.includes(keyword) || kategoriProduk.includes(keyword) || deskripsi.includes(keyword);

        return cocokKategori && cocokSearch;
    });

    tampilkanProduk(hasil);
}

// Event Listener Search Input
if (searchInput) {
    searchInput.addEventListener("input", filterProduk);
}

// Event Listener Kategori
const kategoriItems = document.querySelectorAll(".kategori-item");
kategoriItems.forEach(function (item) {
    item.addEventListener("click", function () {
        kategoriAktif = this.dataset.kategori || "semua";

        kategoriItems.forEach(k => k.classList.remove("active"));
        this.classList.add("active");

        filterProduk();

        const sectionProduk = document.getElementById("produk");
        if (sectionProduk) {
            sectionProduk.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// =====================================================
// CONTAINER DELEGATION EVENT
// =====================================================

if (productContainer) {
    productContainer.addEventListener("click", function (event) {
        // 1. Klik Tombol WhatsApp
        const btnBeli = event.target.closest(".btn-beli");
        if (btnBeli) {
            beliProduk(btnBeli.dataset.nama, Number(btnBeli.dataset.harga));
            return;
        }

        // 2. Klik Thumbnail Gambar
        const thumbnail = event.target.closest(".product-thumbnail");
        if (thumbnail) {
            const card = thumbnail.closest(".card-produk");
            if (!card) return;

            const gambar = JSON.parse(card.dataset.gambar || "[]");
            const index = Number(thumbnail.dataset.imageIndex);
            const gambarUtama = card.querySelector(".product-img");

            if (gambarUtama && gambar[index]) {
                gambarUtama.src = gambar[index];
                gambarUtama.dataset.imageIndex = index;
            }

            card.querySelectorAll(".product-thumbnail").forEach(t => t.classList.remove("active"));
            thumbnail.classList.add("active");
            return;
        }

        // 3. Klik Gambar Utama (Buka Lightbox)
        const image = event.target.closest(".product-img");
        if (image) {
            const card = image.closest(".card-produk");
            if (!card) return;

            const gambar = JSON.parse(card.dataset.gambar || "[]");
            const index = Number(image.dataset.imageIndex || 0);

            if (gambar.length > 0) {
                bukaImage(gambar, index, card.dataset.nama);
            }
        }
    });
}

// =====================================================
// PURCHASE VIA WHATSAPP
// =====================================================

function beliProduk(nama, harga) {
    const nomorWA = "6285363570113"; // Ganti dengan nomor WhatsApp kamu
    const pesan = `Halo Tokofajri.id 👋\n\nSaya ingin membeli:\n🛍 Produk: ${nama}\n💰 Harga: ${formatRupiah(harga)}\n\nApakah produk masih tersedia?`;
    const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;

    window.open(url, "_blank");
}

// Hero Button Scroll
const heroButton = document.querySelector(".hero-btn");
if (heroButton) {
    heroButton.addEventListener("click", function () {
        const produk = document.getElementById("produk");
        if (produk) produk.scrollIntoView({ behavior: "smooth" });
    });
}

// =====================================================
// LIGHTBOX MODAL FUNCTIONALITY
// =====================================================

function bukaImage(daftarGambar, index, namaProduk) {
    if (!imageModal || !modalImage) return;

    gambarLightbox = daftarGambar;
    indexGambarAktif = index;
    namaProdukAktif = namaProduk;

    tampilkanGambarLightbox();
    imageModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function tampilkanGambarLightbox() {
    if (!modalImage) return;

    const gambar = gambarLightbox[indexGambarAktif];
    if (!gambar) return;

    modalImage.src = gambar;
    modalImage.alt = namaProdukAktif;

    if (imageCounter) {
        imageCounter.textContent = `${indexGambarAktif + 1} / ${gambarLightbox.length}`;
    }
}

function gambarSebelumnya() {
    if (gambarLightbox.length <= 1) return;
    indexGambarAktif = (indexGambarAktif - 1 + gambarLightbox.length) % gambarLightbox.length;
    tampilkanGambarLightbox();
}

function gambarBerikutnya() {
    if (gambarLightbox.length <= 1) return;
    indexGambarAktif = (indexGambarAktif + 1) % gambarLightbox.length;
    tampilkanGambarLightbox();
}

function tutupImage() {
    if (!imageModal) return;

    imageModal.classList.remove("show");
    if (modalImage) modalImage.src = "";

    gambarLightbox = [];
    indexGambarAktif = 0;
    document.body.style.overflow = "";
}

// Event Control Lightbox
if (imageModalClose) imageModalClose.addEventListener("click", tutupImage);

if (imagePrev) {
    imagePrev.addEventListener("click", function (e) {
        e.stopPropagation();
        gambarSebelumnya();
    });
}

if (imageNext) {
    imageNext.addEventListener("click", function (e) {
        e.stopPropagation();
        gambarBerikutnya();
    });
}

if (imageModal) {
    imageModal.addEventListener("click", function (e) {
        if (e.target === imageModal) tutupImage();
    });
}

// Keyboard Navigation
document.addEventListener("keydown", function (e) {
    if (!imageModal || !imageModal.classList.contains("show")) return;

    if (e.key === "Escape") tutupImage();
    if (e.key === "ArrowLeft") gambarSebelumnya();
    if (e.key === "ArrowRight") gambarBerikutnya();
});

// Swipe Touch Navigation
let touchStartX = 0;
let touchEndX = 0;

if (imageModal) {
    imageModal.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    imageModal.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const jarak = touchEndX - touchStartX;

        if (jarak > 50) gambarSebelumnya();
        if (jarak < -50) gambarBerikutnya();
    }, { passive: true });
}

// =====================================================
// INIT PROGRAM
// =====================================================
loadProduk();