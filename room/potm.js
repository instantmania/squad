/* =========================================
   INSTANT MANIA — PLAYER OF THE MONTH
   Simpan sebagai: room/potm.js
   Membaca `people` dan `potm` dari room/data.js.

   Pratinjau tanpa mengisi data:
   buka potm.html?demo
========================================= */

(function () {

    const MONTHS = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];

    const demo = new URLSearchParams(location.search).has("demo");


    /* data contoh, hanya muncul lewat ?demo */
    const DEMO = [
        { month: "2026-09", player: "fitra",
          reason: "[DEMO] Alasan singkat kenapa dia terpilih bulan ini.",
          stats: { projects: 6, goals: 18, assists: 7 } },
        { month: "2026-08", player: "alip" },
        { month: "2026-07", player: "bardan" },
        { month: "2026-06", player: "aang" },
        { month: "2026-05", player: "alip" },
        { month: "2026-04", player: "naufal" }
    ];

    const source = demo ? DEMO : potm;


    const esc = (value) =>
        String(value).replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char]));

    const pad = (value) => String(value).padStart(2, "0");

    const parse = (month) => {

        const year = Number(month.slice(0, 4));

        const index = Number(month.slice(5, 7));

        return { year, index, name: MONTHS[index - 1] };

    };


    /* hanya entri yang lengkap & valid */
    const valid = source
        .filter((entry) => {

            if (!entry.player) return false;

            if (!people[entry.player]) {

                console.warn("POTM: pemain tidak ditemukan →", entry.player, entry.month);

                return false;

            }

            if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(entry.month)) {

                console.warn("POTM: format bulan salah →", entry.month);

                return false;

            }

            return true;

        })
        .sort((a, b) => b.month.localeCompare(a.month));


    /* jumlah kemenangan per pemain */
    const wins = {};

    valid.forEach((entry) => {

        wins[entry.player] = (wins[entry.player] || 0) + 1;

    });


    const winnerBox = document.getElementById("winner");

    const archive = document.getElementById("archive");

    const archiveBody = document.getElementById("archiveBody");

    const banner = document.getElementById("demoBanner");

    if (banner) banner.hidden = !demo;


    /* ---------- pemenang terbaru ---------- */

    function renderWinner(entry) {

        const p = people[entry.player];

        const { name, year } = parse(entry.month);

        const monthText = name + " " + year;

        const count = wins[entry.player];


        const stats = [
            ["projects", "PROJECTS", "bulan ini"],
            ["goals", "GOALS", "karya dirilis"],
            ["assists", "ASSISTS", "bantu rekan"]
        ]
            .filter(([key]) =>
                entry.stats &&
                entry.stats[key] !== undefined &&
                entry.stats[key] !== ""
            )
            .map(([key, label, sub]) => `
                <div class="stat">
                    <strong>${esc(pad(entry.stats[key]))}</strong>
                    <span>${label}</span>
                    <small>${sub}</small>
                </div>
            `)
            .join("");


        winnerBox.innerHTML = `

            <div class="photo">

                <span class="photo-label">FOTO PEMAIN</span>

                <img
                    src="${esc(p.image)}"
                    alt="${esc(p.name)}"
                    onerror="this.remove()"
                >

                <span class="ribbon">${monthText}</span>

                <span class="tag">POTM</span>

                <span class="big-number">${esc(p.number)}</span>

            </div>


            <div class="info">

                <p class="kicker">

                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.5 5.6 21.1 7 14l-5.3-5 7.2-.9z"/>
                    </svg>

                    PLAYER OF THE MONTH · ${monthText}

                </p>

                <h2>${esc(p.name)}</h2>

                <p class="role">${esc(p.role)}</p>

                ${count > 1
                    ? `<p class="wins-line">${count}× PLAYER OF THE MONTH</p>`
                    : ""}

                <div class="divider"></div>

                ${entry.reason
                    ? `<p class="reason">${esc(entry.reason)}</p>`
                    : ""}

                ${stats
                    ? `<div class="stats">${stats}</div>`
                    : ""}

                <a class="link" href="index.html?player=${encodeURIComponent(entry.player)}">
                    VIEW PROFILE ↗
                </a>

            </div>

        `;

    }


    function renderEmpty() {

        winnerBox.innerHTML = `

            <div class="empty">

                <span class="empty-title">FIRST WINNER<br>COMING SOON</span>

                <p>Pemenang pertama akan segera diumumkan.</p>

            </div>

        `;

    }


    /* ---------- arsip per tahun ---------- */

    function winCard(entry) {

        const p = people[entry.player];

        const { name, year } = parse(entry.month);

        const count = wins[entry.player];

        return `

            <a class="card" href="index.html?player=${encodeURIComponent(entry.player)}">

                ${count > 1
                    ? `<span class="wins">×${count}</span>`
                    : ""}

                <span class="m">${name} ${year}</span>

                <span class="n">${esc(p.number)}</span>

                <div>
                    <h3>${esc(p.name)}</h3>
                    <p>${esc(p.role)}</p>
                </div>

            </a>

        `;

    }


    function nextCard(slot) {

        return `

            <div class="card next">

                <span class="m">${MONTHS[slot.index - 1]} ${slot.year}</span>

                <span class="n">??</span>

                <div>
                    <h3>NEXT WINNER</h3>
                    <p>TO BE ANNOUNCED</p>
                </div>

            </div>

        `;

    }


    function renderArchive(latest, others) {

        /* slot "NEXT WINNER" = bulan setelah pemenang terbaru */
        const latestInfo = parse(latest.month);

        const slot = latestInfo.index === 12
            ? { year: latestInfo.year + 1, index: 1 }
            : { year: latestInfo.year, index: latestInfo.index + 1 };


        const items = [
            { year: slot.year, html: nextCard(slot), isWin: false },
            ...others.map((entry) => ({
                year: parse(entry.month).year,
                html: winCard(entry),
                isWin: true
            }))
        ];


        /* kelompokkan per tahun (sudah urut dari terbaru) */
        const groups = [];

        items.forEach((item) => {

            let group = groups[groups.length - 1];

            if (!group || group.year !== item.year) {

                group = { year: item.year, cards: [], winners: 0 };

                groups.push(group);

            }

            group.cards.push(item.html);

            if (item.isWin) group.winners += 1;

        });


        archiveBody.innerHTML = groups.map((group) => `

            <div class="year-group">

                <div class="archive-head">
                    <span>PAST WINNERS · ${group.year}</span>
                    <span>${group.winners} WINNER${group.winners === 1 ? "" : "S"}</span>
                </div>

                <div class="grid">
                    ${group.cards.join("")}
                </div>

            </div>

        `).join("");

    }


    if (!valid.length) {

        renderEmpty();

        archive.hidden = true;

    } else {

        const [latest, ...others] = valid;

        renderWinner(latest);

        renderArchive(latest, others);

    }


    /* ---------- menu mobile ---------- */

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

})();
