/* =========================================
   INSTANT MANIA — DATA
   Simpan sebagai: room/data.js

   Satu-satunya file yang perlu diedit untuk:
   - pemain aktif        (players)
   - ex-member           (legends)
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

        role: "KANG NGABISIN CP",

        position: "Ujung Kiri",

        speciality: "Ngedit / Makan / Tidur",

        joined: "2025",

        image: "assets/fitra.jpg",

        instagram: "fitraaadii"

    },


    alip: {

        number: "07",

        name: "ALIP",

        role: "KANG MOSING",

        position: "Di Tengah",

        speciality: "Mobil / Music / Ngedit",

        joined: "2022",

        image: "assets/alip.jpg",
       
        instagram: "n0tyoursavi0r"

    },


    naufal: {

        number: "09",

        name: "NAUFAL",

        role: "KANG NGEDIT",

        position: "Dimana Saja",

        speciality: "Production / Coordination / Printing",

        joined: "2024",

        image: "assets/naufal.jpg",
       
        instagram: "si_naupal"

    },


    nicho: {

        number: "33",

        name: "NICHO",

        role: "ORANG IT",

        position: "Di Kanan",

        speciality: "Mengelola hidup sehari-hari",

        joined: "2026",

        image: "assets/nicho.jpg",
       
        instagram: "npalapessy"

    },


    aang: {

        number: "17",

        name: "AANG",

        role: "NGEDIT APA SAJA",

        position: "Di Tempat Kosong",

        speciality: "Edit Cerita Hidup / Edit Jadwal Kerja",

        joined: "2022",

        image: "assets/aang.jpg",
       
        instagram: "seniman.gila"

    },


    bardan: {

        number: "10",

        name: "BARDAN",

        role: "THE PRESIDENT",

        position: "Di Belakang Layar",

        speciality: "Finance / Administration / Venue",

        joined: "2023",

        image: "assets/bardan.jpg",
       
        instagram: "brdnnugrh"

    }

};


/* =========================================
   LEGENDS (ex-member)
   Bentuk sama dengan `players`, ditambah:
   left    : tahun keluar ("2025", "September, 2026",
             atau "present" kalau masih ada)
   retired : true = badge RETIRED di kartu

   Kunci (nathan, benaya, ...) = id yang dipakai
   POTM dan link ?player=. Foto: assets/legends/<id>.jpg
========================================= */

const legends = {

    nathan: {

        number: "11",

        name: "NATHAN",

        role: "PROGRAMMER",

        position: "PULANG KE KAMPUNG HALAMAN",

        speciality: "Segala Bisa Sih",

        joined: "March, 2026",

        left: "September, 2026",

        retired: true,

        image: "assets/legends/nathan.jpg"

    },


    benaya: {

        number: "15",

        name: "BENAYA",

        role: "GRAPHIC DESIGNER",

        position: "Tidak Tergantikan",

        speciality: "Terlalu Spesial",

        joined: "2024",

        left: "2026",

        retired: true,

        image: "assets/legends/benaya.jpg"

    },


    sandi: {

        number: "12",

        name: "SANDI",

        role: "PRODUCTION ENGINEERING",

        position: "Naik Turun Tangga",

        speciality: "Teknisi Mesin / Software",

        joined: "2022",

        left: "present",

        retired: false,

        image: "assets/legends/sandi.jpg"

    },


    dini: {

        number: "22",

        name: "DINI",

        role: "MAKE UP ARTIST",

        position: "Biasanya di Kiri",

        speciality: "Kang Cerita",

        joined: "2025",

        left: "2025",

        retired: true,

        image: "assets/legends/dini.jpg"

    },


    adelle: {

        number: "18",

        name: "ADELLE",

        role: "TALENT ARTIST",

        position: "SOCIAL MEDIA",

        speciality: "Model / Talent",

        joined: "2024",

        left: "2024",

        retired: true,

        image: "assets/legends/adelle.jpg"

    },


    ihsan: {

        number: "08",

        name: "IHSAN",

        role: "WIBU",

        position: "Dulu di Kanan",

        speciality: "Anime / おたく",

        joined: "2024",

        left: "2025",

        retired: true,

        image: "assets/legends/ihsan.jpg"

    },


    tyas: {

        number: "03",

        name: "TYAS",

        role: "PENDAKI",

        position: "Puncak Gunung",

        speciality: "Mencintai Alam",

        joined: "2022",

        left: "2024",

        retired: true,

        image: "assets/legends/tyas.jpg"

    },
   
     ikbal: {

        number: "20",

        name: "IKBAL",

        role: "ENTREPRENEUR",

        position: "Creator",

        speciality: "creates / launches /  manages ",

        joined: "LOAN",

        left: "2023",

        retired: false,

        image: "assets/legends/ikbal.jpg"

    },
   
   
     tyara: {

        number: "04",

        name: "TYARA",

        role: "PHOTOGRAPHER",

        position: "Creator",

        speciality: "take a moment ",

        joined: "2023",

        left: "2024",

        retired: false,

        image: "assets/legends/tyara.jpg"

    },
   
   
     miptach: {

        number: "27",

        name: "MIPTACH",

        role: "PHOTOGRAPHER",

        position: "Back Office",

        speciality: "Drawing",

        joined: "LOAN",

        left: "2024",

        retired: false,

        image: "assets/legends/tyara.jpg"

     },

    salsa: {

        number: "06",

        name: "SALSA",

        role: "EDITING",

        position: "Ujung Kanan",

        speciality: "Ngedit / Ngedit / Ngedit",

        joined: "2022",

        left: "2025",

        retired: true,

        image: "assets/legends/salsa.jpg"

    }

};


