import json, time, io, os, urllib.request
from PIL import Image
ROOT = r'C:\Users\User\Documents\GitHubProjects\TCG-Binder-Planner'
OUT = os.path.join(ROOT, 'images', 'm2a')
with open(r'C:\Users\User\Downloads\m2a-tcgrepublic-map.json') as f: mapping = json.load(f)
ids = sorted(set(mapping.values()), reverse=True)
for mid in ids:
    dest = os.path.join(OUT, mid + '.jpg')
    if os.path.exists(dest) and os.path.getsize(dest) > 5000: continue
    p = mid.zfill(9)
    url = f'https://tcgrepublic.com/media/binary/{p[0:3]}/{p[3:6]}/{p[6:9]}/{mid}.jpg'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=30).read()
        im = Image.open(io.BytesIO(data)).convert('RGB')
        if im.width > 480: im = im.resize((480, int(im.height * 480 / im.width)), Image.LANCZOS)
        im.save(dest, 'JPEG', quality=78, optimize=True)
    except Exception: pass
    time.sleep(0.12)
