# Cartoons

Paper-puppet cartoons for one boy's iPad, in the torn-paper style of his
two games, [Wizard Words](https://github.com/charlie-beard/spelling-game)
and [Up the Faraway Tree](https://github.com/charlie-beard/maths-game).
Episodes are 2–5 minutes with a few scenes, set in the Faraway Tree or at
Hogwarts. They just play, like TV: nothing to tap.

Every cartoon is written by Claude Code from the skills in this repo:
say `/new-cartoon <a one-line idea>` in a Claude Code session.

> Non-commercial fan project. All artwork is original: no film images, no
> official logos, no film typeface, no likenesses of the actors.

```bash
npm install
npm run dev        # http://localhost:5173  (?cartoon=<id>&scene=<n>)  /lab.html for the art
npm run typecheck
npm test
npm run test:e2e
```

See [CLAUDE.md](CLAUDE.md) and [docs/](docs/).
