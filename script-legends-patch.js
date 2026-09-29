/* =========================================================
   PATCH room/script.js — THE LEGENDS (ex-member)
   Memakai modal pemain yang sudah ada (#playerModal).

   3 bagian:
   A. Data legends      → taruh di bawah `const players = {...}`
   B. Blok OPEN PLAYER  → HAPUS blok lama ("OPEN PLAYER"), ganti dengan ini
   C. Render legends    → taruh tepat di bawah blok B

   Blok B memakai `modalImage`, `modalNumber`, dst., jadi harus
   berada di bawah bagian "MODAL ELEMENTS" seperti sekarang.
   Blok C memakai `revealObserver` yang sudah dibuat di atas file.
========================================================= */


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
