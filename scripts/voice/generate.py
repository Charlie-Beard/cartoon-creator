"""
Records the cartoons' voices with ElevenLabs.

    npx tsx scripts/voice/export.ts                                         # → lines.json
    python scripts/voice/generate.py --cartoon lost-kettle --dry-run        # what it would send, and the cost
    ELEVENLABS_API_KEY=... python scripts/voice/generate.py --cartoon lost-kettle   # record what is missing

Reads scripts/voice/lines.json and writes trimmed, loudness-matched mono
MP3s to public/audio/lines/<id>.mp3, then public/audio/manifest.json (the
ids that exist and are still said somewhere). Existing clips are kept
unless --force. Each character is recorded in their voice from cast.json
(npx tsx scripts/voice/cast-check.ts lists who has none yet). Before
sending anything it checks ffmpeg is installed and that the account has
enough characters left.

The key is only ever read from the ELEVENLABS_API_KEY environment
variable. Never put it in a file in this repo.

Choosing what to record (they combine):

    --cartoon lost-kettle   only the lines said in this cartoon (--only is the same)
    --speaker moonface      only this character's lines
    --risky                 only the lines export.ts thinks may come out wrong
    --limit 5               at most N clips, to audition a voice
    --force                 record again even if the clip exists

First, hear the lines text-to-speech often gets wrong (sounds like "Zzz",
shouted CAPITALS) for a few hundred characters, and respell any that come
out wrong with say_as in config.json:

    python scripts/voice/generate.py --cartoon lost-kettle --risky

To fix clips rather than record everything, mark them wrong in /review.html
and re-record just those, after checking what would be sent:

    python scripts/voice/generate.py --redo --dry-run
    python scripts/voice/generate.py --redo

A clip that is replaced is kept in scripts/voice/takes/ (as "previous"),
to switch back to in /review.html.
"""
import argparse, json, os, re, shutil, sys, tempfile, time, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, "public", "audio")
LINES = os.path.join(OUT, "lines")

sys.path.insert(0, HERE)
from castfile import load_cast, load_config  # noqa: E402


def spoken(text, say_as=None):
    """
    What ElevenLabs is sent: respelt words from say_as, plain quotes and dots
    (it reads "’" oddly), no stray leading punctuation, and "£1" said as "1
    pound". The clip's id stays that of the written text.
    """
    if not text:
        return ""
    for written, said in (say_as or {}).items():
        text = re.sub(r"(?<![\w’'])" + re.escape(written) + r"(?![\w’'])", said, text)
    text = re.sub(r"£(\d+)", lambda m: f"{m.group(1)} pound" + ("" if m.group(1) == "1" else "s"), text)
    return text.replace("’", "'").replace("‘", "'").replace("…", "...").strip().lstrip(".,!?:; ").strip()


def encode(src, path, tail_ms=60):
    """Trims silence, matches loudness and writes a mono MP3."""
    import subprocess
    filt = (
        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,"
        "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,"
        f"apad=pad_dur={tail_ms / 1000},loudnorm=I=-18:TP=-2:LRA=7"
    )
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", filt, "-ac", "1", "-ar", "44100",
         "-codec:a", "libmp3lame", "-b:a", "64k", path],
        check=True,
    )


