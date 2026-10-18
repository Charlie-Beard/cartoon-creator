# Voicing a cartoon

Until a line is recorded, the iPad's own British voice says it. Recording
turns every line into an MP3 in `public/audio/lines/` (the app learns which
exist from `audio/manifest.json`, which Vite builds from those files), in the
voice of whoever says it. Only whole
lines are recorded: a cartoon has no questions or numbers to piece together.

You need ElevenLabs (`ELEVENLABS_API_KEY` in your environment, **never in a
file in this repo**), `ffmpeg`, and Python 3. For the automatic check also
`pip install faster-whisper numpy`.

## Voicing one cartoon

Say it is `lost-kettle`, and finished (`npm run check -- lost-kettle` passes,
`npm run shots -- lost-kettle` looks right). Changing a line later changes
its id, so record last.

1. **Lines.** Nothing to run: `generate.py` and `check.py` rebuild
   `scripts/voice/lines.json` from every cartoon on the shelf before they read
   it (`npx tsx scripts/voice/export.ts`, so Node must be installed), and the
   review page does too when it is missing or older than a cartoon. The file
   is derived and not committed. By hand, if you want to read it:
   `npm run voice:export`.

   Lines with `{name}` are exported twice, like the games do: with
   "Jasper" (`DEFAULT_NAME`) and without ("Well done!").

2. **Check everyone has a voice** in `cast.json`:

   ```bash
   npm run voice:cast -- lost-kettle     # = npx tsx scripts/voice/cast-check.ts lost-kettle
   ```

   It lists each speaker with no voice (exit 1), then every world character
   with none yet, with the `voice` note from their world. For each one a
   grown-up chooses (searching is free):

   ```bash
   python scripts/voice/pick-voice.py kreacher --list --gender male --age old --search "grumpy british old man"
   python scripts/voice/pick-voice.py kreacher --pick 2 --gender male --age old     # add it and set it in cast.json
   ```

   Characters `pick-voice.py` knows (see its `WANTED`) need only the name.
   A voice chosen but not yet in your account: `--no-add`, then `python scripts/voice/add-voices.py`.
   Hear a voice before recording everything:
   `python scripts/voice/generate.py --speaker kreacher --limit 3 --force`.

3. **Generate** just this cartoon's lines. Look at what it would send first:

   ```bash
   python scripts/voice/generate.py --cartoon lost-kettle --dry-run
   python scripts/voice/generate.py --cartoon lost-kettle --risky        # sounds and SHOUTING first: a few hundred characters
   python scripts/voice/generate.py --cartoon lost-kettle
   ```

   It records what is missing, then trims and levels each clip. A character with no voice stops it (it never uses someone
   else's). If `--risky` clips come out wrong ("Hmph", "EH"), respell them in
   `config.json` under `say_as` and redo with `--force --risky`.

4. **Check** the clips by ear (Whisper) and length:

   ```bash
   python scripts/voice/check.py --cartoon lost-kettle     # add --no-whisper to skip the transcription
   ```

   It writes `qa.json`: flags (probably wrong) and hints (worth a listen).

5. **Review** by listening: `npm run dev`, then open
   <http://localhost:5173/review.html?cartoon=lost-kettle>. Play each line,
   mark it Right or Wrong (keys: arrows, Space, Y, N), and say what is wrong.
   Verdicts save to `review.json`. Then re-record only the wrong ones
   (the old take is kept in `takes/`, and can be switched back to in the page):

   ```bash
   python scripts/voice/generate.py --redo --dry-run
   python scripts/voice/generate.py --redo
   ```

   Repeat step 5 until every line is Right.

6. **Ship.** There is no manifest to update: Vite builds
   `audio/manifest.json` from the clips on disk at build time and serves it in
   the dev server (and the service worker caches it for offline). Play the
   cartoon (`/?cartoon=lost-kettle`); in development the console says
   `[voice] not recorded` for any line that still falls back to the iPad.
   Commit `public/audio/lines/`, `cast.json`, `config.json`, `qa.json` and
   `review.json`. Do **not** commit `lines.json` or `public/audio/manifest.json`
   (both are in `.gitignore`), and `takes/` is only for you. Clips are one file
   each, and `review.json` is written with sorted keys and one verdict per line,
   so several cartoon PRs merge cleanly.

## The files

| File | What |
|---|---|
| `cast.json` | Each character's voice: `{ "<characterId>": { "voice_id", "name", "owner"?, "settings" } }`. `owner` is only for Voice Library voices (`add-voices.py` uses it). `settings` are ElevenLabs' `stability`, `speed`, `similarity_boost`, `style`. The Faraway voices and the Hogwarts ones that Wizard Words had are carried over from the games. |
| `config.json` | The ElevenLabs `model_id` and `say_as` respellings. |
| `lines.json` | Derived and not committed. Written by `export.ts` (which `generate.py`, `check.py` and the review page run for you): `{ id, text, speaker, where: "<cartoon>/<lineKey>", also?, risky? }`. |
| `export.ts`, `cast-check.ts` | Run with `npx tsx`. They load every cartoon on the shelf. |
| `../../public/audio/manifest.json` | Not a file you edit: built by `vite.config.ts` from `public/audio/lines/*.mp3`. |
| `generate.py`, `check.py`, `pick-voice.py`, `add-voices.py` | Python; the first and the last two need the API key. `castfile.py` is their shared reader of `cast.json`. |
| `review-server.ts`, `../../review.html`, `../../src/review.ts` | The review page (dev server only; it never ships). |
| `takes/`, `qa.json`, `review.json` | Earlier recordings, the automatic checks, your verdicts. |

## Cost

`generate.py` counts the characters it will send before sending anything
(`--dry-run`), and stops if the account does not have enough left.
Re-running only records what is missing; `--force` records again.
