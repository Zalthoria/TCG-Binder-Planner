# One-off: download M2a variant scans from TCG Republic, downsize, store in images/m2a/
import json, time, io, os, urllib.request
from PIL import Image

ROOT = r'C:\Users\User\Documents\GitHubProjects\TCG-Binder-Planner'
OUT = os.path.join(ROOT, 'images', 'm2a')
os.makedirs(OUT, exist_ok=True)

with open(r'C:\Users\User\Downloads\m2a-tcgrepublic-map.json') as f:
    mapping = json.load(f)

ids = sorted(set(mapping.values()))
log = open(os.path.join(ROOT, 'legacy', 'download-m2a.log'), 'w')
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
    if (i + 1) % 25 == 0:
        log.write(f'progress {i+1}/{len(ids)} ok={ok} fail={fail}\n')
        log.flush()
    time.sleep(0.12)
log.write(f'DONE total={len(ids)} ok={ok} skip={skip} fail={fail}\n')
log.close()
