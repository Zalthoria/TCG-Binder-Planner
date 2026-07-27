# Download SV4a mirror scans from TCG Republic into images/sv4a/ (hotlinking is blocked,
# so they must be served from our own origin — same approach as M2a).
import json, time, io, os, re, urllib.request
from PIL import Image

ROOT = r'C:\Users\User\Documents\GitHubProjects\TCG-Binder-Planner'
OUT = os.path.join(ROOT, 'images', 'sv4a')
os.makedirs(OUT, exist_ok=True)

src = open(os.path.join(ROOT, 'data', 'sets', 'sv4a.js'), encoding='utf-8').read()
ids = sorted(set(re.findall(r'tcgrepublic\.com/media/binary/\d{3}/\d{3}/\d{3}/(\d+)\.jpg', src)))
log = open(os.path.join(ROOT, 'legacy', 'download-sv4a.log'), 'w')
log.write(f'to fetch: {len(ids)}\n'); log.flush()

ok = skip = fail = 0
for i, mid in enumerate(ids):
    dest = os.path.join(OUT, mid + '.jpg')
    if os.path.exists(dest) and os.path.getsize(dest) > 5000:
        skip += 1
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
        ok += 1
    except Exception as e:
        fail += 1
        log.write(f'FAIL {mid}: {e}\n')
    if (i + 1) % 20 == 0:
        log.write(f'progress {i+1}/{len(ids)} ok={ok} fail={fail}\n'); log.flush()
    time.sleep(0.12)
log.write(f'DONE total={len(ids)} ok={ok} skip={skip} fail={fail}\n')
log.close()
