import os
import re
import sys
import json
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlparse, parse_qs, urlencode


ROOT = Path('.')
FONTS_DIR = ROOT / 'assets' / 'fonts'
CSS_DIR = ROOT / 'assets' / 'css'
LOCAL_FONTS_CSS = CSS_DIR / 'fonts.css'

UA = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'Chrome/124.0.0.0 Safari/537.36'
)


GOOGLE_CSS_RE = re.compile(r"https://fonts\.googleapis\.com/css2[^\"'<> ]+", re.IGNORECASE)
PRECONNECT_GOOGLEAPIS_RE = re.compile(r"<link[^>]+rel=[\"']preconnect[\"'][^>]+href=[\"']https://fonts\.googleapis\.com[\"'][^>]*>", re.IGNORECASE)
PRECONNECT_GSTATIC_RE = re.compile(r"<link[^>]+rel=[\"']preconnect[\"'][^>]+href=[\"']https://fonts\.gstatic\.com[\"'][^>]*>", re.IGNORECASE)
LINK_STYLESHEET_RE = re.compile(r"<link[^>]+href=[\"'](https://fonts\.googleapis\.com/css2[^\"']+)[\"'][^>]*rel=[\"']stylesheet[\"'][^>]*>", re.IGNORECASE)
LINK_PRELOAD_AS_STYLE_RE = re.compile(r"<link[^>]+rel=[\"']preload[\"'][^>]+as=[\"']style[\"'][^>]+href=[\"'](https://fonts\.googleapis\.com/css2[^\"']+)[\"'][^>]*onload=[^>]*>", re.IGNORECASE)
NOSCRIPT_STYLESHEET_RE = re.compile(
    r"<noscript>\s*<link(?=[^>]*rel=[\"']stylesheet[\"'])(?=[^>]*href=[\"']https://fonts\\.googleapis\\.com/css2[^\"']+[\"'])[^>]*>\s*</noscript>",
    re.IGNORECASE,
)

AT_FONT_FACE_BLOCK_RE = re.compile(r"@font-face\s*\{[^}]+\}", re.IGNORECASE | re.DOTALL)
FONT_FAMILY_RE = re.compile(r"font-family:\s*(?:'([^']+)'|\"([^\"]+)\")\s*;", re.IGNORECASE)
FONT_STYLE_RE = re.compile(r"font-style:\s*([^;]+);", re.IGNORECASE)
FONT_WEIGHT_RE = re.compile(r"font-weight:\s*([^;]+);", re.IGNORECASE)
SRC_WOFF2_RE = re.compile(r"src:[^;]*url\(([^)]+\.woff2)\)[^;]*;", re.IGNORECASE)
UNICODE_RANGE_RE = re.compile(r"unicode-range:\s*([^;]+);", re.IGNORECASE)


def fetch(url: str) -> str:
    req = Request(url, headers={'User-Agent': UA, 'Accept': 'text/css,*/*;q=0.1'})
    with urlopen(req) as resp:
        return resp.read().decode('utf-8')


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = Request(url, headers={'User-Agent': UA})
    with urlopen(req) as resp, open(dest, 'wb') as f:
        f.write(resp.read())


def canonicalize_css_url(u: str) -> str:
    # Ensure display=swap
    parsed = urlparse(u)
    qs = parse_qs(parsed.query)
    if 'display' not in qs:
        qs.setdefault('display', []).append('swap')
    # Keep all repeated params (e.g., multiple family= entries)
    query = urlencode(qs, doseq=True)
    return f"{parsed.scheme}://{parsed.netloc}{parsed.path}?{query}"


def collect_google_css_urls(html_text: str) -> list[str]:
    urls = set()
    for m in GOOGLE_CSS_RE.finditer(html_text):
        urls.add(canonicalize_css_url(m.group(0)))
    return sorted(urls)


def parse_css_blocks(css_text: str):
    blocks = []
    for m in AT_FONT_FACE_BLOCK_RE.finditer(css_text):
        block = m.group(0)
        fam_m = FONT_FAMILY_RE.search(block)
        style_m = FONT_STYLE_RE.search(block)
        weight_m = FONT_WEIGHT_RE.search(block)
        src_m = SRC_WOFF2_RE.search(block)
        ur_m = UNICODE_RANGE_RE.search(block)
        if not (fam_m and style_m and weight_m and src_m):
            continue
        family = fam_m.group(1) or fam_m.group(2)
        style = style_m.group(1).strip()
        weight = weight_m.group(1).strip()
        url = src_m.group(1).strip().strip('"\'')
        unicode_range = ur_m.group(1).strip() if ur_m else None
        blocks.append({
            'family': family,
            'style': style,
            'weight': weight,
            'url': url,
            'unicode_range': unicode_range,
            'raw': block,
        })
    return blocks