/* gabungan: dipakai modal pemain dan halaman POTM */
const people = { ...players, ...legends };


/* =========================================
   PLAYER OF THE MONTH
   Satu baris per bulan.

   month  : "TAHUN-BULAN" → "2026-01" … "2026-12"
   player : id di `players` / `legends` di atas
            (mis. "fitra", "nathan"). Kosong ("") =
            bulan itu dilewati, tidak tampil.
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

    { month: "2026-01", player: "fitra", reason: "" },

    { month: "2026-02", player: "naufal", reason: "" },

    { month: "2026-03", player: "naufal", reason: "" },

    { month: "2026-04", player: "naufal", reason: "" },

    { month: "2026-05", player: "naufal", reason: "" },

    { month: "2026-06", player: "naufal", reason: "" },

    { month: "2026-07", player: "fitra", reason: "" },

    { month: "2026-08", player: "nathan", reason: "Banyak menggendong sendirian di bulan Agustus" },

    { month: "2026-09", player: "naufal", reason: "" }

];

/* =========================================================
   MATCHDAY — DATA (langkah 1)
   Tempel di PALING BAWAH room/data.js
   (setelah array `potm`).

   Satu baris per acara:
   date  : "TAHUN-BULAN-TANGGAL" → "2026-09-29"
   title : judul acara
   place : lokasi
   page  : file artikel, mis. "matchday/nathans-farewell.html".
           Kosong ("") = acara tampil tanpa link/panah.

   Urutan di sini bebas — popup mengurutkan sendiri
   dari yang paling baru dan mengelompokkan per tahun.
   Acara baru: tambah satu baris saja.
========================================================= */

const matchdays = [

  
        {
        date: "2026-10-01",
        title: "INSTANT MANIA x TEMAN TULI",
        place: "Bandung",
        page: "matchday/xtemantuli.html",
        cover: "assets/matchday/xtemantuli/xtemantulicover.jpg",
        summary: "Belajar, bertumbuh dan saling menguatkan."
    },

   {
        date: "2026-09-29",
        title: "NATHAN'S FAREWELL",
        place: "Submarine, Bandung",
        page: "matchday/nathans-farewell.html",
        cover: "assets/matchday/nathans-farewell/nathanfarewell.jpg",
        summary: "Pada Karawang, Nathan kembali pulang."
    },

    {
        date: "2026-09-07",
        title: "BENAYA REUNION",
        place: "Dikichi, Bandung",
        page: "matchday/benaya-reunion.html",
        cover: "assets/matchday/benaya-reunion/benaya-reunion.jpg",
        summary: "Pertemuan kecil, makna yang besar"
    },
   
   {
        date: "2026-08-17",
        title: "DIRGAHAYU RI-81 2026",
        place: "Banda, Bandung",
        page: "matchday/dirgahayu_2026.html",
        cover: "assets/matchday/dirgahayu_2026/dirgahayu_2026.jpg",
        summary: "Perayaan merdeka yang tidak sama"
    },
   
   
    {
        date: "2025-11-09",
        title: "“THE LAST DANCE” MAS BEN",
        place: "Bardan's Home, Bandung",
        page: "matchday/last_dance.html",
        cover: "assets/matchday/lastdancemasben/cover.jpg",
        summary: "Diabadikan waktu, dirindukan nanti"
    },

   {
        date: "2024-08-17",
        title: "DIRGAHAYU RI-79 2024",
        place: "Banda, Bandung",
        page: "matchday/dirgahayu_2024.html",
        cover: "assets/matchday/dirgahayu_2024/dirgahayu_2024.jpg",
        summary: "Perayaan kecil, Indonesia Merdeka"
    }
   

];
