import re
from pathlib import Path


GOOGLE_FONTS_STYLESHEET_RE = re.compile(
    r'<link[^>]+href=["\'](https://fonts\.googleapis\.com/css2[^"\']+)["\'][^>]*>',
    re.IGNORECASE,
)

PRECONNECT_GOOGLEAPIS_RE = re.compile(
    r"<link[^>]+rel=[\"']preconnect[\"'][^>]+href=[\"']https://fonts\.googleapis\.com[\"'][^>]*>",
    re.IGNORECASE,
)

PRECONNECT_GSTATIC_RE = re.compile(
    r"<link[^>]+rel=[\"']preconnect[\"'][^>]+href=[\"']https://fonts\.gstatic\.com[\"'][^>]*>",
    re.IGNORECASE,
)

PRELOAD_FONT_FILE_RE = re.compile(
    r"<link[^>]+rel=[\"']preload[\"'][^>]+href=[\"']https://fonts\.gstatic\.com/[^\"']+[\"'][^>]+as=[\"']font[\"'][^>]*>",
    re.IGNORECASE,
)


def ensure_display_swap(url: str) -> str:
    # Append display=swap to the query if missing
    if "display=" in url:
        return url
    if "?" in url:
        return url + "&display=swap"
    return url + "?display=swap"


def canonical_preconnects(content: str) -> str:
    # Normalize any existing preconnects to canonical minimal forms
    content = PRECONNECT_GOOGLEAPIS_RE.sub(
        '<link rel="preconnect" href="https://fonts.googleapis.com">', content
    )
    # Always include crossorigin for gstatic
    content = PRECONNECT_GSTATIC_RE.sub(
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>', content
    )
    return content


def add_missing_preconnects(content: str) -> str:
    have_googleapis = bool(PRECONNECT_GOOGLEAPIS_RE.search(content)) or (
        '<link rel="preconnect" href="https://fonts.googleapis.com">' in content
    )
    have_gstatic = bool(PRECONNECT_GSTATIC_RE.search(content)) or (
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' in content
    )

    insert_pos = None
    head_match = re.search(r"(?is)<head[^>]*>", content)
    if head_match:
        insert_pos = head_match.end()

    to_insert = []
    if not have_googleapis:
        to_insert.append('\n    <link rel="preconnect" href="https://fonts.googleapis.com">')
    if not have_gstatic:
        to_insert.append('\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')

    if to_insert and insert_pos is not None:
        content = content[:insert_pos] + ("".join(to_insert)) + content[insert_pos:]
    return content


def replace_stylesheet_with_preload(block: str) -> str:
    def _repl(m: re.Match) -> str:
        href = ensure_display_swap(m.group(1))
        preload = (
            f'<link rel="preload" as="style" href="{href}" onload="this.onload=null;this.rel=\'stylesheet\'">'
        )
        noscript = f"<noscript><link rel=\"stylesheet\" href=\"{href}\"></noscript>"
        return preload + "\n    " + noscript

    return GOOGLE_FONTS_STYLESHEET_RE.sub(_repl, block)


def process_html(content: str) -> str:
    original = content
    content = canonical_preconnects(content)
    content = add_missing_preconnects(content)
    # Remove any font file preloads (often TTF) that are brittle/unnecessary
    content = PRELOAD_FONT_FILE_RE.sub("", content)
    # Convert render-blocking stylesheet to non-blocking preload+onload
    content = replace_stylesheet_with_preload(content)
    return content if content != original else original


def main():
    html_files = list(Path('.').rglob('*.html'))
    changed = 0
    for f in html_files:
        # Skip common vendor or node_modules if present
        if any(part in {"node_modules", "dist", "build", ".venv", "backups", ".lighthouseci"} for part in f.parts):
            continue
        text = f.read_text(encoding='utf-8', errors='ignore')
        new_text = process_html(text)
        if new_text != text:
            f.write_text(new_text, encoding='utf-8')
            changed += 1
            print(f"Updated: {f}")
    print(f"Total files updated: {changed}")


if __name__ == '__main__':
    main()
