/* =========================================
   BOOK — History Family's Book
   Dimuat SETELAH data.js dan script.js
========================================= */

/* ==========================================================
   ISI BUKU — EDIT DI SINI
   Setiap halaman punya:
     title : judul halaman
     text  : teks cerita
     img   : lokasi file foto (relatif terhadap halaman HTML,
             jadi: squad/assets/book/page-01.jpg dst.)
     full  : true = foto memenuhi satu halaman penuh
             (teks jadi caption di bawah foto)
   Selama file foto belum ada, tampil kotak placeholder
   yang menunjukkan nama file yang harus diisi.
========================================================== */
const BOOK_COVER = {
  title: "Family<br>History<br>Book",
  sub: "Zhafira Zahra"
};

const BOOK_PAGES = [
  { title:"Prolog",               text:"Setiap keluarga memiliki cerita, dan inilah kisah yang kami sebut rumah.",                                         img:"../assets/project/book/page-01.jpg" },
  { title:"Teman Hidup",            text:"Rumah bukan sekadar tempat tinggal, melainkan tempat hati selalu ingin pulang.",                                  img:"../assets/project/book/page-02.jpg", full:true },
  { title:"Tumbuh Bersama",        text:"Kami tumbuh dengan cara berbeda, tetapi tetap berakar pada cinta yang sama.",                                    img:"../assets/project/book/page-03.jpg" },
  { title:"Ujian dan Kekuatan",            text:"Tidak semua hari mudah, tetapi kami belajar bahwa beban terasa ringan saat dipikul bersama.",            img:"../assets/project/book/page-04.jpg" },
  { title:"Syukur — Yang Kami Miliki",            text:"Kami mungkin belum memiliki segalanya, tetapi kami memiliki alasan untuk terus bersyukur.",                              img:"../assets/project/book/page-05.jpg", full:true },
  { title:"Mimpi — Masa Depan Kami",           text:"Kami menyimpan mimpi yang lebih besar daripada hari ini, dan keberanian untuk mewujudkannya.",           img:"../assets/project/book/page-06.jpg" },
  { title:"Kenangan Kecil",       text:"Hal-hal sederhana yang dahulu biasa, kini menjadi kenangan paling berharga.",                                        img:"../assets/project/book/page-07.jpg" },
  { title:"Keberanian untuk tetap melangkah",              text:"Dunia mengenalnya lewat senyuman, sementara dirinya perlahan belajar bahwa tumbuh dewasa juga berarti berani tersesat sebelum menemukan arah.",        img:"../assets/project/book/page-08.jpg", full:true },
  { title:"Si Sulung",    text:"keteguhan, tanggung jawab, dan kasih sayang yang tak selalu diucapkan.",                                                      img:"../assets/project/book/page-09.jpg" },
  { title:"Rumah Terindah", text:"Tertawa bersama, mencintai tanpa batas waktu.",                                                                           img:"../assets/project/book/page-10.jpg" }
];

const BOOK_END_TEXT = "TEMPAT CINTA TUMBUH, BAHAGIA MENETAP SELAMANYA";
/* ========================================================== */

(function(){
  const book = document.getElementById('book');
  if(!book) return;

  const N = 6;        // jumlah lembar: cover + 4 lembar tengah + lembar penutup
  let state = 0;      // jumlah lembar yang sudah dibalik (0 = tertutup)
  const leaves = [];

  function pageHTML(i){
    const d = BOOK_PAGES[i-1];
    const n = String(i).padStart(2,'0');
    const slot = `<div class="bk-slot" data-src="${d.img}"><b>FOTO ${n}</b><small>isi: ${d.img}</small></div>`;
    if(d.full){
      return `${slot}<div class="bk-cap"><h3>${d.title}</h3><p>${d.text}</p></div><span class="bk-num">${n}</span>`;
    }
    return `${slot}<div class="bk-eyebrow">" "${n}</div><h3>${d.title}</h3><p>${d.text}</p><span class="bk-num">${n}</span>`;
  }

  function face(cls, html){
    const f = document.createElement('div');
    f.className = 'bk-face ' + cls;
    f.innerHTML = html;
    return f;
  }

  function pageFace(i, side){
    return face('bk-' + side + (BOOK_PAGES[i-1].full ? ' bk-full' : ''), pageHTML(i));
  }

  // lembar 0      : cover | halaman 1
  // lembar 1..4   : halaman 2k | halaman 2k+1
  // lembar 5      : halaman 10 | penutup
  for(let k=0;k<N;k++){
    const leaf = document.createElement('div');
    leaf.className = 'bk-leaf';
    let fr, bk;

    if(k===0){
      fr = face('bk-front bk-cover', `<div class="bk-mark">IM</div><h2>${BOOK_COVER.title}</h2><small>${BOOK_COVER.sub}</small><span class="bk-hint">KLIK UNTUK MEMBUKA</span>`);
      bk = pageFace(1,'back');
    } else if(k===N-1){
      fr = pageFace(10,'front');
      bk = face('bk-back bk-end', `<div class="bk-mark">IM</div><h3>${BOOK_END_TEXT}</h3><p>Rumah Kita</p>`);
    } else {
      fr = pageFace(2*k,'front');
      bk = pageFace(2*k+1,'back');
    }

    leaf.append(fr,bk);
    book.appendChild(leaf);
    leaves.push(leaf);
  }

  // foto: pakai gambar bila file ada, kalau tidak tetap placeholder
  book.querySelectorAll('.bk-slot').forEach(s=>{
    const im = new Image();
    im.onload = ()=>{ s.classList.add('has-img'); s.innerHTML=''; s.appendChild(im); };
    im.src = s.dataset.src;
  });

  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');

  function render(delay){
    leaves.forEach((l,i)=>{
      l.classList.toggle('flipped', i<state);
      const z = i<state ? i : N-i;
      if(delay) setTimeout(()=>{ l.style.zIndex = z; }, 450);
      else l.style.zIndex = z;
    });
    book.classList.toggle('s-open', state>0 && state<N);
    book.classList.toggle('s-end', state===N);
    prev.disabled = state===0;
    next.disabled = state===N;
    if(state===0) counter.textContent = 'COVER';
    else if(state===N) counter.textContent = 'THE END';
    else counter.textContent = 'HAL. ' + (2*state-1) + ' — ' + (2*state);
  }

  function go(d){
    const n = state + d;
    if(n<0 || n>N) return;
    state = n;
    render(true);
  }

  render(false);

  next.addEventListener('click',()=>go(1));
  prev.addEventListener('click',()=>go(-1));
  leaves.forEach((l,i)=> l.addEventListener('click',()=> go(i<state ? -1 : 1)));

  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight') go(1);
    if(e.key==='ArrowLeft')  go(-1);
  });

  // geser di layar sentuh
  let x0 = null;
  const stage = document.getElementById('stage');
  stage.addEventListener('touchstart',e=>{ x0 = e.touches[0].clientX; },{passive:true});
  stage.addEventListener('touchend',e=>{
    if(x0===null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if(Math.abs(dx)>40) go(dx<0 ? 1 : -1);
    x0 = null;
  });
})();
