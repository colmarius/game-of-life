import { nextGeneration, type Cell } from "./life.js";

const presets: { name: string; detail: string; cells: Cell[] }[] = [
  {
    name: "Replicator",
    detail: "The HighLife signature",
    cells: [
      [0, -2],
      [1, -2],
      [2, -2],
      [-1, -1],
      [2, -1],
      [-2, 0],
      [2, 0],
      [-2, 1],
      [1, 1],
      [-2, 2],
      [-1, 2],
      [0, 2],
    ],
  },
  {
    name: "Glider",
    detail: "A tiny traveler",
    cells: [
      [0, -1],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ],
  },
  {
    name: "Blinker",
    detail: "A two-beat rhythm",
    cells: [
      [-1, 0],
      [0, 0],
      [1, 0],
    ],
  },
  {
    name: "Block",
    detail: "Perfectly still",
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  },
];

function element<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

const canvas = element<HTMLCanvasElement>("universe");
const context = canvas.getContext("2d")!;
const state = {
  cells: [...presets[0].cells],
  seed: [...presets[0].cells],
  name: "Replicator",
  generation: 0,
  births: 0,
  deaths: 0,
  history: [12],
  running: false,
  speed: 6,
  scale: 20,
  centerX: 0,
  centerY: 0,
  cursor: [0, 0] as Cell,
};
let timer: ReturnType<typeof setTimeout> | undefined;
let width = 0;
let height = 0;

function key([x, y]: Cell): string {
  return `${x},${y}`;
}

function draw() {
  context.clearRect(0, 0, width, height);
  const left = width / 2 - state.centerX * state.scale;
  const top = height / 2 - state.centerY * state.scale;
  context.strokeStyle = "#263323";
  context.lineWidth = 0.5;
  context.beginPath();
  for (
    let x = ((left % state.scale) + state.scale) % state.scale;
    x < width;
    x += state.scale
  ) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }
  for (
    let y = ((top % state.scale) + state.scale) % state.scale;
    y < height;
    y += state.scale
  ) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  context.stroke();
  context.fillStyle = "#cbe890";
  for (const [x, y] of state.cells) {
    const px = left + x * state.scale;
    const py = top + y * state.scale;
    if (
      px + state.scale < 0 ||
      px > width ||
      py + state.scale < 0 ||
      py > height
    )
      continue;
    const gap = state.scale > 8 ? 2 : 0.5;
    context.fillRect(
      px + gap,
      py + gap,
      state.scale - 2 * gap,
      state.scale - 2 * gap,
    );
  }
  if (document.activeElement === canvas) {
    context.strokeStyle = "#f5f7ee";
    context.lineWidth = 1.5;
    context.strokeRect(
      left + state.cursor[0] * state.scale + 0.5,
      top + state.cursor[1] * state.scale + 0.5,
      state.scale - 1,
      state.scale - 1,
    );
  }
  element("cursor-readout").textContent =
    `x ${state.cursor[0]} / y ${state.cursor[1]}`;
  element("zoom-level").textContent =
    `${Math.round((state.scale / 20) * 100)}%`;
}

function render() {
  element("pattern-title").textContent = state.name;
  element("state-label").textContent = state.running ? "Running" : "Paused";
  element("play").textContent = state.running ? "Ⅱ Pause" : "▶ Run";
  element<HTMLButtonElement>("step").disabled = state.running;
  element("generation").textContent = String(state.generation).padStart(4, "0");
  element("population").textContent = state.cells.length.toLocaleString();
  element("births").textContent = `+${state.births}`;
  element("deaths").textContent = `−${state.deaths}`;
  const delta = state.births - state.deaths;
  element("change").textContent =
    state.generation === 0
      ? "Ready to evolve"
      : `${delta > 0 ? "+" : ""}${delta} since last tick`;
  document
    .querySelectorAll<HTMLButtonElement>(".preset")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.name === state.name),
      ),
    );
  const max = Math.max(1, ...state.history);
  const points = state.history.map(
    (value, i) =>
      `${(i / Math.max(1, state.history.length - 1)) * 320},${60 - (value / max) * 52}`,
  );
  if (points.length === 1)
    points.push(`320,${60 - (state.history[0] / max) * 52}`);
  document
    .getElementById("history-line")!
    .setAttribute("d", `M${points.join(" L")}`);
  document
    .getElementById("history-area")!
    .setAttribute("d", `M0,65 L${points.join(" L")} L320,65 Z`);
  document
    .getElementById("history")!
    .setAttribute(
      "aria-label",
      `Population history: ${state.history.join(", ")}`,
    );
  draw();
}

function setRunning(running: boolean) {
  clearTimeout(timer);
  state.running = running;
  if (running) timer = setTimeout(tick, 1000 / state.speed);
  render();
}

function advance() {
  const previous = new Set(state.cells.map(key));
  state.cells = nextGeneration(state.cells);
  state.births = state.cells.filter((cell) => !previous.has(key(cell))).length;
  state.deaths = previous.size + state.births - state.cells.length;
  state.generation++;
  state.history = [...state.history.slice(-119), state.cells.length];
  if (state.cells.length === 0) {
    setRunning(false);
    element("announcement").textContent =
      "The universe is empty. Playback paused.";
  }
  render();
}

function tick() {
  advance();
  if (state.running) timer = setTimeout(tick, 1000 / state.speed);
}

function load(cells: readonly Cell[], name: string) {
  setRunning(false);
  state.cells = [...cells];
  state.seed = [...cells];
  state.name = name;
  state.generation = 0;
  state.births = 0;
  state.deaths = 0;
  state.history = [cells.length];
  state.cursor = [0, 0];
  fit();
  element("announcement").textContent =
    `${name} loaded with ${cells.length} live cells.`;
  render();
}

