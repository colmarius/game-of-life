# Scope

Keep this repository a small TypeScript HighLife (B36/S23) engine and interactive
canvas observatory using npm, Vite, Vitest, and the committed lockfile.
Do not add a UI framework, persistence, a generic rules engine, coverage tooling,
a lint stack, or release automation unless explicitly requested.

- `src/life.ts` owns the sparse, unbounded simulation. Keep it independent of
  the DOM and preserve the public contract and rules in `SPEC.md`.
- `src/main.ts` owns browser state, playback, editing, and canvas rendering;
  `index.html` and `src/style.css` own the page structure and appearance.
- Code and tests belong in `src/`. Test engine behavior through `nextGeneration`,
  not private helpers. Follow the TDD process in `SPEC.md` for engine changes.
- `SPEC.md` is the original engine-only brief; its no-UI restriction describes
  that session, not the current repository. Keep `README.md` current for users.

# Verification

- Use the Node.js version pinned in `.nvmrc` and `package.json`.
- `npm ci` installs the locked dependencies.
- `npm run test:run` runs tests once; `npm test` starts watch mode.
- `npm run typecheck` checks all TypeScript code and tests in strict mode.
- `npm run build` runs typechecking and builds the browser app into `dist/`.
- For browser changes, exercise affected controls with `npm run dev` or a built
  preview (`npm run build` then `npm run preview`). Check pointer and keyboard
  interaction; for visual changes, inspect desktop and narrow-screen renders.
  Vitest currently covers the engine and a smoke test, not browser interactions.
- When changing the test setup, temporarily break a smoke-test expectation,
  confirm the test command exits nonzero, restore it, and rerun verification.
