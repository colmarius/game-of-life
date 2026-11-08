# HighLife observatory

A TypeScript cellular automaton with an interactive canvas UI. HighLife uses
Conway's survival rules (2 or 3 neighbors), with births at 3 **or 6** neighbors.

## Explore the universe

Run `npm ci`, then `npm run dev`. Vite prints the development server address.
Use `npm run build` for a production build and `npm run preview` to serve it locally.

- Choose a replicator, glider, blinker, or block, or generate a random field.
- Run/pause, step one generation, adjust speed, or reset the seed.
- Click or drag to add/remove cells; edits pause playback and become the new seed.
- Shift-drag to pan, scroll or use +/− to zoom, and use Fit to recenter.
- Keyboard: focus the grid, use arrows to move, Enter to toggle a cell, and Space
  to run/pause. The grid automatically follows the keyboard cursor.
- The viewport is finite, but the simulation is not: off-screen cells still evolve.
  Statistics count all cells, not only visible ones. Empty universes pause automatically.

The engine in `src/life.ts` is independent of the UI. Patterns are held in memory;
reloading the page starts fresh. `SPEC.md` records the original engine brief;
the visualization was added separately.

## Prerequisites

- Node.js 24.22.2 (pinned in `.nvmrc`). With nvm, run `nvm install` and `nvm use`.
- npm (included with Node.js).

## Install and verify

```sh
npm ci
npm test          # watch mode; press q to quit
npm run test:run  # run once
npm run typecheck
npm run build    # typecheck and build the browser app into dist/
```

Put TypeScript code and tests in `src/`. Vitest discovers `*.test.ts` files.
The current tests cover the engine and test-runner smoke test, not browser
interactions. When changing the UI, also check the affected controls in a browser,
including keyboard input and desktop/narrow-screen layouts.

## Deploy to GitHub Pages

In the repository's **Settings → Pages → Build and deployment**, set **Source**
to **GitHub Actions** before the first deployment.

`.github/workflows/deploy.yml` tests, typechecks, builds, and deploys on pushes to
`main`. It can also be run manually from the Actions tab on `main`. A failed test
or build prevents deployment. The workflow uses the Node.js version in `.nvmrc`
and the committed npm lockfile, and publishes `dist/` through the `github-pages`
environment rather than a separate branch.

The build uses the base path reported by GitHub Pages, so assets and the home link
work under the repository path. The expected URL for this repository is
<https://marius-colacioiu.com/game-of-life/> once deployment succeeds.

To check the project-path build locally:

```sh
npm run build -- --base /game-of-life/
npm run preview -- --base /game-of-life/
```

Open `/game-of-life/` on the preview server's printed address.

## Reset local exercise work

This checkout already contains the HighLife implementation and UI. Resetting to
`HEAD` restores that implementation, not an empty starter. For a blank exercise,
start a separate branch or worktree from the starter commit `4662296`.
Stop watch mode before resetting.

The following commands **discard tracked changes and non-ignored untracked files
in `src/`**, restoring the committed code. Copy anything you want to keep elsewhere
first. Dependencies and files outside `src/` (including `index.html`) are left alone.

```sh copy Copy Reset Commands
git restore --source=HEAD --staged --worktree -- src
git clean -fd -- src
npm test
```
