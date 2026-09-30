/* Menu mobile untuk halaman artikel.
   (script.js utama tidak dipakai di sini karena
   isinya untuk modal pemain di halaman utama.) */

const menuButton = document.getElementById("menuButton");

const nav = document.querySelector(".nav");


menuButton.addEventListener("click", () => {

    const open = nav.classList.toggle("mobile-open");

    menuButton.setAttribute("aria-expanded", String(open));

});


nav.addEventListener("click", (event) => {

    if (event.target.closest("a")) {

        nav.classList.remove("mobile-open");

        menuButton.setAttribute("aria-expanded", "false");

    }

});
