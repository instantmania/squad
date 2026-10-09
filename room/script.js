/* =========================================
   INSTANT MANIA
   INTERACTION
   Simpan sebagai: room/script.js

   Data pemain / legends / POTM sekarang ada di
   room/data.js (harus dimuat SEBELUM file ini).
========================================= */


/* =========================================
   PENGECEKAN: data.js harus sudah dimuat
   Kalau tulisan ini muncul di Console (F12),
   berarti index.html belum memuat room/data.js
   atau file-nya belum terupload.
========================================= */

if (typeof people === "undefined" || typeof legends === "undefined") {

    throw new Error(
        'room/data.js belum dimuat. Tambahkan <script src="room/data.js"></script> ' +
        'SEBELUM <script src="room/script.js"></script> di index.html, ' +
        'dan pastikan file room/data.js ada.'
    );

}


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

const modalInstagram = document.getElementById("modalInstagram");

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
   
    /* ikon Instagram: hanya untuk pemain yang punya akun */
    if (modalInstagram) {
        modalInstagram.hidden = !player.instagram;
        if (player.instagram) {
            modalInstagram.href =
                "https://www.instagram.com/" + encodeURIComponent(player.instagram);
        }
    }

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

/* =========================================================
   LEGENDS — CAROUSEL (langkah 3)  →  room/script.js

   1) Tempel fungsi di bawah TEPAT DI BAWAH fungsi lama
      renderLegends() (jangan hapus yang lama dulu) dan
      SEBELUM baris pemanggilnya.
   2) Ganti baris pemanggil:
          renderLegends();
      menjadi:
          renderLegendCarousel();
   Fungsi memakai helper yang sudah ada di script.js:
   leftOrder, shortYears, escapeHTML, openPlayer.
========================================================= */

function renderLegendCarousel() {

    const section = document.getElementById("legends");

    const carousel = document.getElementById("legendCarousel");

    const track = document.getElementById("legendTrack");

    const dotsBox = document.getElementById("legendDots");

    const info = document.getElementById("legendInfo");

    const nameEl = document.getElementById("legendName");

    const metaEl = document.getElementById("legendMeta");

    const noteEl = document.getElementById("legendNote");

    const openBtn = document.getElementById("legendOpen");

    const navLink = document.getElementById("legendsNav");

    const entries = Object.entries(legends);


    /* belum ada data / HTML carousel belum dipasang → section tetap tersembunyi */
    if (!section || !carousel || !track || !dotsBox || !entries.length) return;


    section.hidden = false;

    if (navLink) navLink.hidden = false;


    /* "present" dulu, lalu yang paling baru keluar */
    entries.sort(
        (a, b) =>
            leftOrder(b[1].left) - leftOrder(a[1].left) ||
            a[1].name.localeCompare(b[1].name)
    );


    let current = 0;

    let busy = false;


    /* ---------- bangun kartu & titik ---------- */

    entries.forEach(([id, p], i) => {

        const card = document.createElement("div");

        card.className = "lc-card";

        card.innerHTML = `

            <img
                src="${escapeHTML(p.image)}"
                alt="${escapeHTML(p.name)}"
                loading="lazy"
                onerror="this.remove()"
            >

            ${p.retired
                ? '<span class="lc-badge">RETIRED</span>'
                : ""}

            <span class="lc-number">${escapeHTML(p.number)}</span>

        `;

        /* kartu tengah → buka profil; kartu samping → geser ke tengah */
        card.addEventListener("click", () => {

            if (i === current) openPlayer(id);

            else update(i);

        });

        track.append(card);


        const dot = document.createElement("button");

        dot.type = "button";

        dot.className = "lc-dot";

        dot.setAttribute("aria-label", p.name);

        dot.addEventListener("click", () => update(i));

        dotsBox.append(dot);

    });


    const cards = [...track.children];

    const dots = [...dotsBox.children];


    /* ---------- pindah kartu ---------- */

    function update(next, instant) {

        if (busy && !instant) return;

        busy = true;


        current = (next + cards.length) % cards.length;


        cards.forEach((card, i) => {

            const offset = (i - current + cards.length) % cards.length;

            card.classList.remove(
                "center", "left-1", "left-2",
                "right-1", "right-2", "hidden"
            );

            if (offset === 0) card.classList.add("center");

            else if (offset === 1) card.classList.add("right-1");

            else if (offset === 2) card.classList.add("right-2");

            else if (offset === cards.length - 1) card.classList.add("left-1");

            else if (offset === cards.length - 2) card.classList.add("left-2");

            else card.classList.add("hidden");

        });


        dots.forEach((dot, i) => {

            dot.classList.toggle("active", i === current);

            if (i === current) dot.setAttribute("aria-current", "true");

            else dot.removeAttribute("aria-current");

        });


        const p = entries[current][1];

        const fillInfo = () => {

            nameEl.textContent = p.name;

            metaEl.textContent = p.role + " · " + shortYears(p);

            noteEl.textContent = p.position || "";

            info.classList.remove("is-changing");

        };


        if (instant) {

            fillInfo();

        } else {

            info.classList.add("is-changing");

            setTimeout(fillInfo, 250);

        }


        setTimeout(() => { busy = false; }, 600);

    }


    /* ---------- kontrol ---------- */

    carousel.querySelector(".lc-arrow.left")
        .addEventListener("click", () => update(current - 1));

    carousel.querySelector(".lc-arrow.right")
        .addEventListener("click", () => update(current + 1));

    openBtn.addEventListener("click", () => openPlayer(entries[current][0]));


    /* panah keyboard hanya saat carousel sedang difokus */
    carousel.addEventListener("keydown", (event) => {

        if (event.key === "ArrowLeft") {

            event.preventDefault();

            update(current - 1);

        } else if (event.key === "ArrowRight") {

            event.preventDefault();

            update(current + 1);

        }

    });


    /* geser jari — hanya di area carousel */
    let touchStartX = 0;

    carousel.addEventListener("touchstart", (event) => {

        touchStartX = event.changedTouches[0].screenX;

    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {

        const diff = touchStartX - event.changedTouches[0].screenX;

        if (Math.abs(diff) > 50) update(current + (diff > 0 ? 1 : -1));

    }, { passive: true });


    update(0, true);

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
   MENU (ikon 3 garis → jendela menu)
========================================= */

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


/* menu tertutup sendiri setelah memilih link */
nav.addEventListener("click", (event) => {

    if (event.target.closest("a")) setMenu(false);

});


/* klik area gelap (latar) atau logo = tutup menu */
const siteHeader = document.getElementById("header");

siteHeader.addEventListener("click", (event) => {

    if (!nav.classList.contains("mobile-open")) return;

    if (event.target === siteHeader || event.target.closest(".brand")) {

        setMenu(false);

    }

});


/* Esc menutup menu */
document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        nav.classList.contains("mobile-open")
    ) {

        setMenu(false);

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
