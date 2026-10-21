#!/usr/bin/env python3
"""
Membuat halaman HTML Matchday dari artikel yang ditulis di panel admin (Decap CMS).

  content/matchday/<slug>.md   →   <site>/matchday/<slug>.html
  (semua artikel)              →   <site>/room/matchdays-auto.js   (daftar untuk beranda & popup)

Dijalankan oleh GitHub Actions saat deploy; bisa juga dijalankan lokal:
  python scripts/build_matchday.py --content content/matchday --site _site

Foto: yang tampil adalah isian "Foto cover" dan "Galeri foto" di panel. Kalau kosong, foto dibaca dari
folder assets/matchday/<photos_folder atau slug>/ (cover*.jpg = cover, sisanya galeri, urut alami).

Aturan keamanan:
- Halaman buatan tangan (tanpa tanda "generated-by") TIDAK pernah ditimpa.
- Entri yang rusak dilewati dengan peringatan; deploy tidak ikut gagal.
"""

import argparse
import datetime
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote, urlparse

import markdown
import yaml

MARKER = "<!-- generated-by: build_matchday.py — dibuat otomatis dari panel admin, jangan diedit manual -->"

MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July",
               "August", "September", "October", "November", "December"]
MONTHS_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
FRONTMATTER_RE = re.compile(r"\A---[ \t]*\r?\n(.*?)\r?\n---[ \t]*(?:\r?\n(.*))?\Z", re.DOTALL)
EXTERNAL_RE = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//)", re.IGNORECASE)


def warn(message):
    # format anotasi GitHub Actions (satu baris); tetap terbaca biasa di terminal
    print("::warning::" + " ".join(str(message).split()))


def esc(value):
    return html.escape(str(value if value is not None else ""), quote=True)


# ---------------------------------------------------------------- path gambar

def make_paths(site_url):
    """Kembalikan fungsi pengubah path untuk situs di bawah subfolder (mis. /squad)."""
    base = site_url.rstrip("/")
    prefix = urlparse(base).path.rstrip("/") + "/"          # "/squad/"

    def site_path(p):
        """'/squad/assets/x.jpg' atau 'assets/x.jpg' → 'assets/x.jpg'"""
        p = str(p or "").strip()
        if not p or EXTERNAL_RE.match(p):
            return p
        if prefix != "/" and p.startswith(prefix):
            p = p[len(prefix):]
        return p.lstrip("/")

    def rel(p):
        """Path untuk halaman di matchday/: 'assets/x.jpg' → '../assets/x.jpg'"""
        s = site_path(p)
        return s if (not s or EXTERNAL_RE.match(s)) else "../" + s

    def absolute(p):
        s = site_path(p)
        return s if (not s or EXTERNAL_RE.match(s)) else base + "/" + s

    return site_path, rel, absolute


# ---------------------------------------------------------------- membaca artikel

def parse_date(value):
    if isinstance(value, datetime.datetime):
        return value.date()
    if isinstance(value, datetime.date):
        return value
    m = re.match(r"\s*(\d{4})-(\d{2})-(\d{2})", str(value or ""))
    if not m:
        raise ValueError(f"tanggal tidak dikenali: {value!r}")
    return datetime.date(int(m[1]), int(m[2]), int(m[3]))


def load_entry(path):
    raw = path.read_text(encoding="utf-8-sig")
    m = FRONTMATTER_RE.match(raw)
    if not m:
        raise ValueError("tidak ada frontmatter (blok --- di bagian atas file)")
    data = yaml.safe_load(m.group(1)) or {}
    if not isinstance(data, dict):
        raise ValueError("frontmatter bukan pasangan kunci: nilai")
    return data, (m.group(2) or "").strip()


def as_list(value):
    if value is None or value == "":
        return []
    if isinstance(value, (list, tuple)):
        return [str(v).strip() for v in value if str(v).strip()]
    return [str(value).strip()]


# ---------------------------------------------------------------- foto dari folder

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
FOLDER_RE = re.compile(r"^[A-Za-z0-9._-]+$")


def natural_key(name):
    """Urutan alami: 2.jpg sebelum 10.jpg."""
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", name.lower())]


