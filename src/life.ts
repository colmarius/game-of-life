export type Cell = readonly [x: number, y: number];

export function nextGeneration(liveCells: readonly Cell[]): Cell[] {
  const live = new Set(liveCells.map(([x, y]) => `${x},${y}`));
  const candidates = new Map<string, Cell>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        candidates.set(`${x + dx},${y + dy}`, [x + dx, y + dy]);
      }
    }
  }

  return [...candidates.values()].filter(([x, y]) => {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        if (live.has(`${x + dx},${y + dy}`)) count++;
      }
    }
    return live.has(`${x},${y}`)
      ? count === 2 || count === 3
      : count === 3 || count === 6;
  });
}
