# Game of Life implementation spec

## Goal and scope

Implement and test a minimal TypeScript Game of Life engine in this repository.
Use Conway's standard survival rules, with an additional birth at six live
neighbors. This variant is known as HighLife (B36/S23).

This document is the complete brief for a single implementation session. Do not
depend on screenshots or earlier conversations. Follow repository guidance, use
the existing npm lockfile, TypeScript, and Vitest setup, and put code and tests in
`src/`. Do not add dependencies, a UI, CLI, persistence, a generic rules engine,
or unrelated tooling. Prefer simple functions over classes or abstractions.

## Rules

- The universe is an infinite two-dimensional grid of cells, each alive or dead.
- Coordinates are integer `(x, y)` pairs; negative coordinates are valid.
- Each cell has eight neighbors: horizontally, vertically, and diagonally
  adjacent cells. Never count the cell itself. Count only live neighbors.
- All cells update simultaneously from the previous generation, not from
  partially updated results.

| Current state | Live neighbors | Next state |
| --- | --- | --- |
| Alive | 2 or 3 | Alive |
| Alive | 0, 1, 4, 5, 6, 7, or 8 | Dead |
| Dead | 3 or 6 | Alive |
| Dead | 0, 1, 2, 4, 5, 7, or 8 | Dead |

In particular, a dead cell with six live neighbors is born, but a live cell with
six live neighbors dies. There is no wrapping, clipping, or fixed board boundary.

## Public contract

Export the following from `src/life.ts`:

```ts
export type Cell = readonly [x: number, y: number];
export function nextGeneration(liveCells: readonly Cell[]): Cell[];
```

- Input contains the finite collection of currently live cells; all other cells
  are dead. Assume valid integer coordinates; input validation is out of scope.
- Treat duplicate coordinates as one live cell.
- Return all and only the next generation's live cells, with no duplicates.
  Output order is unspecified; in tests, compare copies of actual and expected
  coordinate arrays sorted by x, then y, so duplicates remain visible.
- Do not mutate the input array or its coordinate pairs. Return a new array.
- Empty input returns an empty array. Calling the function repeatedly advances
  successive generations; no simulation controller is needed.

Keep the representation sparse: consider existing live cells and their neighbors,
not every coordinate between distant cells. Choose the simplest internal lookup
that compares coordinates by value. No performance benchmark is required.

## Acceptance tests

Test observable behavior through `nextGeneration`, not internal helpers.

1. Check the target cell's next state for every neighbor count from 0 through 8,
   for both an initially live and an initially dead target. Use the rule table
   above as explicit expectations, not logic copied from the implementation.
   Include diagonal neighbors and distinguish birth at six from survival at six.
   Each fixture contains only the target (if initially alive) and exactly N
   distinct neighbors. Assert only whether the target appears in the output;
   other cells also evolve.
2. Verify empty input and a single isolated cell both produce an empty generation.
3. Verify these complete patterns, where each list contains all live coordinates:
   - Stable block: `[(0,0), (1,0), (0,1), (1,1)]` stays unchanged.
   - Blinker: `[(-1,0), (0,0), (1,0)]` becomes
     `[(0,-1), (0,0), (0,1)]`, then returns to its starting state.
     This also checks births outside the initial occupied bounds and simultaneous
     updates.
4. Verify coordinate-value semantics: repeated coordinates do not change the
   result, output has no duplicates, and reordering input does not change the
   resulting set of cells.
5. Verify input is unchanged after a step, including the coordinate pairs.
   For empty input and an unchanged stable block, also verify the returned array
   is not the input array.

Use small, readable fixtures and table-driven tests where useful. Assert complete
output arrays after sorting copies for pattern tests so unexpected extra cells
and duplicates cannot pass unnoticed.
Do not expose additional production APIs solely for testing.

## Development process and completion

Use actual TDD in small increments:

1. Write a test for the next behavior.
2. Run it and observe the expected failure (red). Once the public API exists,
   failures should demonstrate missing behavior rather than broken imports.
3. Write the minimum correct implementation that passes (green).
4. Refactor only while green, then rerun the tests.
5. Repeat until the contract and acceptance cases are covered.

Do not write the entire implementation before its tests. Do not hard-code fixture
answers. Keep the existing smoke test unless it genuinely needs changing.

Finish by running `npm run test:run` and `npm run typecheck`. Report their actual
results and briefly summarize observed red/green cycles and any limitations.
The deliverable is working code and tests, not merely a plan. Do not commit,
push, or deploy unless separately requested.
