import json, time, io, os, urllib.request
from PIL import Image
ROOT = r'C:\Users\User\Documents\GitHubProjects\TCG-Binder-Planner'
OUT = os.path.join(ROOT, 'images', 'm6')
os.makedirs(OUT, exist_ok=True)
ids = json.load(open(os.path.join(ROOT, 'legacy', 'm6-secret-ids.json')))
log = open(os.path.join(ROOT, 'legacy', 'download-m6.log'), 'w')
ok = fail = 0
for mid in ids:
    dest = os.path.join(OUT, str(mid) + '.jpg')
    if os.path.exists(dest) and os.path.getsize(dest) > 5000: continue
    p = str(mid).zfill(9)
    url = f'https://tcgrepublic.com/media/binary/{p[0:3]}/{p[3:6]}/{p[6:9]}/{mid}.jpg'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=30).read()
        im = Image.open(io.BytesIO(data)).convert('RGB')
        if im.width > 480: im = im.resize((480, int(im.height*480/im.width)), Image.LANCZOS)
        im.save(dest, 'JPEG', quality=78, optimize=True)
        ok += 1
    except Exception as e:
        fail += 1; log.write(f'FAIL {mid}: {e}\n')
    log.write(f'{ok+fail}/{len(ids)} ok={ok} fail={fail}\n'); log.flush()
    time.sleep(0.12)
log.write('DONE\n'); log.close()
