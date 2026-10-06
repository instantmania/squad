/* Menu (ikon 3 garis → jendela menu) untuk halaman artikel.
   script.js utama tidak dipakai di sini karena isinya
   untuk popup pemain di halaman utama. */

const menuButton = document.getElementById("menuButton");

const nav = document.querySelector(".nav");


function setMenu(open) {

    nav.classList.toggle("mobile-open", open);

    document.body.classList.toggle("menu-open", open);

    menuButton.setAttribute("aria-expanded", String(open));

    menuButton.setAttribute("aria-label", open ? "Tutup menu" : "Menu");

}


menuButton.addEventListener("click", () => {

    setMenu(!nav.classList.contains("mobile-open"));

});


nav.addEventListener("click", (event) => {

    if (event.target.closest("a")) setMenu(false);

});


document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        nav.classList.contains("mobile-open")
    ) {

        setMenu(false);

    }

});
