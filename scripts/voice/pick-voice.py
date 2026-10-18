"""
Finds a voice for one character in the ElevenLabs Voice Library, adds it to
your account, and sets it in cast.json.

    python scripts/voice/pick-voice.py moonface --list         # just show the list
    python scripts/voice/pick-voice.py moonface                # best match
    python scripts/voice/pick-voice.py moonface --pick 2       # the 2nd on the list
    python scripts/voice/pick-voice.py moonface --name Arthur  # the one whose name starts "Arthur"
    python scripts/voice/pick-voice.py moonface --id <id>      # exactly this voice (names repeat)
    python scripts/voice/pick-voice.py moonface --id <id> --no-add   # choose now, add later (add-voices.py)

A character this script has no description of (a new one in a world) needs
to be told what to look for. Take it from the character's `voice` note
(cast-check.ts prints it):

    python scripts/voice/pick-voice.py kreacher --gender male --age old \
        --search "grumpy british old man" --good grumpy --good croaky --list

Searching costs nothing. Each candidate has a preview link to listen to
first; then hear the character's own lines with

    python scripts/voice/generate.py --speaker moonface --limit 5 --force

Needs ELEVENLABS_API_KEY (read from the environment, never from a file).
"""
import argparse, os, sys, time, urllib.error, urllib.parse, urllib.request
import json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from castfile import CAST, DEFAULT_SETTINGS, load_cast, save_entry  # noqa: E402
API = "https://api.elevenlabs.io/v1"

# Words in a voice's description that make it a worse fit for anyone here.
NEVER = ["sexy", "seductive", "asmr", "news", "corporate", "american", "australian", "whisper", "impression", "impersonat"]
STORY = ["british", "english", "storytelling", "audiobook", "character", "animation", "cartoon", "children"]


def want(gender, age, searches, good, bad=()):
    return {"gender": gender, "age": age, "searches": searches, "good": good + STORY, "bad": list(bad) + NEVER}


# What each character should sound like. A character not listed here is described
# on the command line (--gender, --age, --search, --good, --bad).
WANTED = {
    "narrator": want("female", "middle_aged", ["warm british storyteller", "british children's audiobook narrator"],
                     ["warm", "gentle", "calm", "soothing", "clear", "kind", "bedtime"], ["villain", "deep"]),
    # The Faraway Tree
    "moonface": want("male", "middle_aged", ["jolly british man", "booming warm british character"],
                     ["jolly", "warm", "booming", "cheerful", "hearty", "friendly", "round"], ["villain", "sinister"]),
    "silky": want("female", "young", ["soft bright british fairy", "gentle young british woman"],
                  ["soft", "bright", "gentle", "light", "sweet", "kind", "fairy", "airy"], ["deep", "old", "villain"]),
    "saucepan": want("male", "old", ["loud cheerful british old man", "eccentric british tinker"],
                     ["loud", "cheerful", "eccentric", "funny", "comic", "bumbling", "quirky"], ["sinister", "villain"]),
    "washalot": want("female", "old", ["busy british old lady"], ["fussy", "busy", "chatty", "old", "granny"]),
    "watzisname": want("male", "old", ["sleepy british old man"], ["sleepy", "drowsy", "slow", "old", "mumbling"]),
    "angryPixie": want("male", "middle_aged", ["grumpy british goblin character"], ["grumpy", "cross", "gruff", "comic", "goblin"]),
    "dameSnap": want("female", "middle_aged", ["strict british headmistress", "icy british witch"],
                     ["strict", "icy", "sharp", "stern", "crisp", "cold", "commanding", "villain", "witch"],
                     ["sweet", "soft", "scream"]),
    "beth": want("female", "young", ["british girl character", "young british girl"],
                 ["girl", "young", "bright", "kind", "sensible", "clear"], ["old", "mature", "deep"]),
    "joe": want("male", "young", ["british boy character", "young british boy"],
                ["boy", "young", "brave", "bright", "cheerful", "earnest"], ["old", "mature", "deep"]),
    "fran": want("female", "young", ["little british girl character", "cheeky young british girl"],
                 ["girl", "young", "cheeky", "playful", "bubbly", "excited"], ["old", "mature", "deep"]),
    "polly": want("female", "young", ["british girl character", "gentle young british girl"],
                  ["girl", "young", "bright", "kind", "gentle", "clear"], ["old", "mature", "deep"]),
    "tim": want("male", "young", ["british boy character", "little british boy"],
                ["boy", "young", "bright", "cheerful", "earnest", "small"], ["old", "mature", "deep"]),
    # Hogwarts
    "hagrid": want("male", "middle_aged", ["warm british gentle giant", "west country british storyteller"],
                   ["warm", "gentle", "friendly", "rumbling", "big", "kind"], ["villain", "sinister"]),
    "dumbledore": want("male", "old", ["wise kind british old man", "gentle british wizard"],
                       ["wise", "kind", "gentle", "calm", "twinkling", "old", "wizard"], ["villain", "sinister"]),
    "mcgonagall": want("female", "middle_aged", ["strict kind scottish woman", "stern british teacher"],
                       ["strict", "stern", "crisp", "brisk", "scottish", "teacher", "proper"], ["sweet", "soft"]),
    "snape": want("male", "middle_aged", ["slow cold british man", "dry sarcastic british teacher"],
                  ["slow", "cold", "dry", "silky", "stern", "teacher"], ["sweet", "cheerful"]),
    "voldemort": want("male", "middle_aged", ["cold hissing british villain", "menacing british whisper villain"],
                      ["cold", "hissing", "menacing", "villain", "slow", "sinister"], ["sweet", "cheerful"]),
    "dobby": want("male", "middle_aged", ["squeaky british house elf", "high british creature voice"],
                  ["squeaky", "high", "eager", "creature", "elf", "excited"], ["deep", "sinister"]),
    "harry": want("male", "young", ["british boy character", "young british boy"],
                  ["boy", "young", "brave", "bright", "earnest", "kind"], ["old", "mature", "deep"]),
    "hermione": want("female", "young", ["bright british girl character", "clever young british girl"],
                     ["girl", "young", "bright", "clever", "clear", "confident"], ["old", "mature", "deep"]),
    "ron": want("male", "young", ["british boy character", "cheerful young british boy"],
                ["boy", "young", "cheerful", "nervous", "funny", "friendly"], ["old", "mature", "deep"]),
}


