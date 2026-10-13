/* =========================================================
   FORMATION — BOLA (tahap 2)
   Simpan sebagai: room/formation-ball.js  (file baru, DIUNGGAH)
   Muat SETELAH formation.js:
       <script src="room/formation.js"></script>
       <script src="room/formation-ball.js"></script>

   Bola menggelinding dengan gesekan, memantul di dinding, dan
   terdorong/tertendang oleh pemain yang kamu tarik (kekuatannya
   mengikuti cepat-lambat tarikan). Tahap 3 (gawang) memakai
   `window.FormationBall` di bagian bawah file ini.
========================================================= */

(function () {

    if (!window.Formation) {

        console.warn("formation-ball.js: muat formation.js lebih dulu.");

        return;

    }


    const F = window.Formation;


    /* ---------- PENGATURAN (ubah angka di sini untuk menyetel rasa bola) ---------- */

    const BALL_RADIUS = 13;       /* ukuran bola (piksel) */

    const FRICTION = 1.6;         /* makin besar = bola makin cepat berhenti */

    const WALL_BOUNCE = 0.8;      /* 1 = memantul penuh, 0 = tidak memantul */

    const PLAYER_BOUNCE = 0.85;   /* kenyalnya tendangan pemain */

    const KICK = 1;               /* pengali kekuatan tendangan */

    const MAX_SPEED = 2200;       /* batas kecepatan bola (piksel per detik) */


    const R = BALL_RADIUS;


    /* ---------- pengamat kejadian kecil (untuk file tahap berikutnya) ---------- */

    const listeners = {};

    const on = (name, fn) => {

        (listeners[name] = listeners[name] || []).push(fn);

    };

    const emit = (name, data) => {

        (listeners[name] || []).forEach((fn) => fn(data));

    };


    /* ---------- elemen bola ---------- */

    const style = document.createElement("style");

    style.textContent =

        ".formation-ball{position:absolute;left:0;top:0;width:" + (R * 2) + "px;height:" + (R * 2) + "px;" +

        "pointer-events:none;z-index:3;will-change:transform}" +

        ".formation-ball svg{display:block;width:100%;height:100%}";

    document.head.append(style);


    const ball = document.createElement("div");

    ball.className = "formation-ball";

    ball.setAttribute("aria-hidden", "true");

    ball.innerHTML =

        '<svg viewBox="0 0 24 24">' +

        '<circle cx="12" cy="12" r="11" fill="#fff" stroke="#111" stroke-width="1.5"/>' +

        '<path d="M12 7.2L16 10.1L14.5 14.8H9.5L8 10.1Z" fill="#111"/>' +

        '<path d="M12 7.2V1.5M16 10.1L21.4 8.3M14.5 14.8L17.8 19.4M9.5 14.8L6.2 19.4M8 10.1L2.6 8.3" ' +

        'stroke="#111" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +

        "</svg>";

    F.pitch.append(ball);


    /* ---------- keadaan bola (piksel, relatif ke lapangan) ---------- */

    let x = 0;

    let y = 0;

    let vx = 0;                   /* piksel per detik */

    let vy = 0;

    let rot = 0;                  /* putaran (radian) supaya terlihat menggelinding */

    let lastW = 0;

    let lastH = 0;


    function render() {

        ball.style.transform =

            "translate(" + (x - R) + "px, " + (y - R) + "px) rotate(" + rot + "rad)";

    }


    function reset() {

        const s = F.size();

        x = s.w / 2;

        y = s.h / 2;

        vx = 0;

        vy = 0;

        rot = 0;

        lastW = s.w;

        lastH = s.h;

        render();

    }


    /* ---------- kecepatan pemain (dari tarikan) ---------- */

    const vel = new Map();

    let lastDragAt = 0;


    /* kecepatan dianggap 0 kalau pemain sudah berhenti > 70 ms */
    function playerVel(p) {

        const v = vel.get(p);

        if (!v || performance.now() - v.t > 70) return { x: 0, y: 0 };

        return v;

    }


    /* ---------- tabrakan bola dengan pemain ---------- */

    function collide(p) {

        const at = F.pos(p);

        const dx = x - at.x;

        const dy = y - at.y;

        const min = R + p.radius;

        const d2 = dx * dx + dy * dy;

        if (d2 >= min * min) return;


        const d = Math.sqrt(d2);

        const nx = d < 0.001 ? 1 : dx / d;

        const ny = d < 0.001 ? 0 : dy / d;


        /* dorong bola keluar dari pemain */
        x = at.x + nx * min;

        y = at.y + ny * min;


        /* pantulan relatif terhadap pemain yang sedang bergerak */
        const pv = playerVel(p);

        const px = pv.x * KICK;

        const py = pv.y * KICK;

        const rel = (vx - px) * nx + (vy - py) * ny;

        if (rel < 0) {

            const j = -(1 + PLAYER_BOUNCE) * rel;

            vx += nx * j;

            vy += ny * j;

        }

    }


    /* ---------- dinding: bisa "dibuka" oleh tahap gawang lewat event "wall" ---------- */

    function wall(side, w, h) {

        const e = { side, x, y, w, h, pass: false };

        emit("wall", e);

        return e.pass;

    }


    function walls(w, h) {

        if (x - R < 0 && !wall("left", w, h)) { x = R; vx = Math.abs(vx) * WALL_BOUNCE; }

        if (x + R > w && !wall("right", w, h)) { x = w - R; vx = -Math.abs(vx) * WALL_BOUNCE; }

        if (y - R < 0 && !wall("top", w, h)) { y = R; vy = Math.abs(vy) * WALL_BOUNCE; }

        if (y + R > h && !wall("bottom", w, h)) { y = h - R; vy = -Math.abs(vy) * WALL_BOUNCE; }

    }


    /* ---------- satu langkah fisika (dt dalam detik) ---------- */

    function step(dt) {

        const { w, h } = F.size();


        const damp = Math.exp(-FRICTION * dt);

        vx *= damp;

        vy *= damp;


        x += vx * dt;

        y += vy * dt;

        rot += (vx * dt) / R;


        F.players.forEach(collide);

        walls(w, h);


        const speed = Math.hypot(vx, vy);

        if (speed > MAX_SPEED) {

            vx = (vx / speed) * MAX_SPEED;

            vy = (vy / speed) * MAX_SPEED;

        }

    }


    /* ---------- loop animasi (tidur kalau bola diam) ---------- */

    let running = false;

    let last = 0;


    function frame(now) {

        const dt = Math.min((now - last) / 1000, 0.032);

        last = now;


        /* bagi langkah supaya bola cepat tidak "menembus" pemain */
        const n = Math.min(8, Math.max(1, Math.ceil((Math.hypot(vx, vy) * dt) / 8)));

        for (let i = 0; i < n; i++) step(dt / n);

        render();


        const moving = Math.hypot(vx, vy) > 4;

        const playerActive = performance.now() - lastDragAt < 120;

        if (moving || playerActive) {

            requestAnimationFrame(frame);

        } else {

            running = false;

            vx = 0;

            vy = 0;

        }

    }


    function wake() {

        if (running) return;

        running = true;

        last = performance.now();

        requestAnimationFrame(frame);

    }


    /* ---------- sambungan ke formation.js ---------- */

    F.on("drag", (d) => {

        /* piksel per milidetik → piksel per detik */
        vel.set(d.player, { x: d.vx * 1000, y: d.vy * 1000, t: performance.now() });

        lastDragAt = performance.now();

        wake();

    });

    F.on("drop", (d) => vel.delete(d.player));

    F.on("reset", reset);

    F.on("stop", reset);


    /* ukuran lapangan berubah → bola ikut menyesuaikan */
    window.addEventListener("resize", () => {

        const s = F.size();

        if (lastW > 0 && lastH > 0) {

            x = (x / lastW) * s.w;

            y = (y / lastH) * s.h;

            lastW = s.w;

            lastH = s.h;

            render();

        } else {

            reset();

        }

    });


    reset();


    /* ---------- dibuka untuk file tahap berikutnya (gawang) ---------- */

    window.FormationBall = {

        el: ball,

        radius: R,

        on,

        reset,

        position: () => ({ x, y, vx, vy }),

        setPosition: (nx, ny) => { x = nx; y = ny; render(); },

        kick: (kx, ky) => { vx = kx; vy = ky; wake(); }

    };

})();
