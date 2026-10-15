---
name: voice-cartoon
description: Record a cartoon's lines with ElevenLabs (per-character voices from the cast file), check them with Whisper, and set them up for a grown-up to review. Use when asked to voice, record or re-record a cartoon, or to cast a new character's voice.
---

# Voice a cartoon

Until its lines are recorded, a cartoon plays with the iPad's own
British voice, so recording is a separate, later step. It needs the
person's ElevenLabs API key and costs credits, so **check with them
before generating**. The full detail is in `scripts/voice/README.md`.

## 1. Cast

```bash
npx tsx scripts/voice/cast-check.ts
```

Lists every speaker in any cartoon (and any world character) without a
voice in `scripts/voice/cast.json`, with their `voice` note. For each:

- Search the ElevenLabs library with `scripts/voice/pick-voice.py` (see
  the README) using the `voice` note, offer the person two or three
  candidates with sample lines, and let them choose. Never invent a
  voice id.
- Add the choice to `cast.json`. A character keeps the same voice in
  every cartoon, for good.

## 2. Export and generate

```bash
npm run voice:export                     # every line of every cartoon → scripts/voice/lines.json
python3 scripts/voice/generate.py --cartoon <id>   # needs ELEVENLABS_API_KEY
```

Lines with `{name}` are recorded with the default name (Jasper) and
also without a name, so another child's name falls back to the generic
recording.

## 3. Check

```bash
python3 scripts/voice/check.py --cartoon <id>      # Whisper: does each clip say its line?
```

Re-generate what fails (see the README for re-spelling hard words).

## 4. Review

`npm run dev`, then `/review.html`: the person listens to each clip and
marks wrong ones; `generate.py --redo` re-records only those.

## 5. Ship

The clips go in `public/audio/lines/` with `public/audio/manifest.json`
updated by the scripts. Commit them with the cartoon (they are what the
iPad plays), run `npm test` and e2e, and push. Never commit the API key.
