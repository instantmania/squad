/* =========================================
   INSTANT MANIA
   INTERACTION
========================================= */


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach((element) => {

    revealObserver.observe(element);

});


/* =========================================
   PLAYER DATA
========================================= */

const players = {

    fitra: {

        number: "69",

        name: "FITRA",

        role: "KANG NGABISIN CP",

        position: "Ujung Kiri",

        speciality:
            "Ngedit / Makan / Tidur",

        joined: "2025",

        image: "assets/fitra.jpg"
       

    },


    alip: {

        number: "07",

        name: "ALIP",

        role: "KANG MOSING",

        position: "Di Tengah",

        speciality:
            "Photography / Music / Ngedit",

        joined: "2022",

        image: "assets/alip.jpg"

    },


    naufal: {

        number: "09",

        name: "NAUFAL",

        role: "PRODUCTION",

        position: "Production",

        speciality:
            "Production / Coordination / Creative",

        joined: "2024",

        image: "assets/naufal.jpg"

    },


    nicho: {

        number: "08",

        name: "NICHO",

        role: "MARKETING",

        position: "Marketing",

        speciality:
            "Marketing / Communication / Strategy",

        joined: "2026",

        image: "assets/nicho.jpg"

    },


    aang: {

        number: "17",

        name: "AANG",

        role: "EDITOR",

        position: "Photo & Video Editor",

        speciality:
            "Editing / Color / Retouch",

        joined: "2021",

        image: "assets/aang.jpg"

    },


    bardan: {

        number: "10",

        name: "BARDAN",

        role: "THE PRESIDENT",

        position: "Finance & Support",

        speciality:
            "Finance / Administration / Venue",

        joined: "2023",

        image: "assets/bardan.jpg"

    }

};
/* =========================================
   A. LEGENDS DATA (ex-member)
   Bentuk sama dengan `players`, ditambah:
   left    : tahun keluar
   retired : true = badge RETIRED di kartu
========================================= */

const legends = {

    contoh1: {

        number: "11",

        name: "NAMA EX-MEMBER 1",

        role: "PHOTOGRAPHER",

        position: "Ganti posisi",

        speciality:
            "Ganti skill / kontribusi",

        joined: "2023",

        left: "2024",

        retired: true,

        image: "assets/legends/contoh1.jpg"

    },


    contoh2: {

        number: "05",

        name: "NAMA EX-MEMBER 2",

        role: "VIDEOGRAPHER",

        position: "Ganti posisi",

        speciality:
            "Ganti skill / kontribusi",

        joined: "2023",

        left: "2025",

        retired: false,

        image: "assets/legends/contoh2.jpg"

    }

};


/* gabungan: modal bisa membuka pemain aktif maupun legend */
const people = { ...players, ...legends };



/* =========================================
   MODAL ELEMENTS
========================================= */

const modal =
    document.getElementById("playerModal");

const modalClose =
    document.getElementById("modalClose");

const modalImage =
    document.getElementById("modalImage");

const modalNumber =
    document.getElementById("modalNumber");

const modalName =
    document.getElementById("modalName");

const modalRole =
    document.getElementById("modalRole");

const modalPosition =
    document.getElementById("modalPosition");

const modalSpeciality =
    document.getElementById("modalSpeciality");

const modalJoined =
    document.getElementById("modalJoined");


/* =========================================
   B. OPEN PLAYER (pengganti blok lama)
   Event delegation: kartu yang dibuat lewat JS
   (legends) ikut bisa diklik.
========================================= */

const modalJoinedLabel =
    document.getElementById("modalJoinedLabel");


function openPlayer(playerId) {

    const player = people[playerId];

    if (!player) return;


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

}


document.addEventListener("click", (event) => {

    const card = event.target.closest(".player-card");

    if (!card) return;

    openPlayer(card.dataset.player);

});

/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


modalClose.addEventListener(
    "click",
    closeModal
);


modal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);

/* =========================================
   C. RENDER LEGENDS
   Markup kartu sama persis dengan kartu squad
   di index.html, jadi CSS-nya ikut.
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


    /* belum ada data → section & link navbar tetap tersembunyi */
    if (!section || !list || !entries.length) return;


    section.hidden = false;

    if (navLink) navLink.hidden = false;


    /* yang paling baru keluar tampil duluan */
    entries.sort(
        (a, b) => Number(b[1].left) - Number(a[1].left)
    );


    entries.forEach(([id, p]) => {

        const card = document.createElement("article");

        card.className = "player-card legend-card reveal";

        card.dataset.player = id;

        card.tabIndex = 0;


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


        /* Enter / Spasi = sama seperti klik */
        card.addEventListener("keydown", (event) => {

            if (event.key === "Enter" || event.key === " ") {

                event.preventDefault();

                openPlayer(id);

            }

        });


        list.append(card);

        /* kartu baru harus didaftarkan ke observer,
           kalau tidak akan tetap transparan (.reveal) */
        revealObserver.observe(card);

    });

}


renderLegends();
/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {

            closeModal();

        }

    }
);


/* =========================================
   MOBILE MENU
========================================= */

const menuButton =
    document.getElementById("menuButton");


const nav =
    document.querySelector(".nav");


menuButton.addEventListener(
    "click",
    () => {

        nav.classList.toggle(
            "mobile-open"
        );

    }
);


/* =========================================
   HEADER SCROLL
========================================= */

const header =
    document.getElementById("header");


let lastScroll = 0;


window.addEventListener(
    "scroll",
    () => {

        const currentScroll =
            window.scrollY;


        if (
            currentScroll > 80
        ) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }


        lastScroll =
            currentScroll;

    }
);


/* =========================================
   FORMATION PLAYER HOVER
========================================= */

document
    .querySelectorAll(".formation-player")
    .forEach((player) => {

        player.addEventListener(
            "mouseenter",
            () => {

                player.style.zIndex = "5";

            }
        );

    });
