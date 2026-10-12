/* =========================================================
   LIGHTBOX FOTO MATCHDAY
   Simpan sebagai: room/lightbox.js  (file ini DIUNGGAH)
   Muat di halaman artikel, tepat sebelum </body>:
       <script src="../room/lightbox.js"></script>

   Klik foto sampul / galeri → tampil ukuran penuh (sesuai
   rasio aslinya, potret maupun lanskap) dengan tombol
   sebelumnya/berikutnya, panah keyboard, dan geser jari.
   Overlay dibuat oleh script ini — tidak perlu HTML tambahan.
========================================================= */

(function () {

    /* foto mana saja yang bisa dibuka (ubah kalau perlu) */
    const SELECTOR = ".article-cover img, .article-gallery img";


    let items = [];

    let index = 0;

    let lastFocus = null;


    /* ---------- bangun overlay ---------- */

    const make = (tag, className, label) => {

        const node = document.createElement(tag);

        node.className = className;

        if (label) node.setAttribute("aria-label", label);

        return node;

    };


    const root = make("div", "lb", "Pratinjau foto");

    root.setAttribute("role", "dialog");

    root.setAttribute("aria-modal", "true");

    root.setAttribute("aria-hidden", "true");


    const closeBtn = make("button", "lb-close", "Tutup");

    closeBtn.type = "button";

    closeBtn.textContent = "×";


    const prevBtn = make("button", "lb-arrow lb-prev", "Foto sebelumnya");

    prevBtn.type = "button";

    prevBtn.textContent = "‹";


    const nextBtn = make("button", "lb-arrow lb-next", "Foto berikutnya");

    nextBtn.type = "button";

    nextBtn.textContent = "›";


    const stage = make("figure", "lb-stage");

    const imgEl = make("img", "lb-img");

    imgEl.alt = "";

    stage.append(imgEl);


    const countEl = make("div", "lb-count");


    root.append(closeBtn, prevBtn, stage, nextBtn, countEl);

    document.body.append(root);


    /* ---------- menampilkan foto ---------- */

    const sourceOf = (img) => img.dataset.full || img.currentSrc || img.src;


    imgEl.addEventListener("load", () => imgEl.classList.remove("loading"));

    imgEl.addEventListener("error", () => imgEl.classList.remove("loading"));


    function show(i) {

        index = (i + items.length) % items.length;


        const img = items[index];

        const src = sourceOf(img);


        /* src sama & sudah termuat → event load tidak akan menyala lagi */
        if (imgEl.getAttribute("src") === src && imgEl.complete) {

            imgEl.classList.remove("loading");

        } else {

            imgEl.classList.add("loading");

            imgEl.src = src;

        }


        imgEl.alt = img.alt || "";

        countEl.textContent = (index + 1) + " / " + items.length;


        /* muat foto di kiri-kanan lebih dulu supaya geser terasa cepat */
        [index - 1, index + 1].forEach((n) => {

            const near = items[(n + items.length) % items.length];

            if (near && near !== img) new Image().src = sourceOf(near);

        });

    }


    /* ---------- buka / tutup ---------- */

    const isOpen = () => root.classList.contains("open");


    function open(img) {

        items = [...document.querySelectorAll(SELECTOR)];

        const start = items.indexOf(img);

        if (start === -1) return;


        lastFocus = document.activeElement;


        prevBtn.hidden = nextBtn.hidden = items.length < 2;

        countEl.hidden = items.length < 2;


        root.classList.add("open");

        root.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";


        show(start);

        closeBtn.focus();

    }


    function close() {

        root.classList.remove("open");

        root.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        if (lastFocus && lastFocus.focus) lastFocus.focus();

    }


    /* ---------- pemicu: klik / Enter / Spasi pada foto ---------- */

    document.querySelectorAll(SELECTOR).forEach((img) => {

        img.tabIndex = 0;

        img.setAttribute("role", "button");

        img.setAttribute("aria-label", "Buka foto ukuran penuh");

    });


    document.addEventListener("click", (event) => {

        const img = event.target.closest && event.target.closest(SELECTOR);

        if (img) open(img);

    });


    document.addEventListener("keydown", (event) => {

        if (!isOpen()) {

            const img = event.target.closest && event.target.closest(SELECTOR);

            if (img && (event.key === "Enter" || event.key === " ")) {

                event.preventDefault();

                open(img);

            }

            return;

        }


        if (event.key === "Escape") close();

        else if (event.key === "ArrowLeft") show(index - 1);

        else if (event.key === "ArrowRight") show(index + 1);

        else if (event.key === "Tab") {

            /* fokus tetap berputar di dalam lightbox */
            const focusable = [closeBtn, prevBtn, nextBtn].filter((b) => !b.hidden);

            const at = focusable.indexOf(document.activeElement);

            const next = event.shiftKey
                ? (at <= 0 ? focusable.length - 1 : at - 1)
                : (at === focusable.length - 1 ? 0 : at + 1);

            event.preventDefault();

            focusable[next].focus();

        }

    });


    /* ---------- tombol & klik latar ---------- */

    closeBtn.addEventListener("click", close);

    prevBtn.addEventListener("click", () => show(index - 1));

    nextBtn.addEventListener("click", () => show(index + 1));


    /* klik area gelap (di luar foto) = tutup */
    root.addEventListener("click", (event) => {

        if (event.target === root || event.target === stage) close();

    });


    /* ---------- geser jari ---------- */

    let startX = 0;

    root.addEventListener("touchstart", (event) => {

        startX = event.changedTouches[0].screenX;

    }, { passive: true });

    root.addEventListener("touchend", (event) => {

        const diff = startX - event.changedTouches[0].screenX;

        if (Math.abs(diff) > 50 && items.length > 1) {

            show(index + (diff > 0 ? 1 : -1));

        }

    }, { passive: true });

})();