def discover_photos(site, folder):
    """
    Cari foto di <site>/assets/matchday/<folder>/ (kebiasaan lama: 01.jpg, 02.jpg, ...).
    File yang namanya diawali "cover" dijadikan foto cover; sisanya galeri (urutan alami).
    Nama file dibaca langsung dari folder, jadi huruf besar/kecil selalu cocok.
    """
    if not folder or not FOLDER_RE.match(folder) or folder in (".", ".."):
        if folder:
            warn(f"photos_folder '{folder}' tidak valid (hanya huruf, angka, titik, - dan _)")
        return "", []
    directory = site / "assets" / "matchday" / folder
    if not directory.is_dir():
        return "", []

    files = sorted(
        (f for f in directory.iterdir() if f.is_file() and f.suffix.lower() in IMAGE_EXT),
        key=lambda f: natural_key(f.name),
    )
    cover = next((f for f in files if f.stem.lower().startswith("cover")), None)

    def to_path(f):
        return f"assets/matchday/{quote(folder)}/{quote(f.name)}"

    return (to_path(cover) if cover else ""), [to_path(f) for f in files if f is not cover]


# ---------------------------------------------------------------- membangun HTML

def convert_body(body, rel):
    md = markdown.Markdown(extensions=["extra", "sane_lists", "nl2br"], output_format="html")
    out = md.convert(body)

    # kutipan memakai gaya .article-quote
    out = out.replace("<blockquote>", '<blockquote class="article-quote">')

    # gambar/tautan internal dari panel ("/squad/assets/..") → relatif terhadap matchday/
    def fix(match):
        attr, url = match.group(1), match.group(2)
        return f'{attr}="{rel(url)}"' if not EXTERNAL_RE.match(url) else match.group(0)

    out = re.sub(r'\b(src|href)="(/[^"]*)"', fix, out)

    # gambar di isi artikel: lazy load
    out = out.replace("<img ", '<img loading="lazy" ')
    return out


def build_page(template, entry, body, rel, absolute, site_url, slug, site):
    title = str(entry.get("title") or slug).strip()
    parts = [p.strip() for p in title.split("|") if p.strip()]
    title_plain = " ".join(parts) or slug
    title_html = "<br>\n".join(esc(p) for p in parts) or esc(slug)

    day = parse_date(entry.get("date"))
    date_short = f"{day.day:02d} {MONTHS_SHORT[day.month - 1]} {day.year}"
    date_long = f"{day.day:02d} {MONTHS_LONG[day.month - 1]} {day.year}"

    description = str(entry.get("description") or "").strip()
    meta_desc = description or f"Matchday: {title_plain}. Instant Mania."

    status = str(entry.get("status") or "").strip()
    status_badge = f'<span class="article-status">{esc(status)}</span>' if status else ""

    tagline = f'<p class="article-tagline">\n{esc(description)}\n</p>' if description else ""

    # foto: isian panel lebih diutamakan; kalau kosong, pakai foto dari folder assets/matchday/<folder>/
    folder = str(entry.get("photos_folder") or slug).strip()
    folder_cover, folder_gallery = discover_photos(site, folder)

    cover = str(entry.get("cover") or "").strip() or folder_cover
    cover_block = ""
    if cover:
        cover_block = (
            '<figure class="article-cover">\n'
            f'<img src="{esc(rel(cover))}" alt="{esc(title_plain)}">\n'
            "</figure>\n"
        )
    og_image = absolute(cover) if cover else site_url.rstrip("/") + "/assets/team.jpg"

    facts = [("DATE", date_long)]
    if str(entry.get("venue") or "").strip():
        facts.append(("VENUE", str(entry["venue"]).strip()))
    if str(entry.get("type") or "").strip():
        facts.append(("TYPE", str(entry["type"]).strip()))
    lineup = as_list(entry.get("lineup"))
    if lineup:
        facts.append(("LINE-UP", " / ".join(lineup)))
    facts_html = "\n".join(f"<div>\n<dt>{esc(k)}</dt>\n<dd>{esc(v)}</dd>\n</div>\n" for k, v in facts)

    photos = as_list(entry.get("gallery")) or folder_gallery
    gallery_block = ""
    if photos:
        figures = []
        for i, photo in enumerate(photos, 1):
            figures.append(
                "<figure>\n"
                f'<img src="{esc(rel(photo))}" alt="{esc(title_plain)} — foto {i}" loading="lazy" '
                "onerror=\"this.closest('figure').remove()\">\n"
                "</figure>\n"
            )
        gallery_block = '<div class="article-gallery">\n\n' + "\n".join(figures) + "\n</div>\n"

    values = {
        "MARKER": MARKER,
        "TITLE_PLAIN": esc(title_plain),
        "TITLE_HTML": title_html,
        "DESCRIPTION": esc(meta_desc),
        "URL": esc(f"{site_url.rstrip('/')}/matchday/{slug}.html"),
        "OG_IMAGE": esc(og_image),
        "DATE_SHORT": esc(date_short),
        "STATUS_BADGE": status_badge,
        "TAGLINE_BLOCK": tagline,
        "COVER_BLOCK": cover_block,
        "FACTS": facts_html,
        "BODY": convert_body(body, rel),
        "GALLERY_BLOCK": gallery_block,
    }

    page = template
    for key, val in values.items():
        page = page.replace("{{" + key + "}}", val)

    leftover = re.findall(r"\{\{[A-Z_]+\}\}", page)
    if leftover:
        raise ValueError(f"placeholder di template tidak terisi: {sorted(set(leftover))}")

    summary = {
        "date": day.isoformat(),
        "title": title_plain,
        "place": str(entry.get("venue") or "").strip(),
        "page": f"matchday/{slug}.html",
        "cover": site_path_for_data(cover, rel),
        "summary": description,
    }
    return page, summary


