from urllib.request import Request, urlopen
from pathlib import Path
import self_host_fonts as shf

ua = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'Chrome/124.0.0.0 Safari/537.36'
)
seed = shf.build_seed_google_url()
print('seed', seed)
req = Request(seed, headers={'User-Agent': ua, 'Accept': 'text/css,*/*;q=0.1'})
css = urlopen(req).read().decode('utf-8')
blocks = shf.parse_css_blocks(css)
print('blocks', len(blocks))
local_css, files = shf.build_local_css_and_download(blocks)
print('files', len(files))
Path('assets/css').mkdir(parents=True, exist_ok=True)
Path('assets/css/fonts.css').write_text(local_css, encoding='utf-8')
print('wrote fonts.css bytes', len(local_css.encode('utf-8')))

