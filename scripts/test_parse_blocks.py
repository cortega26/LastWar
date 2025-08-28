from urllib.request import Request, urlopen
import self_host_fonts as shf

ua = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'Chrome/124.0.0.0 Safari/537.36'
)
url = shf.build_seed_google_url()
print('seed', url)
req = Request(url, headers={'User-Agent': ua, 'Accept': 'text/css,*/*;q=0.1'})
css = urlopen(req).read().decode('utf-8')
blocks = shf.parse_css_blocks(css)
print('blocks', len(blocks))
print({b['family'] for b in blocks})
print('first', blocks[0] if blocks else None)

