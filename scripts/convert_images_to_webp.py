from pathlib import Path
from PIL import Image

SRC = Path('assets/images')

def convert(img_path: Path, quality: int = 82):
    out = img_path.with_suffix('.webp')
    try:
        with Image.open(img_path) as im:
            im.save(out, 'WEBP', quality=quality, method=6)
        print(f"Converted {img_path.name} -> {out.name}")
    except Exception as e:
        print(f"Failed {img_path}: {e}")


def main():
    for p in SRC.glob('*'):
        if p.suffix.lower() in {'.png', '.jpg', '.jpeg'}:
            convert(p)

if __name__ == '__main__':
    main()

