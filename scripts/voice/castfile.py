"""
Reads and edits cast.json (the voice of each character) without losing its
layout: one character per line, grouped by world with blank lines between.
Shared by generate.py, pick-voice.py and add-voices.py. Also holds
refresh_lines(), which generate.py and check.py call before reading lines.json.
"""
import json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CAST = os.path.join(HERE, "cast.json")

DEFAULT_SETTINGS = {"stability": 0.5, "speed": 1.0}

ROOT = os.path.dirname(os.path.dirname(HERE))
LINES_JSON = os.path.join(HERE, "lines.json")


def refresh_lines():
    """
    Regenerates lines.json from the cartoons (npx tsx scripts/voice/export.ts)
    and returns its path. lines.json is derived, not committed, so two
    cartoon PRs never conflict over it; every reader calls this first.
    """
    npx = shutil.which("npx")
    if not (shutil.which("node") and npx):
        sys.exit("Node.js is needed to list the cartoons' lines (lines.json is built by "
                 "`npx tsx scripts/voice/export.ts`), but `node`/`npx` is not on your PATH. "
                 "Install Node 20+ and run `npm install` in the repo, then try again.")
    r = subprocess.run([npx, "tsx", "scripts/voice/export.ts"], cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0 or not os.path.exists(LINES_JSON):
        sys.exit("Could not build scripts/voice/lines.json (npx tsx scripts/voice/export.ts failed).\n"
                 "Is `npm install` done? Its output:\n" + (r.stdout + r.stderr).strip())
    print("lines.json:", (r.stdout.strip().splitlines() or ["rebuilt"])[0], flush=True)
    return LINES_JSON


def load_cast(path=CAST):
    """{character id: {voice_id, name, settings, owner?}}. Keys starting "_" are notes, not characters."""
    data = json.load(open(path, encoding="utf-8"))
    return {k: v for k, v in data.items() if not k.startswith("_")}


def load_config():
    """model_id and say_as (config.json)."""
    cfg = json.load(open(os.path.join(HERE, "config.json"), encoding="utf-8"))
    return cfg["model_id"], cfg.get("say_as", {})


def entry_line(cid, entry):
    settings = ", ".join(f'"{k}": {json.dumps(v)}' for k, v in entry.get("settings", DEFAULT_SETTINGS).items())
    owner = f', "owner": {json.dumps(entry["owner"])}' if entry.get("owner") else ""
    return (f'  {json.dumps(cid)}: {{ "voice_id": {json.dumps(entry["voice_id"])}, "name": {json.dumps(entry["name"], ensure_ascii=False)}'
            f'{owner}, "settings": {{ {settings} }} }}')


def save_entry(cid, entry, path=CAST):
    """
    Sets one character's entry. An existing one is replaced where it stands;
    a new one goes at the end. Everything else in the file is left as it is.
    """
    lines = open(path, encoding="utf-8").read().rstrip("\n").split("\n")
    new = entry_line(cid, entry)
    for i, line in enumerate(lines):
        if re.match(r"\s*" + re.escape(json.dumps(cid)) + r"\s*:", line):
            lines[i] = new + ("," if line.rstrip().endswith(",") else "")
            break
    else:
        close = max(i for i, line in enumerate(lines) if line.strip() == "}")
        last = max(i for i in range(close) if lines[i].strip())
        if not lines[last].rstrip().endswith(("{", ",")):
            lines[last] += ","
        lines.insert(close, new)
    open(path, "w", encoding="utf-8", newline="\n").write("\n".join(lines) + "\n")
    json.load(open(path, encoding="utf-8"))  # must still be valid JSON