def safe_filename(s: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]", "-", s)


def build_local_css_and_download(blocks: list[dict]) -> tuple[str, list[dict]]:
    css_out = []
    files = []
    for i, b in enumerate(blocks):
        parsed = urlparse(b['url'])
        fname = Path(parsed.path).name
        # Make the filename more explicit to avoid collisions across families
        prefix = f"{b['family'].replace(' ', '-')}-{b['style']}-{b['weight']}"
        fname = safe_filename(prefix + '-' + fname)
        local_path = FONTS_DIR / fname
        if not local_path.exists():
            try:
                download(b['url'], local_path)
            except Exception as e:
                print(f"Failed to download {b['url']}: {e}")
                continue
        # Rebuild @font-face block to point to local file and include font-display
        css_block = ["@font-face {"]
        css_block.append(f"  font-family: '{b['family']}';")
        css_block.append(f"  font-style: {b['style']};")
        css_block.append(f"  font-weight: {b['weight']};")
        css_block.append("  font-display: swap;")
        css_block.append(f"  src: url('/assets/fonts/{fname}') format('woff2');")
        if b.get('unicode_range'):
            css_block.append(f"  unicode-range: {b['unicode_range']};")
        css_block.append("}")
        css_out.append("\n".join(css_block))
        files.append({'file': fname, 'unicode_range': b.get('unicode_range')})
    return "\n\n".join(css_out) + "\n", files


def remove_google_font_links(html: str) -> tuple[str, list[str]]:
    urls = []
    # Collect before removing
    urls += collect_google_css_urls(html)
    # Remove preload-as-style Google Fonts links
    html = LINK_PRELOAD_AS_STYLE_RE.sub('', html)
    # Remove noscript fallback links (robust)
    html = NOSCRIPT_STYLESHEET_RE.sub('', html)
    html = re.sub(r"<noscript>.*?https://fonts\\.googleapis\\.com/css2.*?</noscript>", '', html, flags=re.IGNORECASE | re.DOTALL)
    # Extra robust removal loop for any residual noscript blocks containing Google Fonts
    lower = html.lower()
    changed = True
    while changed:
        changed = False
        i = lower.find('<noscript>')
        while i != -1:
            j = lower.find('</noscript>', i)
            if j == -1:
                break
            block = html[i:j+11]
            if 'fonts.googleapis.com' in block:
                html = html[:i] + html[j+11:]
                lower = html.lower()
                changed = True
                break
            i = lower.find('<noscript>', j + 11)
    # Remove regular stylesheet links
    html = LINK_STYLESHEET_RE.sub('', html)
    # Remove preconnects
    html = PRECONNECT_GOOGLEAPIS_RE.sub('', html)
    html = PRECONNECT_GSTATIC_RE.sub('', html)
    return html, urls


LOCAL_FONT_PRELOAD_RE = re.compile(r"<link[^>]+rel=\"preload\"[^>]+as=\"font\"[^>]+href=\"/assets/fonts/[^\"]+\"[^>]*>", re.IGNORECASE)


def insert_fonts_css_and_preloads(html: str, preload_files: list[dict]) -> str:
    # Insert fonts.css non-blocking load and preloads for font files
    head_match = re.search(r"<head[^>]*>", html, flags=re.IGNORECASE)
    if not head_match:
        return html
    insert_pos = head_match.end()
    preload_tags = []
    # Only preload Basic Latin subset to avoid over-preloading
    for entry in preload_files:
        fname = entry['file'] if isinstance(entry, dict) else str(entry)
        ur = entry.get('unicode_range') if isinstance(entry, dict) else None
        if ur and 'U+0000-00FF' not in ur:
            continue
        preload_tags.append(
            f"\n    <link rel=\"preload\" as=\"font\" type=\"font/woff2\" href=\"/assets/fonts/{fname}\" crossorigin>"
        )
    fonts_css = (
        "\n    <link rel=\"preload\" as=\"style\" href=\"/assets/css/fonts.css\" onload=\"this.onload=null;this.rel='stylesheet'\">"
        "\n    <noscript><link rel=\"stylesheet\" href=\"/assets/css/fonts.css\"></noscript>"
    )
    injection = ("".join(preload_tags)) + fonts_css + "\n"
    # Remove any previous local font preloads before inserting fresh ones
    html = LOCAL_FONT_PRELOAD_RE.sub('', html)
    html = LOCAL_FONTS_CSS_LINK_RE.sub('', html)
    html = LOCAL_FONTS_CSS_NOSCRIPT_RE.sub('', html)
    return html[:insert_pos] + injection + html[insert_pos:]