def site_path_for_data(cover, rel):
    """Path cover untuk data beranda (relatif terhadap root situs: 'assets/...')."""
    if not cover:
        return ""
    p = rel(cover)                       # '../assets/x.jpg'
    return p[3:] if p.startswith("../") else p


# ---------------------------------------------------------------- utama

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--content", default="content/matchday", help="folder artikel (.md)")
    ap.add_argument("--site", default="_site", help="folder situs hasil salinan (tempat HTML dibuat)")
    ap.add_argument("--template", default=str(Path(__file__).with_name("matchday_template.html")))
    ap.add_argument("--site-url", default="https://instantmania.github.io/squad")
    args = ap.parse_args()

    content = Path(args.content)
    site = Path(args.site)
    out_dir = site / "matchday"
    out_dir.mkdir(parents=True, exist_ok=True)
    (site / "room").mkdir(parents=True, exist_ok=True)

    template = Path(args.template).read_text(encoding="utf-8")
    _, rel, absolute = make_paths(args.site_url)

    made, skipped, summaries, seen = [], [], [], {}
    files = sorted(content.glob("*.md")) if content.is_dir() else []

    for path in files:
        try:
            entry, body = load_entry(path)

            if entry.get("published") is False:
                skipped.append((path.name, "published: false"))
                continue

            slug = str(entry.get("slug") or path.stem).strip()
            if not SLUG_RE.match(slug):
                raise ValueError(f"slug '{slug}' tidak valid (hanya huruf kecil, angka, dan tanda -)")
            if slug in seen:
                warn(f"{path.name}: slug '{slug}' sama dengan {seen[slug]} — yang ini dilewati")
                skipped.append((path.name, "slug ganda"))
                continue

            target = out_dir / f"{slug}.html"
            if target.exists() and MARKER not in target.read_text(encoding="utf-8", errors="ignore"):
                warn(f"{path.name}: matchday/{slug}.html sudah ada sebagai halaman buatan tangan — tidak ditimpa")
                skipped.append((path.name, "bentrok dengan halaman manual"))
                continue

            page, summary = build_page(template, entry, body, rel, absolute, args.site_url, slug, site)
            target.write_text(page, encoding="utf-8")
            seen[slug] = path.name
            summaries.append(summary)
            made.append(slug)

        except Exception as error:  # satu artikel rusak tidak boleh menggagalkan seluruh deploy
            warn(f"{path.name}: dilewati — {error}")
            skipped.append((path.name, str(error)))

    # daftar untuk beranda & popup VIEW ALL (dimuat setelah data.js; duplikat berdasarkan `page` diabaikan)
    summaries.sort(key=lambda s: s["date"], reverse=True)
    js = (
        "/* DIBUAT OTOMATIS oleh scripts/build_matchday.py dari artikel panel admin — jangan diedit. */\n"
        "(function () {\n"
        '    if (typeof matchdays === "undefined") return;\n'
        f"    var auto = {json.dumps(summaries, ensure_ascii=False, indent=4)};\n"
        "    auto.forEach(function (entry) {\n"
        "        if (!matchdays.some(function (m) { return m.page === entry.page; })) matchdays.push(entry);\n"
        "    });\n"
        "})();\n"
    )
    (site / "room" / "matchdays-auto.js").write_text(js, encoding="utf-8")

    print(f"Matchday: {len(made)} halaman dibuat, {len(skipped)} dilewati.")
    for slug in made:
        print(f"  + matchday/{slug}.html")
    for name, why in skipped:
        print(f"  - {name}: {' '.join(str(why).split())}")


if __name__ == "__main__":
    sys.exit(main())
