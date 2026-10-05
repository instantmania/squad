/* =========================================
   INSTANT MANIA
   INTERACTION
   Simpan sebagai: room/script.js

   Data pemain / legends / POTM sekarang ada di
   room/data.js (harus dimuat SEBELUM file ini).
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


const MONTH_NAMES = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

/* ambil tahun 4 digit dari teks ("March, 2026" → "2026") */
const yearOf = (value) => {

    const match = String(value).match(/\d{4}/);

    return match ? match[0] : null;

};

/* angka pengurut: tahun*100 + bulan; tanpa tahun ("present") = paling atas */
const leftOrder = (value) => {

    const text = String(value).toLowerCase();

    const year = yearOf(text);

    if (!year) return Infinity;

    return Number(year) * 100 + (MONTH_NAMES.findIndex((m) => text.includes(m)) + 1);

};

/* teks singkat untuk kartu: "2022–PRESENT", "2026–2026" */
const shortYears = (p) =>
    (yearOf(p.joined) || p.joined) + "–" +
    (yearOf(p.left) || String(p.left).toUpperCase());


function renderLegends() {

    const section = document.getElementById("legends");

    const list = document.getElementById("legendsList");

    const navLink = document.getElementById("legendsNav");

    const entries = Object.entries(legends);


    if (!section || !list || !entries.length) return;


    section.hidden = false;

    if (navLink) navLink.hidden = false;


    /* urut: "present" (masih ada) dulu, lalu yang paling baru keluar.
       `left` boleh "2025", "September, 2026", atau "present". */
    entries.sort(
        (a, b) =>
            leftOrder(b[1].left) - leftOrder(a[1].left) ||
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
                        ${escapeHTML(shortYears(p))}
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
   BUKA POPUP LEWAT LINK
   mis. index.html?player=fitra
   (dipakai tombol VIEW PROFILE di halaman POTM)
========================================= */

const requestedPlayer =
    new URLSearchParams(location.search).get("player");

if (requestedPlayer && people[requestedPlayer]) {

    openPlayer(requestedPlayer);

}


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
