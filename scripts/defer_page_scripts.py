from pathlib import Path
import re

def add_defer_to_tag(tag: str) -> str:
    # If already has defer or async, return as is
    if re.search(r"\sdefer(\s|>)", tag) or re.search(r"\sasync(\s|>)", tag):
        return tag
    # Insert defer before closing '>'
    return re.sub(r">\s*$", " defer>", tag)


def process_html(text: str) -> str:
    changed = text
    # Fix previous malformed inserts like </script defer>
    changed = re.sub(r"</script\s+defer>", "</script>", changed, flags=re.IGNORECASE)
    # Target our site JS files in ../assets/js or /assets/js
    pattern = re.compile(r"(<script\s+[^>]*src=\"(\.\./assets/js/|/assets/js/)[^\"]+\"[^>]*)(>)(\s*</script>)", re.IGNORECASE)
    def _repl(m):
        open_tag = m.group(1)
        end_angle = m.group(3)
        closing = m.group(4)
        if re.search(r"\sdefer(\s|$)", open_tag) or re.search(r"\sasync(\s|$)", open_tag):
            return m.group(0)
        return open_tag + " defer" + end_angle + closing
    changed = pattern.sub(_repl, changed)
    return changed


def main():
    for f in Path('pages').glob('*.html'):
        txt = f.read_text(encoding='utf-8', errors='ignore')
        new = process_html(txt)
        if new != txt:
            f.write_text(new, encoding='utf-8')
            print(f"Updated defer: {f}")

if __name__ == '__main__':
    main()
