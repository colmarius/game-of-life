import { expect, test } from 'vitest';
import { nextGeneration, type Cell } from './life.js';

test('empty input returns a new empty array', () => {
  const input: Cell[] = [];
  const result = nextGeneration(input);
  expect(result).toEqual([]);
  expect(result).not.toBe(input);
});

test('an isolated cell dies', () => {
  expect(nextGeneration([[0, 0]])).toEqual([]);
});

const neighbors: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

test.each([
  [0, false], [1, false], [2, true], [3, true], [4, false],
  [5, false], [6, false], [7, false], [8, false],
] as const)('live target with %i neighbors has next state %s', (count, alive) => {
  const result = nextGeneration([[0, 0], ...neighbors.slice(0, count)]);
  expect(result.some(([x, y]) => x === 0 && y === 0)).toBe(alive);
});

test.each([
  [0, false], [1, false], [2, false], [3, true], [4, false],
  [5, false], [6, true], [7, false], [8, false],
] as const)('dead target with %i neighbors has next state %s', (count, alive) => {
  const result = nextGeneration(neighbors.slice(0, count));
  expect(result.some(([x, y]) => x === 0 && y === 0)).toBe(alive);
});

function sorted(cells: readonly Cell[]): Cell[] {
  return [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}

test('a stable block stays unchanged in a new array', () => {
  const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
  const result = nextGeneration(block);
  expect(sorted(result)).toEqual(sorted(block));
  expect(result).not.toBe(block);
});

test('a blinker oscillates simultaneously across the occupied bounds', () => {
  const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
  const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
  const first = nextGeneration(horizontal);
  expect(sorted(first)).toEqual(sorted(vertical));
  expect(sorted(nextGeneration(first))).toEqual(sorted(horizontal));
});

test('duplicate coordinates and input order do not change or duplicate output', () => {
  const input: Cell[] = [[1, 0], [-1, 0], [0, 0], [-1, 0], [1, 0], [0, 0]];
  const expected: Cell[] = [[0, -1], [0, 0], [0, 1]];
  expect(sorted(nextGeneration(input))).toEqual(sorted(expected));
  expect(sorted(nextGeneration([...input].reverse()))).toEqual(sorted(expected));
});

test('a step leaves the input array and coordinate pairs unchanged', () => {
  const input: readonly Cell[] = Object.freeze([
    Object.freeze([5, -3] as const),
    Object.freeze([3, -3] as const),
    Object.freeze([4, -3] as const),
  ]);
  const result = nextGeneration(input);
  expect(sorted(result)).toEqual([[4, -4], [4, -3], [4, -2]]);
  expect(input).toEqual([[5, -3], [3, -3], [4, -3]]);
});
