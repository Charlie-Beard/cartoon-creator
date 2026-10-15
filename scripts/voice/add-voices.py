"""
Adds every Voice Library voice in cast.json (those with an "owner") to your
ElevenLabs account, so generate.py can record with them. Voices already
there are skipped, and so are ElevenLabs' own premade voices (they have no
owner and need no adding), so it's safe to run again.

    python scripts/voice/add-voices.py            # add what's missing
    python scripts/voice/add-voices.py --dry-run  # just say what it would add

Needs ELEVENLABS_API_KEY (read from the environment) with the Voices: Write
permission (voices_write).
"""
import argparse, json, os, sys, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from castfile import load_cast, save_entry  # noqa: E402

API = "https://api.elevenlabs.io/v1"


def request(method, path, key, body=None):
    req = urllib.request.Request(
        API + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("Set ELEVENLABS_API_KEY first.")

    cast = load_cast()
    have = {v["voice_id"] for v in request("GET", "/voices", key).get("voices", [])}

    # One voice can serve more than one character: add it once.
    todo = {}
    for who, v in cast.items():
        if v.get("owner") and v["voice_id"] not in have:
            todo.setdefault(v["voice_id"], (who, v["owner"]))
    if not todo:
        print("Every chosen voice is already in your account.")
        return

    for voice_id, (who, owner) in todo.items():
        if args.dry_run:
            print(f"would add {voice_id} ({who})")
            continue
        try:
            added = request("POST", f"/voices/add/{owner}/{voice_id}", key, {"new_name": f"{cast[who]['name']} ({who})"})
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="replace")
            if "voices_write" in detail:
                sys.exit("The API key is missing Voices: Write. Edit it on elevenlabs.io → API Keys, then run this again.")
            sys.exit(f"{who}: ElevenLabs {e.code}: {detail}")
        new_id = added.get("voice_id", voice_id)
        if new_id != voice_id:
            # generate.py sends cast.json's id, so it must be the account's: update every character using it.
            print(f"{who}: added, but as {new_id}; updating cast.json.")
            for other, v in cast.items():
                if v["voice_id"] == voice_id:
                    save_entry(other, {**v, "voice_id": new_id})
        else:
            print(f"added {voice_id} ({who})")


if __name__ == "__main__":
    main()