class ElevenLabs:
    API = "https://api.elevenlabs.io/v1"

    def __init__(self, need_key=True):
        self.key = os.environ.get("ELEVENLABS_API_KEY")
        if not self.key and need_key:
            sys.exit("Set ELEVENLABS_API_KEY (from elevenlabs.io → Profile → API keys). Never write it in a file.")
        self.model, self.say_as = load_config()
        self.cast = load_cast()

    def _request(self, method, path, body=None):
        req = urllib.request.Request(
            self.API + path, method=method,
            data=json.dumps(body).encode() if body is not None else None,
            headers={"xi-api-key": self.key, "Content-Type": "application/json"},
        )
        for attempt in range(5):
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    return r.read()
            except urllib.error.HTTPError as e:
                if e.code in (429, 500, 502, 503) and attempt < 4:
                    time.sleep(2 ** (attempt + 1))
                    continue
                sys.exit(f"ElevenLabs {e.code}: {e.read().decode(errors='replace')}")

    def list_voices(self):
        for v in json.loads(self._request("GET", "/voices"))["voices"]:
            labels = ", ".join(f"{k}={x}" for k, x in (v.get("labels") or {}).items())
            print(f"{v['voice_id']}  {v['name']:<24} {labels}")

    def characters_left(self):
        """Characters left this month, or None if the key can't read the subscription."""
        try:
            s = json.loads(self._request("GET", "/user/subscription"))
            return s["character_limit"] - s["character_count"]
        except (SystemExit, KeyError, TypeError):
            return None

    def render(self, job, tmp):
        """Records one clip."""
        s = job["voice"].get("settings", {})
        body = {
            "text": job["text"],
            "model_id": self.model,
            "language_code": "en",
            "voice_settings": {
                "stability": s.get("stability", 0.5),
                "similarity_boost": s.get("similarity_boost", 0.75),
                "style": s.get("style", 0),
                "speed": s.get("speed", 1.0),
            },
        }
        audio = self._request("POST", f"/text-to-speech/{job['voice']['voice_id']}?output_format=mp3_44100_128", body)
        with open(tmp, "wb") as f:
            f.write(audio)


def clip_path(cid):
    return os.path.join(LINES, f"{cid}.mp3")


def write_manifest(data):
    """Lists the clips that exist and are still wanted (a line that was rewritten has a new id)."""
    have = {f[:-4] for f in os.listdir(LINES) if f.endswith(".mp3")}
    manifest = {"lines": sorted(l["id"] for l in data["lines"] if l["id"] in have)}
    json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8"))
    print("manifest:", len(manifest["lines"]), "lines")
    stale = have - {l["id"] for l in data["lines"]}
    if stale:
        print(f"{len(stale)} clips on disk are no longer said anywhere (left in place, not in the manifest).")


