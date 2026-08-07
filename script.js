// ===========================================
// KONFIGURASI
// ===========================================

const nomorWA = "6285363570113"; // Ganti dengan nomor WhatsApp kamu

// ===========================================
// BELI VIA WHATSAPP
// ===========================================

function beliProduk(namaProduk, harga){

    const pesan =
`Halo Tokofajri.id 👋

Saya ingin membeli produk berikut:

🛍 Produk : ${namaProduk}
💰 Harga : Rp ${harga}

Apakah masih tersedia?`;

    const url =
`https://wa.me/${6285363570113}?text=${encodeURIComponent(pesan)}`;

    window.open(url,"_blank");

}

// ===========================================
// LIVE SEARCH
// ===========================================

const searchInput =
document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup",function(){

const keyword =
this.value.toLowerCase();

const produk =
document.querySelectorAll(".card-produk");

produk.forEach(function(card){

const nama =
card.querySelector("h3").innerText.toLowerCase();

const deskripsi =
card.querySelector(".deskripsi").innerText.toLowerCase();

if(
nama.includes(keyword) ||
deskripsi.includes(keyword)
){

card.style.display="flex";

}else{

card.style.display="none";

}

});

});

}

// ===========================================
// FILTER KATEGORI
// ===========================================

const kategori =
document.querySelectorAll(".kategori-item");

kategori.forEach(function(item){

item.addEventListener("click",function(){

const text =
this.innerText.toLowerCase();

const produk =
document.querySelectorAll(".card-produk");

produk.forEach(function(card){

const nama =
card.querySelector("h3").innerText.toLowerCase();

if(
text=="kaos" && nama.includes("kaos")
){

card.style.display="flex";

}
else if(
text=="celana" && nama.includes("celana")
){

card.style.display="flex";

}
else if(
text=="sepatu" && nama.includes("sepatu")
){

card.style.display="flex";

}
else if(
text=="aksesoris" &&
(
nama.includes("topi") ||
nama.includes("tas")
)
){

card.style.display="flex";

}
else{

card.style.display="none";

}

});

});

});

// ===========================================
// TOMBOL BELANJA SEKARANG
// ===========================================

const heroButton =
document.querySelector(".hero-btn");

if(heroButton){

heroButton.addEventListener("click",function(){

document.getElementById("produk").scrollIntoView({

behavior:"smooth"

});

});

}

// ===========================================
// BACK TO TOP
// ===========================================

const tombol =
document.createElement("button");

tombol.innerHTML="⬆";

tombol.id="backTop";

document.body.appendChild(tombol);

tombol.style.position="fixed";
tombol.style.right="20px";
tombol.style.bottom="20px";
tombol.style.width="50px";
tombol.style.height="50px";
tombol.style.borderRadius="50%";
tombol.style.border="none";
tombol.style.background="#00b14f";
tombol.style.color="#fff";
tombol.style.fontSize="20px";
tombol.style.cursor="pointer";
tombol.style.display="none";
tombol.style.zIndex="999";

window.addEventListener("scroll",function(){

if(window.scrollY>300){

tombol.style.display="block";

}else{

tombol.style.display="none";

}

});

tombol.onclick=function(){

window.scrollTo({

top:0,

behavior:"smooth"

});

};

// ===========================================
// ANIMASI SAAT SCROLL
// ===========================================

const cards =
document.querySelectorAll(".card-produk");

const observer =
new IntersectionObserver(function(entries){

entries.forEach(function(entry){

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

});

cards.forEach(function(card){

card.style.opacity="0";

card.style.transform="translateY(50px)";

card.style.transition=".5s";

observer.observe(card);

});

// ===========================================
// TAHUN FOOTER OTOMATIS
// ===========================================

const footer =
document.querySelector(".footer-bottom");

if(footer){

footer.innerHTML=
`© ${new Date().getFullYear()} Tokofajri.id - All Rights Reserved`;

}

console.log("Website Tokofajri.id berhasil dimuat.");