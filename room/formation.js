/* =========================================================
   FORMATION — PEMAIN BISA DIGERAK (tahap 1)
   Simpan sebagai: room/formation.js  (file baru, DIUNGGAH)
   Muat di index.html SETELAH room/script.js:
       <script src="room/formation.js"></script>

   Yang dilakukan file ini:
   - menambah tombol PLAY / STOP dan RESET di atas lapangan
   - saat PLAY: pemain bisa ditarik (mouse/jari) atau digeser
     dengan tombol panah, dibatasi di dalam garis lapangan
   - RESET mengembalikan semua pemain ke posisi awal

   Tahap berikutnya (bola, gawang) akan berupa file TERPISAH
   yang memakai `window.Formation` di bawah, jadi file ini
   tidak perlu diedit lagi.
========================================================= */

(function () {

    const pitch = document.querySelector(".pitch");

    if (!pitch) return;


    const playerEls = [...pitch.querySelectorAll(".formation-player")];

    if (!playerEls.length) return;


    /* ---------- pengamat kejadian kecil (untuk file tahap berikutnya) ---------- */

    const listeners = {};

    const on = (name, fn) => {

        (listeners[name] = listeners[name] || []).push(fn);

    };

    const emit = (name, data) => {

        (listeners[name] || []).forEach((fn) => fn(data));

    };


    /* ---------- ukuran lapangan (bagian dalam garis tepi) ---------- */

    const size = () => ({ w: pitch.clientWidth, h: pitch.clientHeight });


    /* ---------- baca posisi awal dari CSS (.player-1 dst.) ---------- */

    const pr = pitch.getBoundingClientRect();

    const innerLeft = pr.left + pitch.clientLeft;

    const innerTop = pr.top + pitch.clientTop;


    const players = playerEls.map((el) => {

        const photo = el.querySelector(".formation-photo") || el;

        const name = el.querySelector("small");

        const r = photo.getBoundingClientRect();

        const radius = r.width / 2;


        const player = {

            el,

            name: name ? name.textContent.trim() : "",

            radius,

            /* posisi = PUSAT FOTO, disimpan sebagai pecahan lebar/tinggi lapangan
               supaya tetap pas saat ukuran layar berubah */
            fx: (r.left + radius - innerLeft) / pitch.clientWidth,

            fy: (r.top + r.height / 2 - innerTop) / pitch.clientHeight

        };

        player.startFx = player.fx;

        player.startFy = player.fy;

        return player;

    });


    /* batas gerak: seluruh pemain (foto + label) tetap di dalam lapangan */
    function limits(p) {

        const { w, h } = size();

        const boxW = p.el.offsetWidth;

        const boxH = p.el.offsetHeight;

        return {

            minX: p.radius,

            maxX: w - p.radius,

            minY: boxH / 2,

            maxY: h - boxH / 2

        };

    }


    /* posisi dalam piksel (pusat foto) */
    function pos(p) {

        const { w, h } = size();

        return { x: p.fx * w, y: p.fy * h };

    }


    function apply(p) {

        p.el.style.left = (p.fx * 100) + "%";

        p.el.style.top = (p.fy * 100) + "%";

        p.el.style.right = "auto";

        p.el.style.bottom = "auto";

        const w = size().w;
 
        const need = p.el.offsetWidth - p.radius;     /* lebar label di kanan pusat foto */
 
        const x = p.fx * w;
 
        p.flip = p.flip ? x + need > w - 12 : x + need > w;
 
        p.el.style.flexDirection = p.flip ? "row-reverse" : "";
 
        p.el.style.transform = "translate(-" + (p.flip ? need : p.radius) + "px, -50%)";

    }


    function setPos(p, x, y) {

        const { w, h } = size();

        const lim = limits(p);

        const cx = Math.min(Math.max(x, lim.minX), lim.maxX);

        const cy = Math.min(Math.max(y, lim.minY), lim.maxY);

        p.fx = cx / w;

        p.fy = cy / h;

        apply(p);

        return { x: cx, y: cy };

    }


    players.forEach(apply);
    window.addEventListener("resize", () => players.forEach(apply));


    /* ---------- tombol kontrol ---------- */

    const wrapper = pitch.closest(".formation-wrapper") || pitch.parentElement;

    const bar = document.createElement("div");

    bar.className = "formation-controls";


    const playBtn = document.createElement("button");

    playBtn.type = "button";

    playBtn.className = "formation-btn primary";

    playBtn.textContent = "PLAY";

    playBtn.setAttribute("aria-pressed", "false");


    const resetBtn = document.createElement("button");

    resetBtn.type = "button";

    resetBtn.className = "formation-btn";

    resetBtn.textContent = "RESET";

    resetBtn.hidden = true;


    const hint = document.createElement("span");

    hint.className = "formation-hint";

    hint.textContent = "DRAG THE PLAYERS";

    hint.hidden = true;


    bar.append(playBtn, resetBtn, hint);

    wrapper.parentNode.insertBefore(bar, wrapper);


    /* ---------- PLAY / STOP / RESET ---------- */

    let playing = false;


    function setPlaying(value) {

        playing = value;

        pitch.classList.toggle("is-playing", playing);

        playBtn.textContent = playing ? "STOP" : "PLAY";

        playBtn.setAttribute("aria-pressed", String(playing));

        resetBtn.hidden = !playing;

        hint.hidden = !playing;

        emit(playing ? "play" : "stop", null);

    }


    function reset() {

        /* gerak halus menuju posisi awal */
        pitch.classList.add("resetting");

        players.forEach((p) => {

            p.fx = p.startFx;

            p.fy = p.startFy;

            apply(p);

        });

        setTimeout(() => pitch.classList.remove("resetting"), 600);

        emit("reset", null);

    }


    playBtn.addEventListener("click", () => setPlaying(!playing));

    resetBtn.addEventListener("click", reset);


    /* ---------- tarik pemain (mouse & sentuh) ---------- */

    let drag = null;


    players.forEach((p) => {

        p.el.addEventListener("pointerdown", (event) => {

            if (!playing) return;

            if (event.button !== undefined && event.button !== 0) return;


            event.preventDefault();

            const at = pos(p);

            const box = pitch.getBoundingClientRect();

            drag = {

                player: p,

                pointerId: event.pointerId,

                /* selisih antara jari dan pusat foto, supaya tidak "melompat" */
                offX: event.clientX - (box.left + pitch.clientLeft) - at.x,

                offY: event.clientY - (box.top + pitch.clientTop) - at.y,

                lastX: at.x,

                lastY: at.y,

                lastT: performance.now(),

                vx: 0,

                vy: 0

            };

            p.el.classList.add("dragging");

            if (p.el.setPointerCapture) p.el.setPointerCapture(event.pointerId);

        });


        p.el.addEventListener("pointermove", (event) => {

            if (!drag || drag.player !== p || event.pointerId !== drag.pointerId) return;


            const box = pitch.getBoundingClientRect();

            const x = event.clientX - (box.left + pitch.clientLeft) - drag.offX;

            const y = event.clientY - (box.top + pitch.clientTop) - drag.offY;

            const now = setPos(p, x, y);


            /* kecepatan (piksel per milidetik), diperhalus — dipakai tahap bola */
            const t = performance.now();

            const dt = Math.max(t - drag.lastT, 1);

            drag.vx = drag.vx * 0.6 + ((now.x - drag.lastX) / dt) * 0.4;

            drag.vy = drag.vy * 0.6 + ((now.y - drag.lastY) / dt) * 0.4;

            drag.lastX = now.x;

            drag.lastY = now.y;

            drag.lastT = t;


            emit("drag", { player: p, x: now.x, y: now.y, vx: drag.vx, vy: drag.vy });

        });


        const end = (event) => {

            if (!drag || drag.player !== p) return;

            if (event.pointerId !== drag.pointerId) return;

            p.el.classList.remove("dragging");

            if (p.el.releasePointerCapture) {

                try { p.el.releasePointerCapture(event.pointerId); } catch (e) { /* sudah lepas */ }

            }

            emit("drop", { player: p });

            drag = null;

        };

        p.el.addEventListener("pointerup", end);

        p.el.addEventListener("pointercancel", end);


        /* tombol panah menggeser pemain yang sedang difokus */
        p.el.addEventListener("keydown", (event) => {

            if (!playing) return;

            const step = event.shiftKey ? 30 : 10;

            const move = {

                ArrowLeft: [-step, 0],

                ArrowRight: [step, 0],

                ArrowUp: [0, -step],

                ArrowDown: [0, step]

            }[event.key];

            if (!move) return;

            event.preventDefault();

            const at = pos(p);

            const now = setPos(p, at.x + move[0], at.y + move[1]);

            emit("drag", { player: p, x: now.x, y: now.y, vx: 0, vy: 0 });

        });

    });


    /* ---------- dibuka untuk file tahap berikutnya (bola, gawang) ---------- */

    window.Formation = {

        pitch,

        players,

        size,

        pos,

        setPos,

        limits,

        on,

        isPlaying: () => playing

    };

})();
