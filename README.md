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
```

Put TypeScript code and tests in `src/`. Vitest discovers `*.test.ts` files.

## Start fresh each round

Commit the starter once before your first round. Keep that commit as `HEAD` while
practicing; do not commit round work to it. Stop watch mode before resetting.

The following commands **discard all tracked and untracked round work in `src/`**,
restoring the committed code. Copy anything you want to keep elsewhere first.
Dependencies and files outside `src/` are left alone.

```sh
git restore --source=HEAD --staged --worktree -- src
git clean -fd -- src
npm test
```
