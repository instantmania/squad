/* =========================================
   INSTANT MANIA
   INTERACTION
========================================= */


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },

    { threshold: 0.12 }

);

revealElements.forEach((element) => {

    revealObserver.observe(element);

});


/* =========================================
   PLAYER DATA (squad aktif)
========================================= */

const players = {

    fitra: {

        number: "69",

        name: "FITRA",

        role: "TUKANG NGABISIN CP",

        position: "Ujung Kiri",

        speciality: "Ngedit / Makan / Tidur",

        joined: "2025",

        image: "assets/fitra.jpg"

    },


    alip: {

        number: "07",

        name: "ALIP",

        role: "KANG MOSING",

        position: "Di Tengah",

        speciality: "Photography / Music / Ngedit",

        joined: "2022",

        image: "assets/alip.jpg"

    },


    naufal: {

        number: "09",

        name: "NAUFAL",

        role: "PRODUCTION",

        position: "Production",

        speciality: "Production / Coordination / Creative",

        joined: "2024",

        image: "assets/naufal.jpg"

    },


    nicho: {

        number: "08",

        name: "NICHO",

        role: "MARKETING",

        position: "Marketing",

        speciality: "Marketing / Communication / Strategy",

        joined: "2026",

        image: "assets/nicho.jpg"

    },


    aang: {

        number: "17",

        name: "AANG",

        role: "EDITOR",

        position: "Photo & Video Editor",

        speciality: "Editing / Color / Retouch",

        joined: "2021",

        image: "assets/aang.jpg"

    },


    bardan: {

        number: "10",

        name: "BARDAN",

        role: "THE PRESIDENT",

        position: "Finance & Support",

        speciality: "Finance / Administration / Venue",

        joined: "2023",

        image: "assets/bardan.jpg"

    }

};


/* =========================================
   LEGENDS DATA (ex-member)
   Bentuk sama dengan `players`, ditambah:
   left    : tahun keluar
   retired : true = badge RETIRED di kartu

   !! Dua entri di bawah hanya CONTOH.
   !! Ganti dengan data asli (atau hapus
   !! isinya jadi `const legends = {}` agar
   !! section tersembunyi) sebelum publish.
   Foto: assets/legends/<id>.jpg
========================================= */

const legends = {

    contoh1: {

        number: "11",

        name: "NATHAN",

        role: "PHOTOGRAPHER",

        position: "Ganti posisi",

        speciality: "Ganti skill / kontribusi",

        joined: "March, 2026",

        left: "September, 2026",

        retired: true,

        image: "assets/legends/nathan.jpg"

    },


    contoh2: {

        number: "15",

        name: "BENAYA",

        role: "GRAPHIC DESIGNER",

        position: "Tidak Tergantikan",

        speciality: "Ganti skill / kontribusi",

        joined: "2024",

        left: "2025",

        retired: true,

        image: "assets/legends/benaya.jpg"

    },

   contoh3: {

        number: "12",

        name: "SANDI",

        role: "PRODUCTION ENGINERING",

        position: "Ganti posisi",

        speciality: "Teknisi Mesin / Software",

        joined: "2021",

        left: "present",

        retired: false,

        image: "assets/legends/sandi.jpg"

    },
    contoh4: {

        number: "22",

        name: "DINI",

        role: "PHOTOGRAPHER",

        position: "Ganti posisi",

        speciality: "Ganti skill / kontribusi",

        joined: "2025",

        left: "2025",

        retired: true,

        image: "assets/legends/dini.jpg"

       },
    contoh5: {

        number: "18",

        name: "ADELLE",

        role: "TALENT ARTIST",

        position: "MODEL",

        speciality: "Ganti skill / kontribusi",

        joined: "2024",

        left: "2024",

        retired: true,

        image: "assets/legends/adelle.jpg"
       
       },
   
    contoh6: {

        number: "88",

        name: "IHSAN",

        role: "PHOTOGRAPHER",

        position: "Ganti posisi",

        speciality: "Ganti skill / kontribusi",

        joined: "2024",

        left: "2025",

        retired: true,

        image: "assets/legends/ihsan.jpg"

       },
   
    contoh7: {

        number: "03",

        name: "TYAS",

        role: "PHOTOGRAPHER",

        position: "Ganti posisi",

        speciality: "Ganti skill / kontribusi",

        joined: "2024",

        left: "2025",

        retired: true,

        image: "assets/legends/tyas.jpg"
       },
   
    contoh8: {

        number: "06",

        name: "SALSA",

        role: "PHOTOGRAPHER",

        position: "Ganti posisi",

        speciality: "Ganti skill / kontribusi",

        joined: "2024",

        left: "2025",

        retired: true,

        image: "assets/legends/salsa.jpg"
    }

};


/* gabungan: modal bisa membuka pemain aktif maupun legend */
const people = { ...players, ...legends };


/* =========================================
   MODAL ELEMENTS
========================================= */

const modal = document.getElementById("playerModal");

const modalClose = document.getElementById("modalClose");

const modalImage = document.getElementById("modalImage");