def update_csp_meta(html: str) -> str:
    # Remove external Google Fonts from CSP since we self-host now
    def _repl(m: re.Match) -> str:
        content = m.group(1)
        content = content.replace(" https://fonts.googleapis.com", "")
        content = content.replace(" https://fonts.gstatic.com", "")
        return f"<meta http-equiv=\"Content-Security-Policy\" content=\"{content}\">"

    # Match both > and /> and tolerate whitespace/newlines
    return re.sub(
        r"<meta\s+http-equiv=\"Content-Security-Policy\"\s+content=\"([^\"]*)\"\s*/?>",
        _repl,
        html,
        flags=re.IGNORECASE,
    )


def main():
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    CSS_DIR.mkdir(parents=True, exist_ok=True)

    html_files = [p for p in ROOT.rglob('*.html') if not any(part in {'.venv', 'node_modules', 'backups'} for part in p.parts)]

    # Collect all Google CSS URLs from all files
    all_urls = set()
    file_to_urls = {}
    texts = {}
    for f in html_files:
        text = f.read_text(encoding='utf-8', errors='ignore')
        texts[f] = text
        urls = collect_google_css_urls(text)
        if urls:
            file_to_urls[f] = urls
            all_urls.update(urls)

    if not all_urls:
        print('No Google Fonts URLs found. Nothing to do.')
        return

    # Fetch and parse CSS for each URL, download fonts, and build local CSS
    combined_blocks = []
    url_to_files = {}
    for url in sorted(all_urls):
        try:
            css = fetch(url)
        except Exception as e:
            print(f"Failed to fetch CSS {url}: {e}")
            continue
        blocks = parse_css_blocks(css)
        local_css, files = build_local_css_and_download(blocks)
        combined_blocks.append(local_css)
        url_to_files[url] = files

    # Write combined fonts.css
    LOCAL_FONTS_CSS.write_text("\n".join(combined_blocks), encoding='utf-8')
    print(f"Wrote {LOCAL_FONTS_CSS}")

    # Update HTML files to self-host
    for f, text in texts.items():
        new_text, urls = remove_google_font_links(text)
        if urls:
            preload_files = []
            for u in urls:
                preload_files.extend(url_to_files.get(u, []))
            # de-duplicate while preserving order
            seen = set()
            def key(entry):
                return entry['file'] if isinstance(entry, dict) else str(entry)
            filtered = []
            for e in preload_files:
                k = key(e)
                if k not in seen:
                    seen.add(k)
                    filtered.append(e)
            preload_files = filtered
            new_text = insert_fonts_css_and_preloads(new_text, preload_files)
            new_text = update_csp_meta(new_text)
            # Final cleanups: remove any residual Google Fonts noscripts and empty noscripts
            # (Run remove_google_font_links again for robustness)
            new_text, _ = remove_google_font_links(new_text)
            new_text = re.sub(r"<noscript>\s*</noscript>", '', new_text, flags=re.IGNORECASE)
        if new_text != text:
            f.write_text(new_text, encoding='utf-8')
            print(f"Updated: {f}")

    print('Done.')

LOCAL_FONTS_CSS_LINK_RE = re.compile(r"<link[^>]+href=\"/assets/css/fonts\.css\"[^>]*>", re.IGNORECASE)
LOCAL_FONTS_CSS_NOSCRIPT_RE = re.compile(r"<noscript>\s*<link[^>]+href=\"/assets/css/fonts\.css\"[^>]*>\s*</noscript>", re.IGNORECASE)

if __name__ == '__main__':
    main()
