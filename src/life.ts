export type Cell = readonly [x: number, y: number];

export function nextGeneration(liveCells: readonly Cell[]): Cell[] {
	const liveCellKeys = new Set(liveCells.map(cellKey));

	return candidateCells(liveCells).filter((cell) => {
		const isAlive = liveCellKeys.has(cellKey(cell));
		const liveNeighborCount = neighborsOf(cell).filter((neighbor) =>
			liveCellKeys.has(cellKey(neighbor)),
		).length;

		return isAlive
			? liveNeighborCount === 2 || liveNeighborCount === 3
			: liveNeighborCount === 3 || liveNeighborCount === 6;
	});
}

function cellKey([x, y]: Cell): string {
	return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
	const neighbors: Cell[] = [];
	for (let dx = -1; dx <= 1; dx++) {
		for (let dy = -1; dy <= 1; dy++) {
			if (dx === 0 && dy === 0) continue;
			neighbors.push([x + dx, y + dy]);
		}
	}
	return neighbors;
}

function candidateCells(liveCells: readonly Cell[]): Cell[] {
	// Only live cells and their neighbors can be alive in the next generation.
	const candidates = new Map<string, Cell>();
	for (const cell of liveCells) {
		for (const candidate of [cell, ...neighborsOf(cell)]) {
			candidates.set(cellKey(candidate), candidate);
		}
	}
	return [...candidates.values()];
}
