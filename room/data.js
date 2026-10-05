/* =========================================
   INSTANT MANIA — DATA
   Simpan sebagai: room/data.js

   Satu-satunya file yang perlu diedit untuk:
   - pemain aktif      (players)
   - ex-member         (legends)
   - Player of the Month (potm)

   Dimuat oleh index.html DAN potm.html,
   sebelum script lainnya.
========================================= */


/* =========================================
   PLAYERS (squad aktif)
========================================= */

const players = {

    fitra: {

        number: "69",

        name: "FITRA",

        role: "TUKANG NGABISIN CP",

        position: "Ujung Kiri",

        speciality: "Ngedit / Makan / Tidur",

        joined: "2025",

        image: "assets/fitra.jpg"

    },


    alip: {

        number: "07",

        name: "ALIP",

        role: "KANG MOSING",

        position: "Di Tengah",

        speciality: "Photography / Music / Ngedit",

        joined: "2022",

        image: "assets/alip.jpg"

    },


    naufal: {

        number: "09",

        name: "NAUFAL",

        role: "PRODUCTION",

        position: "Production",

        speciality: "Production / Coordination / Creative",

        joined: "2024",

        image: "assets/naufal.jpg"

    },


    nicho: {

        number: "08",

        name: "NICHO",

        role: "MARKETING",

        position: "Marketing",

        speciality: "Marketing / Communication / Strategy",

        joined: "2026",

        image: "assets/nicho.jpg"

    },


    aang: {

        number: "17",

        name: "AANG",

        role: "EDITOR",

        position: "Photo & Video Editor",

        speciality: "Editing / Color / Retouch",

        joined: "2021",

        image: "assets/aang.jpg"

    },


    bardan: {

        number: "10",

        name: "BARDAN",

        role: "THE PRESIDENT",

        position: "Finance & Support",

        speciality: "Finance / Administration / Venue",

        joined: "2023",

        image: "assets/bardan.jpg"

    }

};


/* =========================================
   LEGENDS (ex-member)
   Bentuk sama dengan `players`, ditambah:
   left    : tahun keluar
   retired : true = badge RETIRED di kartu

   !! Dua entri di bawah hanya CONTOH.
   !! Ganti dengan data asli, atau kosongkan
   !! jadi `const legends = {};` agar section
   !! Legends tersembunyi.
   Foto: assets/legends/<id>.jpg
========================================= */

const legends = {

    contoh1: {

        number: "11",

        name: "NAMA EX-MEMBER 1",

        role: "PHOTOGRAPHER",

        position: "Ganti posisi",

        speciality: "Ganti skill / kontribusi",

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

        speciality: "Ganti skill / kontribusi",

        joined: "2023",

        left: "2025",

        retired: false,

        image: "assets/legends/contoh2.jpg"

    }

};


/* gabungan: dipakai modal pemain dan halaman POTM */
const people = { ...players, ...legends };


/* =========================================
   PLAYER OF THE MONTH
   Satu baris per bulan.

   month  : "TAHUN-BULAN" → "2026-01" … "2026-12"
   player : id di `players` / `legends` di atas
            (mis. "fitra"). Kosong ("") = bulan itu
            dilewati, tidak tampil di halaman.
   reason : (opsional) satu-dua kalimat alasan terpilih
   stats  : (opsional) hanya dipakai untuk pemenang
            terbaru: { projects, goals, assists }

   Pemenang TERBARU (bulan paling akhir yang
   sudah terisi) tampil besar di atas; sisanya
   masuk arsip. Tiap bulan baru: tambah satu baris.

   Contoh baris yang sudah diisi:
   { month: "2026-09", player: "fitra",
     reason: "Alasan singkat...",
     stats: { projects: 6, goals: 18, assists: 7 } },
========================================= */

const potm = [

    { month: "2026-01", player: "", reason: "" },

    { month: "2026-02", player: "", reason: "" },

    { month: "2026-03", player: "", reason: "" },

    { month: "2026-04", player: "", reason: "" },

    { month: "2026-05", player: "", reason: "" },

    { month: "2026-06", player: "", reason: "" },

    { month: "2026-07", player: "", reason: "" },

    { month: "2026-08", player: "", reason: "" },

    { month: "2026-09", player: "", reason: "" }

];
