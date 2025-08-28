from pathlib import Path
import re
import subprocess

def git_sha() -> str:
    return subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()

def main():
    sha = git_sha()
    cdn_base = f"https://cdn.jsdelivr.net/gh/cortega26/LastWar@{sha}/assets/fonts/"
    rx = re.compile(r'(href=")(?:/assets/fonts/)([^\"]+)(")', re.IGNORECASE)

    files = [Path('index.html')] + list(Path('pages').glob('*.html'))
    for f in files:
        text = f.read_text(encoding='utf-8', errors='ignore')
        new = rx.sub(lambda m: m.group(1) + cdn_base + m.group(2) + m.group(3), text)
        if new != text:
            f.write_text(new, encoding='utf-8')
            print(f"Updated: {f}")

if __name__ == '__main__':
    main()

