import time, io, os, re, urllib.request
from PIL import Image
ROOT = r'C:\Users\User\Documents\GitHubProjects\TCG-Binder-Planner'
OUT = os.path.join(ROOT, 'images', 'sv4a')
os.makedirs(OUT, exist_ok=True)
src = open(os.path.join(ROOT, 'data', 'sets', 'sv4a.js'), encoding='utf-8').read()
ids = sorted(set(re.findall(r'tcgrepublic\.com/media/binary/\d{3}/\d{3}/\d{3}/(\d+)\.jpg', src)), reverse=True)
for mid in ids:
    dest = os.path.join(OUT, mid + '.jpg')
    if os.path.exists(dest) and os.path.getsize(dest) > 5000:
        continue
    p = mid.zfill(9)
    url = f'https://tcgrepublic.com/media/binary/{p[0:3]}/{p[3:6]}/{p[6:9]}/{mid}.jpg'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=30).read()
        im = Image.open(io.BytesIO(data)).convert('RGB')
        if im.width > 480:
            im = im.resize((480, int(im.height * 480 / im.width)), Image.LANCZOS)
        im.save(dest, 'JPEG', quality=78, optimize=True)
    except Exception:
        pass
    time.sleep(0.12)