def request(method, path, key, body=None):
    req = urllib.request.Request(
        API + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def search(key, terms, w):
    """Voices matching `terms`, trying strict filters first, then looser ones."""
    for params in (
        {"search": terms, "gender": w["gender"], "age": w["age"], "accent": "british", "page_size": 50},
        {"search": terms, "gender": w["gender"], "accent": "british", "page_size": 50},
        {"search": terms, "gender": w["gender"], "page_size": 50},
        {"search": terms, "page_size": 50},
    ):
        for attempt in range(4):
            try:
                found = request("GET", "/shared-voices?" + urllib.parse.urlencode(params), key).get("voices", [])
                if found:
                    return found
                break
            except urllib.error.HTTPError as e:
                # Too many searches in a row: wait and ask again, rather than
                # reporting an empty library.
                if e.code == 429 or e.code >= 500:
                    time.sleep(2 * (attempt + 1))
                    continue
                print(f"  ({terms}: ElevenLabs {e.code})", file=sys.stderr)
                break
    return []


def score(v, w):
    text = " ".join(str(v.get(k) or "") for k in ("name", "description", "descriptive", "use_case", "accent", "age", "gender")).lower()
    s = sum(2 for x in w["good"] if x in text) - sum(4 for x in w["bad"] if x in text)
    if (v.get("age") or "") == w["age"]:
        s += 6
    if "british" in (v.get("accent") or "").lower() or "english" in (v.get("accent") or "").lower():
        s += 6
    if (v.get("gender") or "") not in ("", w["gender"]):
        s -= 50
    # A little weight for voices many people use (usually better quality).
    s += min(6, (v.get("cloned_by_count") or 0) ** 0.25)
    return s


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("character", help="the character's id (cast-check.ts lists them)")
    ap.add_argument("--gender", choices=["male", "female"], help="for a character not described here")
    ap.add_argument("--age", choices=["young", "middle_aged", "old"], help="for a character not described here")
    ap.add_argument("--search", action="append", default=[], help="library search words (repeat for more); adds to the defaults")
    ap.add_argument("--good", action="append", default=[], help="a word that makes a voice's description a better fit (repeat)")
    ap.add_argument("--bad", action="append", default=[], help="a word that makes it a worse fit (repeat)")
    ap.add_argument("--pick", type=int, default=1, help="which of the listed voices to use (1 = best)")
    ap.add_argument("--name", help="use the listed voice whose name starts with this")
    ap.add_argument("--id", help="use the listed voice with this voice id")
    ap.add_argument("--no-add", action="store_true", help="set it in cast.json without adding it to your account")
    ap.add_argument("--list", action="store_true", help="only list the candidates")
    ap.add_argument("--top", type=int, default=8, help="how many candidates to list")
    args = ap.parse_args()
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("Set ELEVENLABS_API_KEY first.")
    if args.character in WANTED:
        w = dict(WANTED[args.character])
        if args.gender:
            w["gender"] = args.gender
        if args.age:
            w["age"] = args.age
        w["searches"] = args.search + w["searches"]
        w["good"] = args.good + w["good"]
        w["bad"] = args.bad + w["bad"]
    else:
        if not (args.gender and args.age):
            sys.exit(f"I don't know what {args.character} should sound like: add --gender and --age (and --search words from their voice note).")
        w = want(args.gender, args.age, args.search or ["british character voice"], args.good, args.bad)

    found = {}
    for terms in w["searches"]:
        for v in search(key, terms, w):
            found.setdefault(v["voice_id"], v)
    # The library matches a search phrase almost word for word, so a phrase
    # like "warm british dad" can find nothing. Fall back to single words.
    for word in w["good"][:4]:
        if len(found) >= args.top * 2:
            break
        for v in search(key, word, w):
            found.setdefault(v["voice_id"], v)
    if not found:
        sys.exit("No voices found in the library.")
    everyone = sorted(found.values(), key=lambda v: score(v, w), reverse=True)
    ranked = everyone[: args.top]

    print(f"Best voices for {args.character}:\n")
    for i, v in enumerate(ranked, 1):
        desc = (v.get("description") or v.get("descriptive") or "").strip().replace("\n", " ")
        print(f"{i}. {v.get('name')}  ({v.get('gender')}, {v.get('age')}, {v.get('accent')})  id {v['voice_id']}")
        print(f"   {desc[:140]}")
        print(f"   listen: {v.get('preview_url')}\n")
    if args.list:
        return

    if args.id:
        # Names repeat across the library (there are many Claires): the id never does.
        chosen = found.get(args.id)
        # A voice found some other way (the website, a wider search): look
        # it up by its name, given with --name.
        for terms in [args.name] if args.name and not chosen else []:
            req = "/shared-voices?" + urllib.parse.urlencode({"search": terms, "page_size": 100})
            chosen = next((v for v in request("GET", req, key).get("voices", []) if v["voice_id"] == args.id), None)
        if not chosen:
            sys.exit(f'Voice {args.id} isn\'t in the results. Try --list.')
    elif args.name:
        named = [v for v in everyone if (v.get("name") or "").lower().startswith(args.name.lower())]
        if not named:
            sys.exit(f'No voice named "{args.name}" in the results. Try --list.')
        chosen = named[0]
    else:
        chosen = ranked[args.pick - 1]
    if args.no_add:
        # Choosing can happen before the key may add voices (voices_write);
        # the owner id is what adding it later needs.
        voice_id = chosen["voice_id"]
        print(f"owner {chosen['public_owner_id']}")
    else:
        added = request("POST", f"/voices/add/{chosen['public_owner_id']}/{chosen['voice_id']}", key,
                        {"new_name": f"{chosen.get('name')} ({args.character})"})
        voice_id = added.get("voice_id", chosen["voice_id"])

    # Set this character's voice in cast.json, keeping the file's layout and any settings already there.
    try:
        entry = dict(load_cast().get(args.character, {}))
    except FileNotFoundError:
        entry = {}
    entry.update({"voice_id": voice_id, "name": chosen.get("name") or args.character, "owner": chosen["public_owner_id"]})
    entry.setdefault("settings", dict(DEFAULT_SETTINGS))
    save_entry(args.character, entry)

    added_text = "Not added to your account yet (run add-voices.py)" if args.no_add else "Added to your account"
    print(f"Chose {chosen.get('name')}. {added_text}, and set as {args.character}'s voice in cast.json ({voice_id}).")


if __name__ == "__main__":
    main()
