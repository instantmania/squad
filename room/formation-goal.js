/* =========================================================
   FORMATION — GAWANG & PERAYAAN GOL (tahap 3)
   Simpan sebagai: room/formation-goal.js  (file baru, DIUNGGAH)
   Muat SETELAH formation.js dan formation-ball.js:
       <script src="room/formation.js"></script>
       <script src="room/formation-ball.js"></script>
       <script src="room/formation-goal.js"></script>

   - Kotak kecil di kiri & kanan lapangan (.pitch-box) = gawang.
     Bola yang melewati garis di dalam mulut gawang = GOL;
     di luar mulut gawang (tiang) bola tetap memantul.
   - Perayaan: tulisan GOAL!, nama pencetak gol, hamburan
     konfeti, gawang berkedip, lalu bola kembali ke tengah.
   - Penghitung "GOALS n" tampil di samping tombol saat PLAY;
     kembali ke 0 saat STOP.
========================================================= */

(function () {

    if (!window.Formation || !window.FormationBall) {

        console.warn("formation-goal.js: muat formation.js dan formation-ball.js lebih dulu.");

        return;

    }


    const F = window.Formation;

    const B = window.FormationBall;


    /* ---------- PENGATURAN ---------- */

    const CELEBRATE_MS = 2600;        /* lama perayaan */

    const CONFETTI_COUNT = 40;

    const COLORS = ["#145cff", "#111111", "#ffd400", "#ff4d4d", "#18b26b"];

    const WORDS = "GOAL!";


    /* ---------- gaya (dibuat sendiri oleh file ini) ---------- */

    const style = document.createElement("style");

    style.textContent =

        ".goal-overlay{position:absolute;inset:0;z-index:8;display:flex;flex-direction:column;align-items:center;" +

        "justify-content:center;pointer-events:none;overflow:hidden;transition:opacity .3s ease}" +

        ".goal-text{font-family:var(--heading);font-size:clamp(72px,14vw,190px);font-weight:900;line-height:.8;" +

        "letter-spacing:-.03em;color:var(--blue);text-shadow:0 6px 30px rgba(20,92,255,.25);" +

        "animation:goalPop .55s cubic-bezier(.2,1.4,.4,1) both}" +

        ".goal-scorer{margin-top:18px;font-family:var(--heading);font-size:clamp(16px,2.4vw,26px);font-weight:700;" +

        "letter-spacing:.18em;color:var(--black);animation:goalFade .4s .25s ease both}" +

        ".goal-confetti{position:absolute;display:block;opacity:0;" +

        "animation:goalConfetti var(--t) cubic-bezier(.15,.7,.35,1) var(--d) forwards}" +

        ".goal-hit{animation:goalFlash .6s ease 3}" +

        ".formation-photo.scorer{animation:goalRing .6s ease 4}" +

        ".formation-score{font-family:var(--heading);font-size:12px;font-weight:700;letter-spacing:.15em;" +

        "color:var(--blue)}" +

        ".formation-score[hidden]{display:none}" +

        ".goal-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +

        "@keyframes goalPop{from{opacity:0;transform:scale(.4) rotate(-6deg)}to{opacity:1;transform:none}}" +

        "@keyframes goalFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" +

        "@keyframes goalConfetti{0%{opacity:1;transform:translate(0,0) rotate(0)}" +

        "100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}" +

        "@keyframes goalFlash{0%,100%{background-color:transparent}50%{background-color:rgba(20,92,255,.28)}}" +

        "@keyframes goalRing{0%{box-shadow:0 0 0 0 rgba(20,92,255,.55)}100%{box-shadow:0 0 0 16px rgba(20,92,255,0)}}" +

        "@media (prefers-reduced-motion:reduce){.goal-text,.goal-scorer,.goal-hit,.formation-photo.scorer{animation:none}}";

    document.head.append(style);


    /* ---------- penghitung & pengumuman untuk pembaca layar ---------- */

    const bar = document.querySelector(".formation-controls");

    const score = document.createElement("span");

    score.className = "formation-score";

    score.hidden = true;

    if (bar) bar.append(score);


    const live = document.createElement("div");

    live.className = "goal-sr";

    live.setAttribute("role", "status");

    F.pitch.append(live);


    /* ---------- keadaan ---------- */

    let goals = 0;

    let celebrating = false;

    let timer = null;

    let fadeTimer = null;

    let lastToucher = null;

    let current = null;           /* { overlay, box, photo } yang sedang dirayakan */


    B.on("touch", (d) => { lastToucher = d.player; });


    const reduceMotion = () =>

        !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);


    /* ---------- mulut gawang (kotak .pitch-box di kiri / kanan) ---------- */

    function mouth(side) {

        const pr = F.pitch.getBoundingClientRect();

        const top = pr.top + F.pitch.clientTop;

        const left = pr.left + F.pitch.clientLeft;

        const half = F.size().w / 2;


        const box = [...F.pitch.querySelectorAll(".pitch-box")].find((b) => {

            const r = b.getBoundingClientRect();

            const cx = r.left + r.width / 2 - left;

            return side === "left" ? cx < half : cx > half;

        });

        if (!box) return null;


        const r = box.getBoundingClientRect();

        return { el: box, y1: r.top - top, y2: r.bottom - top };

    }


    /* ---------- dinding: buka mulut gawang untuk bola ---------- */

    B.on("wall", (e) => {

        if (e.side !== "left" && e.side !== "right") return;


        /* saat perayaan bola tidak memantul lagi */
        if (celebrating) { e.pass = true; return; }


        const m = mouth(e.side);

        if (!m || e.y < m.y1 || e.y > m.y2) return;     /* tiang / di luar gawang → memantul */


        e.pass = true;


        const crossed = e.side === "left" ? e.x < 0 : e.x > e.w;

        if (crossed) goal(e.side, m);

    });


    /* ---------- GOL! ---------- */

    function goal(side, m) {

        if (celebrating) return;

        celebrating = true;

        goals += 1;

        score.textContent = "GOALS " + goals;


        B.kick(0, 0);

        B.el.style.visibility = "hidden";


        const who = lastToucher;

        const calm = reduceMotion();


        /* tulisan GOAL! + nama pencetak gol */
        const overlay = document.createElement("div");

        overlay.className = "goal-overlay";


        const text = document.createElement("span");

        text.className = "goal-text";

        text.textContent = WORDS;

        overlay.append(text);


        let scorerLabel = "";

        if (who) {

            const num = who.el.querySelector("strong");

            scorerLabel = (num ? num.textContent.trim() + " · " : "") + who.name;

            const line = document.createElement("span");

            line.className = "goal-scorer";

            line.textContent = scorerLabel;

            overlay.append(line);

        }


        /* konfeti dari mulut gawang */
        if (!calm) {

            const { w } = F.size();

            const ox = side === "left" ? 0 : w;

            const oy = (m.y1 + m.y2) / 2;

            const dir = side === "left" ? 1 : -1;


            for (let i = 0; i < CONFETTI_COUNT; i++) {

                const c = document.createElement("span");

                c.className = "goal-confetti";

                const s = 6 + Math.random() * 6;

                c.style.left = ox + "px";

                c.style.top = oy + "px";

                c.style.width = s + "px";

                c.style.height = s * (0.5 + Math.random() * 0.8) + "px";

                c.style.background = COLORS[i % COLORS.length];

                c.style.setProperty("--dx", dir * (80 + Math.random() * 520) + "px");

                c.style.setProperty("--dy", (Math.random() * 520 - 260) + "px");

                c.style.setProperty("--r", (Math.random() * 1440 - 720) + "deg");

                c.style.setProperty("--t", (1.1 + Math.random() * 0.8) + "s");

                c.style.setProperty("--d", (Math.random() * 0.12) + "s");

                overlay.append(c);

            }

        }


        F.pitch.append(overlay);


        /* gawang berkedip & foto pencetak gol berdenyut */
        let photo = null;

        if (!calm) {

            m.el.classList.add("goal-hit");

            if (who) {

                photo = who.el.querySelector(".formation-photo");

                if (photo) photo.classList.add("scorer");

            }

        }


        live.textContent = "Gol!" + (scorerLabel ? " " + scorerLabel : "") + ". Total " + goals + " gol.";


        current = { overlay, box: m.el, photo };

        fadeTimer = setTimeout(() => { overlay.style.opacity = "0"; }, CELEBRATE_MS - 300);

        timer = setTimeout(endCelebration, CELEBRATE_MS);

    }


    function endCelebration() {

        clearTimeout(timer);

        clearTimeout(fadeTimer);


        if (current) {

            current.overlay.remove();

            current.box.classList.remove("goal-hit");

            if (current.photo) current.photo.classList.remove("scorer");

            current = null;

        }


        if (celebrating) {

            celebrating = false;

            B.reset();

            B.el.style.visibility = "";

        }

        lastToucher = null;

    }


    /* ---------- sambungan ke tombol PLAY / STOP / RESET ---------- */

    F.on("play", () => {

        score.textContent = "GOALS " + goals;

        score.hidden = false;

    });

    F.on("reset", endCelebration);          /* skor dipertahankan */

    F.on("stop", () => {

        endCelebration();

        goals = 0;

        score.hidden = true;

    });


    window.FormationGoal = { goals: () => goals, celebrating: () => celebrating };

})();
