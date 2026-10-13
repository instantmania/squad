/* =========================================================
   FORMATION — TABRAKAN ANTAR PEMAIN
   Simpan sebagai: room/formation-bump.js  (file baru, DIUNGGAH)
   Muat SETELAH formation.js (urutan terhadap file bola/gawang bebas):
       <script src="room/formation-bump.js"></script>

   Saat pemain yang kamu tarik menabrak pemain lain:
   - yang ditabrak terdorong MUNDUR sedikit (bukan melesat seperti
     bola), lalu diam di tempat barunya
   - kedua foto sedikit "penyok" sebagai kesan benturan
   - pemain yang ditarik tidak bisa menembus pemain lain; ia berhenti
     di permukaannya dan bisa meluncur mengitarinya
   Tabrakan pelan hanya menahan, tidak mendorong.
========================================================= */

(function () {

    if (!window.Formation) {

        console.warn("formation-bump.js: muat formation.js lebih dulu.");

        return;

    }


    const F = window.Formation;


    /* ---------- PENGATURAN (ubah angka untuk menyetel rasa tabrakan) ---------- */

    const MIN_IMPACT = 90;         /* kecepatan minimal (px/detik) agar dianggap benturan */

    const PUSH_PER_SPEED = 0.02;   /* jarak dorong = kecepatan × angka ini */

    const PUSH_MIN = 8;            /* dorongan terkecil (piksel) */

    const PUSH_MAX = 30;           /* dorongan terbesar (piksel) — "sedikit" */

    const TWEEN_MS = 240;          /* lama pemain terdorong */

    const COOLDOWN_MS = 300;       /* jeda antar benturan pasangan pemain yang sama */

    const BLOCK = true;            /* true = pemain tidak bisa menembus pemain lain */

    const VIBRATE = false;         /* true = getar singkat di ponsel (jika didukung) */


    /* ---------- gaya "penyok" (dibuat sendiri oleh file ini) ---------- */

    const style = document.createElement("style");

    style.textContent =

        ".formation-photo.bump{animation:bumpHit .32s ease-out}" +

        ".formation-photo.bump-soft{animation:bumpSoft .26s ease-out}" +

        "@keyframes bumpHit{0%{transform:scale(1)}25%{transform:scale(.8,1.14)}" +

        "55%{transform:scale(1.1,.92)}100%{transform:scale(1)}}" +

        "@keyframes bumpSoft{0%{transform:scale(1)}35%{transform:scale(.92,1.06)}100%{transform:scale(1)}}" +

        "@media (prefers-reduced-motion:reduce){.formation-photo.bump,.formation-photo.bump-soft{animation:none}}";

    document.head.append(style);


    const reduceMotion = () =>

        !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);


    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);


    /* ---------- efek "penyok" pada foto ---------- */

    const squashTimers = new Map();


    function squash(p, strong) {

        const photo = p.el.querySelector(".formation-photo");

        if (!photo || reduceMotion()) return;


        photo.classList.remove("bump", "bump-soft");

        void photo.offsetWidth;                       /* mulai ulang animasi */

        photo.classList.add(strong ? "bump" : "bump-soft");


        clearTimeout(squashTimers.get(p));

        squashTimers.set(p, setTimeout(() => {

            photo.classList.remove("bump", "bump-soft");

        }, 400));

    }


    /* ---------- dorongan halus (bukan gerak bebas seperti bola) ---------- */

    const tweens = new Map();

    let raf = 0;


    function tick(now) {

        raf = 0;

        tweens.forEach((tw, q) => {

            /* kalau pemain itu sedang ditarik orang, jangan diganggu */
            if (q.el.classList.contains("dragging")) { tweens.delete(q); return; }


            const t = Math.min((now - tw.t0) / TWEEN_MS, 1);

            const ease = 1 - Math.pow(1 - t, 3);          /* melambat di ujung */

            F.setPos(q, tw.fx + (tw.tx - tw.fx) * ease, tw.fy + (tw.ty - tw.fy) * ease);

            if (t >= 1) tweens.delete(q);

        });

        if (tweens.size) raf = requestAnimationFrame(tick);

    }


    function knock(q, nx, ny, push) {

        if (q.el.classList.contains("dragging")) return;


        const at = F.pos(q);

        const lim = F.limits(q);

        const tx = clamp(at.x + nx * push, lim.minX, lim.maxX);

        const ty = clamp(at.y + ny * push, lim.minY, lim.maxY);


        if (reduceMotion() || TWEEN_MS <= 0) {

            F.setPos(q, tx, ty);

            return;

        }


        tweens.set(q, { fx: at.x, fy: at.y, tx, ty, t0: performance.now() });

        if (!raf) raf = requestAnimationFrame(tick);

    }


    /* ---------- deteksi tabrakan saat pemain ditarik ---------- */

    const lastBump = new Map();


    F.on("drag", (d) => {

        const p = d.player;

        const now = performance.now();


        F.players.forEach((q) => {

            if (q === p) return;


            const a = F.pos(p);

            const b = F.pos(q);

            const dx = b.x - a.x;

            const dy = b.y - a.y;

            const min = p.radius + q.radius;

            const dist = Math.hypot(dx, dy);

            if (dist >= min) return;


            /* arah dari pemain yang ditarik ke yang ditabrak */
            const nx = dist < 0.001 ? 1 : dx / dist;

            const ny = dist < 0.001 ? 0 : dy / dist;


            /* kecepatan searah tabrakan (piksel per detik) */
            const speed = (d.vx * nx + d.vy * ny) * 1000;

            const key = F.players.indexOf(p) + "-" + F.players.indexOf(q);


            if (speed > MIN_IMPACT && now - (lastBump.get(key) || 0) > COOLDOWN_MS) {

                lastBump.set(key, now);

                knock(q, nx, ny, clamp(speed * PUSH_PER_SPEED, PUSH_MIN, PUSH_MAX));

                squash(q, true);

                squash(p, false);

                if (VIBRATE && navigator.vibrate) navigator.vibrate(12);

            }


            /* pemain yang ditarik berhenti di permukaan pemain lain */
            if (BLOCK) F.setPos(p, b.x - nx * min, b.y - ny * min);

        });

    });


    /* RESET / STOP: hentikan dorongan yang sedang berjalan */
    const cancel = () => {

        tweens.clear();

        lastBump.clear();

    };

    F.on("reset", cancel);

    F.on("stop", cancel);

})();
