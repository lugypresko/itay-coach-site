export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;
export const DEFAULT_SEED = 1357;
export const DEFAULT_SPEED_MS = 240;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function clampSeed(seed) {
  const normalized = Number.isFinite(seed) ? Math.trunc(seed) : DEFAULT_SEED;
  const value = normalized >>> 0;
  return value === 0 ? DEFAULT_SEED : value;
}

function mulberry32(seed) {
  let state = clampSeed(seed);

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRng(seed = DEFAULT_SEED) {
  const next = mulberry32(seed);

  return {
    seed: clampSeed(seed),
    nextFloat: () => next(),
    nextInt(maxExclusive) {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new Error("nextInt requires a positive integer maxExclusive");
      }

      return Math.floor(next() * maxExclusive);
    },
  };
}

function samePosition(left, right) {
  return left.x === right.x && left.y === right.y;
}

function isInsideBoard(point, width, height) {
  return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
}

function isOppositeDirection(current, next) {
  return OPPOSITES[current] === next;
}

function cloneSnake(snake) {
  return snake.map((segment) => ({ x: segment.x, y: segment.y }));
}

function spawnFood(snake, width, height, rng) {
  const occupied = new Set(snake.map((segment) => `${segment.x}:${segment.y}`));
  const availableCells = width * height - occupied.size;

  if (availableCells <= 0) {
    return null;
  }

  let guard = 0;
  while (guard < width * height * 2) {
    const food = {
      x: rng.nextInt(width),
      y: rng.nextInt(height),
    };

    if (!occupied.has(`${food.x}:${food.y}`)) {
      return food;
    }

    guard += 1;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!occupied.has(`${x}:${y}`)) {
        return { x, y };
      }
    }
  }

  return null;
}

export function createInitialGameState(options = {}) {
  const width = options.width ?? GRID_WIDTH;
  const height = options.height ?? GRID_HEIGHT;
  const seed = clampSeed(options.seed ?? DEFAULT_SEED);
  const center = {
    x: Math.floor(width / 2),
    y: Math.floor(height / 2),
  };
  const snake = [
    { x: center.x, y: center.y },
    { x: center.x - 1, y: center.y },
    { x: center.x - 2, y: center.y },
  ];
  const rng = createRng(seed);

  return {
    seed,
    width,
    height,
    tick: 0,
    score: 0,
    status: "ready",
    reason: null,
    direction: "right",
    pendingDirection: "right",
    snake,
    food: spawnFood(snake, width, height, rng),
    rngState: rng.seed,
  };
}

export function startGame(gameState) {
  return {
    ...gameState,
    status: "running",
    reason: null,
  };
}

export function resetGame(options = {}) {
  return startGame(createInitialGameState(options));
}

export function queueDirection(gameState, nextDirection) {
  if (!DIRECTIONS[nextDirection]) {
    return gameState;
  }

  if (nextDirection === gameState.direction) {
    return { ...gameState, pendingDirection: nextDirection };
  }

  if (isOppositeDirection(gameState.direction, nextDirection)) {
    return gameState;
  }

  return { ...gameState, pendingDirection: nextDirection };
}

function nextPoint(point, direction) {
  const vector = DIRECTIONS[direction];
  return {
    x: point.x + vector.x,
    y: point.y + vector.y,
  };
}

function advanceRngState(seed, tick) {
  return (seed + (tick + 1) * 2654435761) >>> 0;
}

export function stepGame(gameState) {
  if (gameState.status !== "running") {
    return {
      state: gameState,
      event: {
        type: "idle",
        reason: gameState.reason ?? "not_running",
      },
    };
  }

  const direction =
    gameState.pendingDirection && !isOppositeDirection(gameState.direction, gameState.pendingDirection)
      ? gameState.pendingDirection
      : gameState.direction;

  const head = gameState.snake[0];
  const nextHead = nextPoint(head, direction);
  const nextTick = gameState.tick + 1;
  const nextSnake = cloneSnake(gameState.snake);
  nextSnake.unshift(nextHead);

  const ateFood = gameState.food !== null && samePosition(nextHead, gameState.food);

  if (!ateFood) {
    nextSnake.pop();
  }

  const wallCollision = !isInsideBoard(nextHead, gameState.width, gameState.height);
  const selfCollision = nextSnake.slice(1).some((segment) => samePosition(segment, nextHead));

  if (wallCollision || selfCollision) {
    const reason = wallCollision ? "wall_collision" : "self_collision";
    return {
      state: {
        ...gameState,
        tick: nextTick,
        direction,
        pendingDirection: direction,
        snake: nextSnake,
        status: "game_over",
        reason,
        rngState: advanceRngState(gameState.rngState, nextTick),
      },
      event: {
        type: "game_over",
        reason,
        head: nextHead,
        direction,
      },
    };
  }

  const rng = createRng(advanceRngState(gameState.rngState, nextTick));
  const nextFood = ateFood ? spawnFood(nextSnake, gameState.width, gameState.height, rng) : gameState.food;

  return {
    state: {
      ...gameState,
      tick: nextTick,
      score: ateFood ? gameState.score + 1 : gameState.score,
      direction,
      pendingDirection: direction,
      snake: nextSnake,
      food: nextFood,
      rngState: rng.seed,
    },
    event: {
      type: ateFood ? "eat_food" : "advance",
      head: nextHead,
      direction,
      ateFood,
    },
  };
}

export function buildGameSnapshot(gameState) {
  const head = gameState.snake[0] ?? null;
  const tail = gameState.snake.at(-1) ?? null;

  return {
    tick: gameState.tick,
    score: gameState.score,
    status: gameState.status,
    reason: gameState.reason,
    direction: gameState.direction,
    pendingDirection: gameState.pendingDirection,
    length: gameState.snake.length,
    head,
    tail,
    food: gameState.food,
    seed: gameState.seed,
  };
}

export function buildQAReport(gameState) {
  const snakeCells = new Set();
  for (const segment of gameState.snake) {
    const key = `${segment.x}:${segment.y}`;
    if (snakeCells.has(key)) {
      return {
        ok: false,
        summary: "Snake segments overlap",
        severity: "error",
      };
    }
    snakeCells.add(key);
  }

  if (gameState.snake.length === 0) {
    return {
      ok: false,
      summary: "Snake is missing all segments",
      severity: "error",
    };
  }

  return {
    ok: true,
    summary: gameState.status === "game_over" ? "Game ended cleanly" : "Game state is healthy",
    severity: "info",
  };
}
