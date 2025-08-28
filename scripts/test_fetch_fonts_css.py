from urllib.request import Request, urlopen

ua = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'Chrome/124.0.0.0 Safari/537.36'
)
url = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap'
req = Request(url, headers={'User-Agent': ua, 'Accept': 'text/css,*/*;q=0.1'})
with urlopen(req) as resp:
    css = resp.read().decode('utf-8')
print('len', len(css))
print(css[:400])

