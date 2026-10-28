"""
Listens to every recorded clip with the most accurate Whisper that fits on the
GPU (large-v3, about 3 GB in float16) and writes one HTML page of the clips a
grown-up should listen to: the line as written, what Whisper heard with the
differences marked, and a player.

    python scripts/voice/audit.py                  # every clip → scripts/voice/audit.html
    python scripts/voice/audit.py --cartoon id     # only one cartoon's lines
    python scripts/voice/audit.py --serve          # review in the browser; verdicts save to review.json
    python scripts/voice/audit.py --model large-v3-turbo

Results are cached by clip hash in audit-cache.json, so a second run only
listens to clips that are new or changed. Neither file is committed.
"""
import argparse, difflib, html, json, os, re, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import check  # noqa: E402
from castfile import refresh_lines  # noqa: E402

CACHE = os.path.join(HERE, "audit-cache.json")
LINES = os.path.join(check.AUDIO, "lines")


def load_model(name):
    import numpy as np
    from faster_whisper import WhisperModel
    check.np = np
    check.cuda_dlls()
    m = WhisperModel(name, device="cuda", compute_type="float16")
    m.transcribe(np.zeros(16000, dtype=np.float32), language="en")
    return m


def hear(m, path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    segs, _ = m.transcribe(check.np.frombuffer(raw, dtype=check.np.float32), beam_size=5, language="en",
                           condition_on_previous_text=False, vad_filter=False)
    return " ".join(s.text.strip() for s in segs)


def words(text):
    return check.norm(text)


def compare(expected, heard):
    """
    Word diff that forgives spelling of made-up names: a replaced word counts
    as heard when it is at least 70% similar. Returns (cost, ops) where each op
    is (kind, expected_word, heard_word), kind in ok / miss / extra / swap.
    """
    a, b = words(expected), words(heard)
    if "".join(a) == "".join(b):
        return 0.0, [("ok", w, w) for w in a]
    ops, bad = [], 0
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag == "equal":
            ops += [("ok", w, w) for w in a[i1:i2]]
        elif tag == "delete":
            ops += [("miss", w, "") for w in a[i1:i2]]; bad += i2 - i1
        elif tag == "insert":
            ops += [("extra", "", w) for w in b[j1:j2]]; bad += j2 - j1
        else:
            x, y = a[i1:i2], b[j1:j2]
            for k in range(max(len(x), len(y))):
                p, q = x[k] if k < len(x) else "", y[k] if k < len(y) else ""
                if p and q:
                    if difflib.SequenceMatcher(None, p, q).ratio() >= 0.7:
                        ops.append(("ok", p, q))
                    else:
                        ops.append(("swap", p, q)); bad += 1
                elif p:
                    ops.append(("miss", p, "")); bad += 1
                else:
                    ops.append(("extra", "", q)); bad += 1
    return bad / max(1, len(a)), ops


def grade(text, heard, dur):
    """(severity 0-3, reasons). 3 = very likely wrong, 2 = suspicious, 1 = worth a listen."""
    cost, ops = compare(text, heard)
    n = len(words(text))
    reasons, sev = [], 0
    if not words(heard):
        return 3, ["Whisper heard nothing"], ops
    if cost > 0.5 and n >= 3 or (n < 3 and cost >= 1):
        sev = 3; reasons.append(f"{cost:.0%} of the words differ")
    elif cost > 0.25:
        sev = 2; reasons.append(f"{cost:.0%} of the words differ")
    elif cost > 0:
        sev = 1; reasons.append("a word differs")
    extra = [o for o in ops if o[0] == "extra"]
    if len(extra) >= 3:
        sev = max(sev, 2); reasons.append("extra words spoken (context read aloud?)")
    if dur > 1.2 + len(text) / 5:
        sev = max(sev, 2); reasons.append(f"{dur:.1f} s is long for {len(text)} characters")
    elif dur < 0.25 * len(words(text)) and n >= 4:
        sev = max(sev, 2); reasons.append(f"{dur:.1f} s is short for {n} words (rushed or cut off?)")
    return sev, reasons, ops


def mark(ops):
    out = []
    for kind, p, q in ops:
        if kind == "ok":
            out.append(html.escape(p))
        elif kind == "miss":
            out.append(f'<del>{html.escape(p)}</del>')
        elif kind == "extra":
            out.append(f'<ins>{html.escape(q)}</ins>')
        else:
            out.append(f'<del>{html.escape(p)}</del><ins>{html.escape(q)}</ins>')
    return " ".join(out)


PAGE = r"""<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Voice audit</title>
<style>
:root{--bg:#f6f6f4;--card:#fff;--ink:#222;--dim:#666;--line:#ddd;--ok:#2e7d32;--bad:#c62828;--sel:#1565c0}
@media(prefers-color-scheme:dark){:root{--bg:#161616;--card:#222;--ink:#eee;--dim:#aaa;--line:#3a3a3a;--ok:#66bb6a;--bad:#ef5350;--sel:#64b5f6}}
*{box-sizing:border-box}body{font:16px/1.45 system-ui,sans-serif;margin:0;background:var(--bg);color:var(--ink)}
header{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding:10px 16px}
.top{display:flex;gap:14px;flex-wrap:wrap;align-items:center}h1{font-size:18px;margin:0}
.prog{flex:1;min-width:160px;height:8px;background:var(--line);border-radius:4px;overflow:hidden}.prog i{display:block;height:100%;background:var(--ok);width:0}
.conn{font-size:12px;padding:2px 8px;border-radius:10px;background:var(--line)}.conn.on{background:var(--ok);color:#fff}
.filters{display:flex;gap:14px;flex-wrap:wrap;margin-top:6px;font-size:14px;align-items:center}
.keys{font-size:12px;color:var(--dim);margin-top:4px}kbd{background:var(--line);border-radius:3px;padding:0 5px;font:12px monospace}
main{max-width:900px;margin:0 auto;padding:8px 16px 40vh}
.card{background:var(--card);border:2px solid var(--line);border-left:8px solid #aaa;border-radius:8px;margin:10px 0;padding:10px 14px;scroll-margin-top:130px}
.s3{border-left-color:#c62828}.s2{border-left-color:#ef6c00}.s1{border-left-color:#f9a825}
.card.sel{border-color:var(--sel);box-shadow:0 0 0 3px color-mix(in srgb,var(--sel) 25%,transparent)}
.card.ok{opacity:.5}.card.bad{border-left-color:var(--bad);background:color-mix(in srgb,var(--bad) 8%,var(--card))}
.meta{font-size:13px;color:var(--dim)}.tag{font-size:12px;background:var(--line);border-radius:10px;padding:1px 8px;color:var(--ink)}
.text{font-size:20px;margin:6px 0 2px}.heard{color:var(--dim)}.why{font-size:13px;color:var(--bad)}
del{background:#ffcdd2;color:#222;text-decoration:none;padding:0 2px;border-radius:3px}
ins{background:#c8e6c9;color:#222;text-decoration:none;padding:0 2px;border-radius:3px}
audio{width:100%;height:36px;margin-top:6px}
.act{display:flex;gap:8px;margin-top:6px;align-items:center}
button{font:inherit;padding:6px 14px;border-radius:6px;border:2px solid var(--line);background:var(--card);color:var(--ink);cursor:pointer}
button.y[aria-pressed=true]{background:var(--ok);color:#fff;border-color:var(--ok)}button.n[aria-pressed=true]{background:var(--bad);color:#fff;border-color:var(--bad)}
.note{flex:1;font:inherit;padding:6px 8px;border-radius:6px;border:2px solid var(--line);background:var(--bg);color:var(--ink)}
.note:focus{outline:none;border-color:var(--bad)}.empty{padding:40px;text-align:center;color:var(--dim)}
</style>
<header>
<div class=top><h1>Voice audit</h1><div class=prog><i id=bar></i></div><span id=count></span><span id=conn class=conn></span></div>
<div class=filters>
<label>Show <select id=min><option value=3>very likely wrong</option><option value=2 selected>suspicious and up</option><option value=1>every difference</option><option value=0>all clips</option></select></label>
<label>Cartoon <select id=cart><option value="">all</option></select></label>
<label><input type=checkbox id=todo checked> only not yet judged</label>
<label><input type=checkbox id=auto checked> autoplay</label>
<button id=dl title="Saves your verdicts as a file, if the page isn't connected to the server">Download verdicts</button>
</div>
<div class=keys><kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Space</kbd> play/pause · <kbd>R</kbd> replay · <kbd>Y</kbd> right · <kbd>N</kbd> wrong (type what's wrong, <kbd>Enter</kbd> saves and moves on) · <kbd>U</kbd> undo · <kbd>Esc</kbd> leave the note</div>
<div class=keys id=sum></div>
</header>
<main id=list></main>
<audio id=player hidden></audio>
<script>
const ROWS=@ROWS@;
const served=location.protocol.startsWith('http');
const $=id=>document.getElementById(id);
let verdicts={};           // "lines/<id>" -> {verdict,note,hash,at}
let view=[],sel=0;
const key=r=>'lines/'+r.id;
const mine=r=>{const v=verdicts[key(r)];return v&&v.hash===r.hash?v:null};
const LS='voice-audit-verdicts';
const lsGet=()=>{try{return JSON.parse(localStorage.getItem(LS)||'{}')}catch(e){return {}}};
const lsSet=()=>{try{localStorage.setItem(LS,JSON.stringify(verdicts))}catch(e){}};

async function load(){
  verdicts=lsGet();
  if(served){try{const r=await fetch('/state');verdicts={...verdicts,...await r.json()};$('conn').textContent='saving to review.json';$('conn').className='conn on'}catch(e){}}
  if(!$('conn').textContent){$('conn').textContent='not connected: saved in this browser only'}
  const carts=[...new Set(ROWS.map(r=>r.cart))].sort();
  $('cart').innerHTML='<option value="">all</option>'+carts.map(c=>`<option>${c}</option>`).join('');
  render();
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function render(keep){
  const m=+$('min').value,c=$('cart').value,td=$('todo').checked;
  // ?ids=a,b,c shows just those clips, whatever the filters say.
  const only=new URLSearchParams(location.search).get('ids');
  view=only?only.split(',').map(id=>ROWS.find(r=>r.id===id)).filter(Boolean)
    :ROWS.filter(r=>r.sev>=m&&(!c||r.cart==c)&&(!td||!mine(r)||(keep&&keep===r.id)));
  $('list').innerHTML=view.length?view.map((r,i)=>cardHtml(r,i)).join(''):'<div class=empty>Nothing left to review with these filters 🎉</div>';
  sel=Math.min(sel,Math.max(0,view.length-1));
  if(keep){const k=view.findIndex(r=>r.id===keep);if(k>=0)sel=k}
  select(sel,false);stats();
}
function cardHtml(r,i){
  const v=mine(r);
  return `<div class="card s${r.sev} ${v?v.verdict:''}" data-i="${i}">
  <div class=meta><span class=tag>${esc(r.speaker)}</span> ${esc(r.where)} · ${r.id}</div>
  <div class=text>${esc(r.text)}</div>
  <div class=heard>Heard: ${r.diff}</div>
  <div class=why>${esc(r.why)}</div>
  <div class=act><button class=y aria-pressed="${v?.verdict==='ok'}" data-a=ok>✓ Right (Y)</button>
  <button class=n aria-pressed="${v?.verdict==='bad'}" data-a=bad>✗ Wrong (N)</button>
  <input class=note placeholder="What's wrong? e.g. too shouty, skipped a word" value="${esc(v?.note||'')}"></div></div>`;
}
function stats(){
  const done=ROWS.filter(r=>r.sev>=1&&mine(r)).length,total=ROWS.filter(r=>r.sev>=1).length;
  const bad=ROWS.filter(r=>mine(r)?.verdict==='bad').length;
  $('bar').style.width=(100*done/Math.max(1,total))+'%';
  $('count').textContent=`${view.length} shown · ${done}/${total} flagged clips judged · ${bad} wrong`;
  $('sum').textContent=@SUMMARY@;
}
const player=$('player');
function select(i,play=true){
  if(!view.length)return;
  sel=Math.max(0,Math.min(view.length-1,i));
  document.querySelectorAll('.card.sel').forEach(e=>e.classList.remove('sel'));
  const el=$('list').children[sel];el.classList.add('sel');el.scrollIntoView({block:'center',behavior:'smooth'});
  player.src=(served?'/clips/':@PREFIX@)+view[sel].id+'.mp3';
  if(play&&$('auto').checked)player.play().catch(()=>{});
}
async function judge(verdict,note){
  const r=view[sel];if(!r)return;const k=key(r);
  if(verdict==null)delete verdicts[k];
  else verdicts[k]={verdict,...(note?{note}:{}),hash:r.hash,at:new Date().toISOString()};
  lsSet();
  if(served){try{await fetch('/review',{method:'POST',body:JSON.stringify({key:k,verdict,note,hash:r.hash})})}catch(e){$('conn').textContent='SAVE FAILED: server stopped?';$('conn').className='conn'}}
}
function advance(){
  // The next clip still to judge after this one (or just the next, if all are shown).
  const from=sel;let n=from+1;
  if($('todo').checked)while(n<view.length&&mine(view[n]))n++;
  const id=view[from].id;
  const el=$('list').children[from];el.className=el.className.replace(/\bsel\b/,'')+' '+(mine(view[from])?.verdict||'');
  if(n>=view.length){render();return}
  sel=n;render(view[n].id);
  // keep the one just judged out of the list, but selection on the next
}
async function mark(verdict){
  const el=$('list').children[sel];if(!el)return;
  const note=el.querySelector('.note').value.trim();
  if(verdict==='bad'&&!note&&document.activeElement!==el.querySelector('.note')){
    await judge('bad','');el.className='card s'+view[sel].sev+' sel bad';
    el.querySelector('[data-a=bad]').setAttribute('aria-pressed','true');el.querySelector('[data-a=ok]').setAttribute('aria-pressed','false');
    el.querySelector('.note').focus();stats();return;
  }
  await judge(verdict,verdict==='bad'?note:'');advance();
}
document.addEventListener('keydown',e=>{
  if(e.target.classList.contains('note')){
    if(e.key==='Enter'){e.preventDefault();mark('bad')}
    if(e.key==='Escape')e.target.blur();
    return;
  }
  if(e.target.tagName==='SELECT'||e.metaKey||e.ctrlKey)return;
  const k=e.key.toLowerCase();
  if(k==='arrowdown'||k==='j'){e.preventDefault();select(sel+1)}
  else if(k==='arrowup'||k==='k'){e.preventDefault();select(sel-1)}
  else if(k===' '){e.preventDefault();player.paused?(player.ended&&(player.currentTime=0),player.play()):player.pause()}
  else if(k==='r'){player.currentTime=0;player.play()}
  else if(k==='y')mark('ok');
  else if(k==='n'){e.preventDefault();mark('bad')}
  else if(k==='u'){judge(null).then(()=>render(view[sel]?.id))}
});
$('list').addEventListener('click',e=>{
  const card=e.target.closest('.card');if(!card)return;
  const i=+card.dataset.i;
  if(e.target.dataset.a){sel=i;mark(e.target.dataset.a);return}
  if(e.target.classList.contains('note'))return;
  select(i);
});
$('list').addEventListener('focusout',e=>{
  // A note edited and left alone (no Enter) is still saved.
  if(!e.target.classList.contains('note'))return;
  const card=e.target.closest('.card');const r=view[+card.dataset.i];const v=mine(r);
  if(v&&v.verdict==='bad'&&(v.note||'')!==e.target.value.trim()){sel=+card.dataset.i;judge('bad',e.target.value.trim())}
});
['min','cart','todo'].forEach(id=>$(id).onchange=()=>{sel=0;render()});
$('dl').onclick=()=>{
  const out={};Object.keys(verdicts).sort().forEach(k=>out[k]=verdicts[k]);
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(out,null,1)],{type:'application/json'}));
  a.download='review-audit.json';a.click();
};
load();
</script>"""


def card_data(sev, cid, l, c, why, ops):
    return {"id": cid, "sev": sev, "speaker": l["speaker"], "where": l["where"], "cart": l["where"].split("/", 1)[0],
            "text": l["text"], "hash": c["hash"], "why": "; ".join(why),
            "diff": mark(ops) if ops else html.escape(c["heard"])}


def write_review(file, review):
    """Same layout as review-server.ts: sorted keys, one entry per line, so git merges cleanly."""
    rows = [f" {json.dumps(k, ensure_ascii=False)}: {json.dumps(review[k], ensure_ascii=False)}" for k in sorted(review)]
    open(file, "w", encoding="utf-8").write("{\n" + ",\n".join(rows) + "\n}\n" if rows else "{}\n")


def serve(page, port):
    import datetime, http.server
    review_file = os.path.join(HERE, "review.json")

    def read():
        return json.load(open(review_file, encoding="utf-8")) if os.path.exists(review_file) else {}

    class H(http.server.BaseHTTPRequestHandler):
        def reply(self, code, body, kind="application/json"):
            if not isinstance(body, bytes):
                body = json.dumps(body).encode()
            self.send_response(code)
            self.send_header("Content-Type", kind)
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            self.path = self.path.split("?", 1)[0]
            if self.path in ("/", "/index.html"):
                return self.reply(200, page.encode("utf-8"), "text/html; charset=utf-8")
            if self.path == "/state":
                return self.reply(200, read())
            m = re.fullmatch(r"/clips/([\w.-]+)\.mp3", self.path)
            p = m and os.path.join(LINES, m.group(1) + ".mp3")
            if p and os.path.exists(p):
                return self.reply(200, open(p, "rb").read(), "audio/mpeg")
            self.reply(404, {"error": "not found"})

        def do_POST(self):
            if self.path != "/review":
                return self.reply(404, {"error": "not found"})
            b = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or "{}")
            m = re.fullmatch(r"lines/([\w.-]+)", str(b.get("key", "")))
            if not m or not os.path.exists(os.path.join(LINES, m.group(1) + ".mp3")):
                return self.reply(400, {"error": "bad key"})
            review = read()
            if b.get("verdict") in ("ok", "bad"):
                note = str(b.get("note") or "").strip()[:500]
                review[b["key"]] = {"verdict": b["verdict"], **({"note": note} if note else {}),
                                    "hash": check.file_hash(os.path.join(LINES, m.group(1) + ".mp3")),
                                    "at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")}
            else:
                review.pop(b["key"], None)
            write_review(review_file, review)
            self.reply(200, review.get(b["key"]))

        def log_message(self, *a):
            pass

    print(f"Review page: http://localhost:{port}/   (Ctrl+C to stop; verdicts save to scripts/voice/review.json)", flush=True)
    http.server.ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cartoon")
    ap.add_argument("--model", default="large-v3")
    ap.add_argument("--out", default=os.path.join(HERE, "audit.html"))
    ap.add_argument("--serve", action="store_true", help="serve the page so verdicts save into review.json")
    ap.add_argument("--port", type=int, default=8765)
    args = ap.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    data = json.load(open(refresh_lines(), encoding="utf-8"))
    by_id = {l["id"]: l for l in data["lines"]}
    cache = json.load(open(CACHE, encoding="utf-8")) if os.path.exists(CACHE) else {}
    cache_key = args.model

    ids = sorted(f[:-4] for f in os.listdir(LINES) if f.endswith(".mp3"))
    if args.cartoon:
        ids = [i for i in ids if i in by_id and any(w.split("/", 1)[0] == args.cartoon for w in [by_id[i]["where"], *by_id[i].get("also", [])])]
    todo = [i for i in ids if i in by_id
            and (cache.get(i, {}).get("hash") != check.file_hash(check.path_of("lines", i))
                 or cache.get(i, {}).get("model") != cache_key)]
    print(f"{len(ids)} clips, {len(todo)} to listen to with {args.model}", flush=True)

    if todo:
        m = load_model(args.model)
        t0 = time.time()
        for n, cid in enumerate(todo, 1):
            p = check.path_of("lines", cid)
            cache[cid] = {"hash": check.file_hash(p), "model": cache_key, "heard": hear(m, p), "dur": check.duration(p)}
            if n % 50 == 0:
                print(f"  {n}/{len(todo)}  {(time.time() - t0) / n:.2f} s/clip", flush=True)
                json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
        json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)

    rows, orphans = [], 0
    for cid in ids:
        l, c = by_id.get(cid), cache.get(cid)
        if not l:
            orphans += 1; continue
        sev, why, ops = grade(l["text"], c["heard"], c["dur"])
        rows.append(card_data(sev, cid, l, c, why, ops))
    rows.sort(key=lambda r: (-r["sev"], r["where"]))

    counts = [sum(1 for r in rows if r["sev"] == s) for s in (3, 2, 1)]
    summary = (f"{len(rows)} clips listened to with Whisper {args.model}: {counts[0]} very likely wrong, "
               f"{counts[1]} suspicious, {counts[2]} with a small difference. {orphans} clips on disk belong to no current line.")
    prefix = json.dumps("../../public/audio/lines/")
    page = (PAGE.replace("@ROWS@", json.dumps(rows, ensure_ascii=False).replace("</", "<\\/"))
            .replace("@SUMMARY@", json.dumps(summary)).replace("@PREFIX@", prefix))
    open(args.out, "w", encoding="utf-8").write(page)
    print(summary)
    print("→", args.out)
    if args.serve:
        serve(page, args.port)


if __name__ == "__main__":
    main()