function fit() {
  let minX = 0,
    maxX = 0,
    minY = 0,
    maxY = 0;
  if (state.cells.length) {
    minX = maxX = state.cells[0][0];
    minY = maxY = state.cells[0][1];
    for (const [x, y] of state.cells) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  state.centerX = (minX + maxX + 1) / 2;
  state.centerY = (minY + maxY + 1) / 2;
  state.scale = Math.max(
    2,
    Math.min(20, width / (maxX - minX + 9), height / (maxY - minY + 9)),
  );
  draw();
}

function zoom(factor: number) {
  state.scale = Math.max(2, Math.min(48, state.scale * factor));
  draw();
}

function cellAt(event: PointerEvent): Cell {
  const rect = canvas.getBoundingClientRect();
  return [
    Math.floor(
      (event.clientX - rect.left - width / 2) / state.scale + state.centerX,
    ),
    Math.floor(
      (event.clientY - rect.top - height / 2) / state.scale + state.centerY,
    ),
  ];
}

function edit(cell: Cell, alive: boolean) {
  const remaining = state.cells.filter((other) => key(other) !== key(cell));
  if (alive) remaining.push(cell);
  state.cells = remaining;
  state.seed = [...remaining];
  state.name = "Your creation";
  state.generation = 0;
  state.births = 0;
  state.deaths = 0;
  state.history = [remaining.length];
  render();
}

let drag:
  | { x: number; y: number; pan: boolean; alive: boolean; last: string }
  | undefined;
canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  canvas.focus();
  setRunning(false);
  state.cursor = cellAt(event);
  const alive = !state.cells.some((cell) => key(cell) === key(state.cursor));
  drag = {
    x: event.clientX,
    y: event.clientY,
    pan: event.shiftKey,
    alive,
    last: key(state.cursor),
  };
  canvas.setPointerCapture(event.pointerId);
  if (!drag.pan) edit(state.cursor, alive);
});
canvas.addEventListener("pointermove", (event) => {
  state.cursor = cellAt(event);
  if (drag?.pan) {
    state.centerX -= (event.clientX - drag.x) / state.scale;
    state.centerY -= (event.clientY - drag.y) / state.scale;
    drag.x = event.clientX;
    drag.y = event.clientY;
  } else if (drag && drag.last !== key(state.cursor)) {
    edit(state.cursor, drag.alive);
    drag.last = key(state.cursor);
  }
  draw();
});
canvas.addEventListener("pointerup", () => {
  drag = undefined;
});
canvas.addEventListener("pointercancel", () => {
  drag = undefined;
});
canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    zoom(event.deltaY < 0 ? 1.15 : 1 / 1.15);
  },
  { passive: false },
);
canvas.addEventListener("focus", draw);
canvas.addEventListener("blur", draw);
canvas.addEventListener("keydown", (event) => {
  const directions: Record<string, Cell> = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
  };
  if (directions[event.key]) {
    event.preventDefault();
    const [dx, dy] = directions[event.key];
    state.cursor = [state.cursor[0] + dx, state.cursor[1] + dy];
    if (Math.abs(state.cursor[0] - state.centerX) > width / state.scale / 2 - 2)
      state.centerX = state.cursor[0];
    if (
      Math.abs(state.cursor[1] - state.centerY) >
      height / state.scale / 2 - 2
    )
      state.centerY = state.cursor[1];
    draw();
  } else if (event.key === "Enter") {
    event.preventDefault();
    setRunning(false);
    edit(
      state.cursor,
      !state.cells.some((cell) => key(cell) === key(state.cursor)),
    );
    element("announcement").textContent =
      `Cell ${key(state.cursor)} toggled. ${state.cells.length} living cells.`;
  } else if (event.key === " ") {
    event.preventDefault();
    setRunning(!state.running);
  } else if (event.key === "+" || event.key === "=") zoom(1.25);
  else if (event.key === "-") zoom(0.8);
});

element("presets").innerHTML = presets
  .map(
    (preset) =>
      `<button class="preset" data-name="${preset.name}" aria-pressed="false"><svg viewBox="-3 -3 7 7" aria-hidden="true">${preset.cells.map(([x, y]) => `<rect x="${x}" y="${y}" width=".8" height=".8"/>`).join("")}</svg><div><strong>${preset.name}</strong><small>${preset.detail}</small></div><span class="arrow">↗</span></button>`,
  )
  .join("");
document
  .querySelectorAll<HTMLButtonElement>(".preset")
  .forEach((button, index) =>
    button.addEventListener("click", () =>
      load(presets[index].cells, presets[index].name),
    ),
  );
element("play").addEventListener("click", () => setRunning(!state.running));
element("step").addEventListener("click", advance);
element("reset").addEventListener("click", () => load(state.seed, state.name));
element("clear").addEventListener("click", () => load([], "Your creation"));
element("random").addEventListener("click", () => {
  const cells: Cell[] = [];
  for (let x = -14; x <= 14; x++)
    for (let y = -9; y <= 9; y++) if (Math.random() < 0.25) cells.push([x, y]);
  load(cells, "Random field");
});
element<HTMLInputElement>("speed").addEventListener("input", (event) => {
  state.speed = Number((event.target as HTMLInputElement).value);
  element("speed-value").textContent = `${state.speed} / s`;
  if (state.running) setRunning(true);
});
element("zoom-in").addEventListener("click", () => zoom(1.25));
element("zoom-out").addEventListener("click", () => zoom(0.8));
element("fit").addEventListener("click", fit);
new ResizeObserver(() => {
  const rect = canvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  draw();
}).observe(canvas);
render();
