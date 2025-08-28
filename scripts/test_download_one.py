from urllib.request import Request, urlopen

ua = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'Chrome/124.0.0.0 Safari/537.36'
)
url = 'https://fonts.gstatic.com/s/inter/v19/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2'
req = Request(url, headers={'User-Agent': ua})
with urlopen(req) as resp:
    data = resp.read()
print('bytes', len(data))