const modalNumber = document.getElementById("modalNumber");

const modalName = document.getElementById("modalName");

const modalRole = document.getElementById("modalRole");

const modalPosition = document.getElementById("modalPosition");

const modalSpeciality = document.getElementById("modalSpeciality");

const modalJoinedLabel = document.getElementById("modalJoinedLabel");

const modalJoined = document.getElementById("modalJoined");


/* =========================================
   OPEN / CLOSE MODAL
========================================= */

let lastFocused = null;


function openPlayer(playerId) {

    const player = people[playerId];

    if (!player) return;


    lastFocused = document.activeElement;


    modalImage.src = player.image;

    modalImage.alt = player.name;

    modalNumber.textContent = player.number;

    modalName.textContent = player.name;

    modalRole.textContent = player.role;

    modalPosition.textContent = player.position;

    modalSpeciality.textContent = player.speciality;


    /* legend → "YEARS 2023 – 2024", pemain aktif → "JOINED 2025" */
    if (modalJoinedLabel) {

        modalJoinedLabel.textContent =
            player.left ? "YEARS" : "JOINED";

    }

    modalJoined.textContent =
        player.left
            ? player.joined + " – " + player.left
            : player.joined;


    modal.classList.add("active");

    document.body.style.overflow = "hidden";

    modalClose.focus();

}


function closeModal() {

    modal.classList.remove("active");

    document.body.style.overflow = "";

    if (lastFocused && lastFocused.focus) lastFocused.focus();

}


/* klik kartu squad, kartu legends, atau pemain di formation */
document.addEventListener("click", (event) => {

    const trigger = event.target.closest("[data-player]");

    if (!trigger) return;

    openPlayer(trigger.dataset.player);

});


/* Enter / Spasi pada kartu (article) = sama seperti klik */
document.addEventListener("keydown", (event) => {

    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest("article[data-player]");

    if (!card || card !== event.target) return;

    event.preventDefault();

    openPlayer(card.dataset.player);

});


modalClose.addEventListener("click", closeModal);


modal.addEventListener("click", (event) => {

    if (event.target === modal) closeModal();

});


document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        modal.classList.contains("active")
    ) {

        closeModal();

    }

});


/* =========================================
   RENDER LEGENDS
   Markup kartu sama persis dengan kartu squad.
   Data kosong → section & link navbar tersembunyi.
========================================= */

const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));


function renderLegends() {

    const section = document.getElementById("legends");

    const list = document.getElementById("legendsList");

    const navLink = document.getElementById("legendsNav");

    const entries = Object.entries(legends);


    if (!section || !list || !entries.length) return;


    section.hidden = false;

    if (navLink) navLink.hidden = false;


    /* yang paling baru keluar tampil duluan */
    entries.sort(
        (a, b) =>
            Number(b[1].left) - Number(a[1].left) ||
            a[1].name.localeCompare(b[1].name)
    );


    entries.forEach(([id, p]) => {

        const card = document.createElement("article");

        card.className = "player-card legend-card reveal";

        card.dataset.player = id;

        card.tabIndex = 0;

        card.setAttribute("role", "button");


        card.innerHTML = `

            <div class="player-image">

                <img
                    src="${escapeHTML(p.image)}"
                    alt="${escapeHTML(p.name)}"
                    loading="lazy"
                    onerror="this.remove()"
                >

                ${p.retired
                    ? '<span class="legend-badge">RETIRED</span>'
                    : ""}

            </div>

            <div class="player-info">

                <div class="player-number">
                    ${escapeHTML(p.number)}
                </div>

                <div class="player-details">

                    <h3>${escapeHTML(p.name)}</h3>

                    <span>
                        ${escapeHTML(p.role)} ·
                        ${escapeHTML(p.joined)}–${escapeHTML(p.left)}
                    </span>

                </div>

                <span class="player-arrow">↗</span>

            </div>

        `;


        list.append(card);

        /* kartu baru harus didaftarkan ke observer,
           kalau tidak akan tetap transparan (.reveal) */
        revealObserver.observe(card);

    });

}


renderLegends();


/* =========================================
   MOBILE MENU
========================================= */

const menuButton = document.getElementById("menuButton");

const nav = document.querySelector(".nav");


menuButton.addEventListener("click", () => {

    const open = nav.classList.toggle("mobile-open");

    menuButton.setAttribute("aria-expanded", String(open));

});


/* menu tertutup sendiri setelah memilih link */
nav.addEventListener("click", (event) => {

    if (event.target.closest("a")) {

        nav.classList.remove("mobile-open");

        menuButton.setAttribute("aria-expanded", "false");

    }

});


/* =========================================
   HEADER SCROLL
========================================= */

const header = document.getElementById("header");


window.addEventListener("scroll", () => {

    header.classList.toggle("scrolled", window.scrollY > 80);

});


/* =========================================
   FORMATION PLAYER HOVER
========================================= */

document
    .querySelectorAll(".formation-player")
    .forEach((player) => {

        player.addEventListener("mouseenter", () => {

            player.style.zIndex = "5";

        });

    });
