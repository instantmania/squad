/* =========================================
   THE PROJECT — daftar project di index.html
   Simpan sebagai: room/projects.js
   Tidak bergantung pada data.js / script.js,
   jadi aman dimuat di mana saja.
========================================= */

/* ==========================================================
   DAFTAR PROJECT — EDIT DI SINI

   Setiap project baru = tambah satu blok { ... } di bawah.
   Yang paling atas tampil paling depan.

     title : nama project
     sub   : tulisan kecil di bawah nama (kategori / tahun)
     page  : file HTML project-nya (relatif dari index.html)
             kosongkan "" kalau halamannya belum jadi
     cover : gambar preview. Kalau file belum ada, tampil
             kotak hitam bertuliskan lokasi file yang harus diisi
========================================================== */
const projects = [

    {
        title: "History Family's Book",
        sub:   "FAMILY ARCHIVE · 2026",
        page:  "project/history-book.html",
        cover: "assets/project/book/page-01.jpg"
    }

    /* contoh project berikutnya (hapus tanda komentar & koma di atas):
    ,{
        title: "Nama Project Baru",
        sub:   "KATEGORI · 2026",
        page:  "nama-project.html",
        cover: "assets/projects/nama-project.jpg"
    }
    */

];
/* ========================================================== */


(function () {

    const list = document.getElementById("projectList");

    if (!list) return;


    const esc = (value) =>
        String(value).replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char]));


    if (!projects.length) {

        list.outerHTML = '<p class="pj-empty">Belum ada project.</p>';

        return;

    }


    list.innerHTML = projects.map((p) => {

        const tag = p.page ? "a" : "div";

        const href = p.page ? ` href="${esc(p.page)}"` : "";

        const soon = p.page ? "" : " soon";

        const label = esc(p.title || "");


        return `

            <${tag} class="pj-card${soon}"${href}>

                <div class="pj-thumb">

                    <div class="pj-fallback">
                        PREVIEW
                        <small>isi: ${esc(p.cover || "")}</small>
                    </div>

                    ${p.cover
                        ? `<img src="${esc(p.cover)}" alt="${label}" loading="lazy" onerror="this.remove()">`
                        : ""}

                </div>

                <div class="pj-info">

                    <div>
                        <h3>${label}</h3>
                        <span>${esc(p.sub || "")}</span>
                    </div>

                    <span class="pj-arrow">${p.page ? "↗" : ""}</span>

                </div>

            </${tag}>

        `;

    }).join("");

})();
