import re
from pathlib import Path

VERSION = "v=20250828"

def bump(text: str) -> str:
    # Append ?v=... if not already present for CSS/JS/Fonts and key image preload
    def add_qs(url: str) -> str:
        return url if ("?v=" in url or url.startswith("http")) else (url + ("&" if "?" in url else "?") + VERSION)

    # href/src attributes
    def repl_attr(m: re.Match) -> str:
        pre, url, post = m.group(1), m.group(2), m.group(3)
        return f"{pre}{add_qs(url)}{post}"

    patterns = [
        # Link/script to /assets css/js
        (re.compile(r"(href=\")(\.?\.?/assets/(?:css|js)/[^\"<>]+)(\")", re.IGNORECASE), repl_attr),
        (re.compile(r"(src=\")(\.?\.?/assets/(?:css|js)/[^\"<>]+)(\")", re.IGNORECASE), repl_attr),
        # Fonts css link
        (re.compile(r"(href=\")(\.?\.?/assets/css/fonts\.css)(\")", re.IGNORECASE), repl_attr),
        # Preload hero image on home
        (re.compile(r"(href=\")(/assets/images/base-hero\.webp)(\")", re.IGNORECASE), repl_attr),
    ]

    for rx, fn in patterns:
        text = rx.sub(fn, text)
    return text


def main():
    files = [Path('index.html')] + list(Path('pages').glob('*.html'))
    for f in files:
        txt = f.read_text(encoding='utf-8', errors='ignore')
        new = bump(txt)
        if new != txt:
            f.write_text(new, encoding='utf-8')
            print(f"Updated: {f}")

if __name__ == '__main__':
    main()