def in_cartoon(line, cartoon):
    return any(w.split("/", 1)[0] == cartoon for w in [line["where"], *line.get("also", [])])


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Record the cartoons' voices with ElevenLabs.")
    ap.add_argument("--cartoon", "--only", dest="cartoon", help="only the lines said in this cartoon (e.g. lost-kettle)")
    ap.add_argument("--speaker", help="only lines spoken by this character (e.g. moonface)")
    ap.add_argument("--risky", action="store_true", help="only the lines export.ts thinks may come out wrong")
    ap.add_argument("--limit", type=int, help="at most N clips, for auditioning voices")
    ap.add_argument("--force", action="store_true", help="redo clips that already exist")
    ap.add_argument("--list-voices", action="store_true", help="print the voice IDs on your account")
    ap.add_argument("--redo", action="store_true", help="only the clips marked wrong in /review.html")
    ap.add_argument("--clips", help="only these clips, e.g. lines/1001tlp,lines/7a2")
    ap.add_argument("--dry-run", action="store_true", help="print what would be sent and its cost; send nothing")
    ap.add_argument("--quiet", action="store_true", help="with --dry-run: only the totals")
    ap.add_argument("--manifest", action="store_true", help="only rewrite manifest.json from the clips on disk")
    args = ap.parse_args()

    v = ElevenLabs(need_key=not (args.dry_run or args.manifest))
    if args.list_voices:
        return v.list_voices()

    # utf-8 explicitly: Windows would otherwise read ’ as "â€™" and the voice reads that out.
    data = json.load(open(os.path.join(HERE, "lines.json"), encoding="utf-8"))
    os.makedirs(LINES, exist_ok=True)
    if args.manifest:
        return write_manifest(data)

    cartoons = {l["where"].split("/", 1)[0] for l in data["lines"]}
    if args.cartoon and args.cartoon not in cartoons:
        sys.exit(f'No lines from a cartoon called "{args.cartoon}" in lines.json. '
                 f"Run npx tsx scripts/voice/export.ts first. Cartoons there: {', '.join(sorted(cartoons)) or 'none'}.")

    from check import file_hash, stash

    # Which clips to record: the ones asked for, else the missing ones (or all with --force).
    chosen = None
    if args.redo or args.clips:
        chosen = set(args.clips.split(",")) if args.clips else set()
        review_path = os.path.join(HERE, "review.json")
        review = json.load(open(review_path, encoding="utf-8")) if os.path.exists(review_path) else {}
        for key, r in review.items():
            kind, cid = key.split("/", 1)
            path = clip_path(cid)
            # A verdict on an older recording of the clip doesn't count.
            if args.redo and r["verdict"] == "bad" and os.path.exists(path) and file_hash(path) == r["hash"]:
                chosen.add(key)
                print(f"redo {key}" + (f"  (“{r['note']}”)" if r.get("note") else ""))
        if not chosen:
            return print("Nothing marked wrong in /review.html.")

    def wanted(cid):
        if chosen is not None:
            return f"lines/{cid}" in chosen
        return args.force or not os.path.exists(clip_path(cid))

    lines = [l for l in data["lines"]
             if (not args.cartoon or in_cartoon(l, args.cartoon))
             and (not args.speaker or l["speaker"] == args.speaker)
             and (not args.risky or l.get("risky"))
             and wanted(l["id"])]
    if args.limit:
        lines = lines[: args.limit]

    # A character with no voice must not be recorded in someone else's: stop and say who.
    uncast = sorted({l["speaker"] for l in lines} - set(v.cast))
    if uncast:
        sys.exit(f"No voice in cast.json for: {', '.join(uncast)}.\n"
                 "Run npx tsx scripts/voice/cast-check.ts to see who they are, then pick-voice.py to choose a voice for each.")

    # Everything to record, before anything is sent, so the cost can be checked first.
    jobs = [{"id": l["id"], "text": spoken(l["text"], v.say_as), "voice": v.cast[l["speaker"]], "speaker": l["speaker"],
             "note": l.get("risky"), "where": l["where"]} for l in lines]
    for j in jobs:
        if not j["text"]:
            print(f"skipping {j['id']}: nothing to say")
    jobs = [j for j in jobs if j["text"]]

    total = sum(len(j["text"]) for j in jobs)
    summary = f"{len(jobs)} clips / {total:,} chars"
    if args.dry_run:
        if not args.quiet:
            for j in jobs:
                print(f"  {j['id']:<10} {j['speaker']:<12} {len(j['text']):>3}: {j['text']}" + (f"   ⚑ {j['note']}" if j.get("note") else ""))
        print(f"\nWould send {total:,} characters ({summary if jobs else 'nothing'}). Nothing was sent.")
        if v.key and (left := v.characters_left()) is not None:
            print(f"The account has {left:,} characters left this month.")
        return
    if not jobs:
        return print("Nothing to record.")

    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg isn't installed (it trims and levels every clip). Install it first (apt install ffmpeg, brew install ffmpeg, winget install ffmpeg).")
    left = v.characters_left()
    if left is not None and left < total:
        sys.exit(f"This needs {total:,} characters but the account has {left:,} left this month. "
                 "Record part of it (--cartoon, --speaker, --limit) or top up first.")
    print(f"Recording {summary}" + (f"; {left:,} left before" if left is not None else "") + ".", flush=True)

    sent = 0
    try:
        for i, j in enumerate(jobs, 1):
            path = clip_path(j["id"])
            with tempfile.TemporaryDirectory() as td:
                tmp = os.path.join(td, "raw.mp3")
                v.render(j, tmp)
                sent += len(j["text"])
                stash("lines", j["id"])
                encode(tmp, path)
            print(f"[{i}/{len(jobs)}] {j['speaker']}: wrote {os.path.relpath(path, ROOT)}", flush=True)
    finally:
        # Even when stopped part-way (Ctrl+C, an API error), list what was recorded; a rerun carries on.
        print(f"\nSent {sent:,} characters.")
        write_manifest(data)


if __name__ == "__main__":
    main()
