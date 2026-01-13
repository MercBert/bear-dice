import { Difficulty, DifficultyConfig } from '../types';

// Difficulty configurations
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    snakePositions: [7],
    minMultiplier: 1.08,
    maxMultiplier: 1.96,
  },
  medium: {
    snakePositions: [6, 7, 8],
    minMultiplier: 1.15,
    maxMultiplier: 3.92,
  },
  hard: {
    snakePositions: [5, 6, 7, 8, 9],
    minMultiplier: 1.50,
    maxMultiplier: 7.35,
  },
  expert: {
    snakePositions: [4, 5, 6, 7, 8, 9, 10],
    minMultiplier: 4.00,
    maxMultiplier: 9.80,
  },
  master: {
    snakePositions: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    minMultiplier: 17.84, // Only positions 2 and 12, both get max multiplier
    maxMultiplier: 17.84,
  },
};

// Dice probability for each sum (2-12)
// Total combinations = 36
export const DICE_PROBABILITY: Record<number, { ways: number; probability: number }> = {
  2: { ways: 1, probability: 1 / 36 },   // Rarest
  3: { ways: 2, probability: 2 / 36 },
  4: { ways: 3, probability: 3 / 36 },
  5: { ways: 4, probability: 4 / 36 },
  6: { ways: 5, probability: 5 / 36 },
  7: { ways: 6, probability: 6 / 36 },   // Most common
  8: { ways: 5, probability: 5 / 36 },
  9: { ways: 4, probability: 4 / 36 },
  10: { ways: 3, probability: 3 / 36 },
  11: { ways: 2, probability: 2 / 36 },
  12: { ways: 1, probability: 1 / 36 },  // Rarest
};

// Calculate multiplier for a position based on difficulty and dice probability
// Rarer positions get higher multipliers within the difficulty's range
export const getPositionMultiplier = (position: number, difficulty: Difficulty): number => {
  const config = DIFFICULTY_CONFIGS[difficulty];

  // If position is a snake, return 0
  if (config.snakePositions.includes(position)) {
    return 0;
  }

  // Position 1 is start, no multiplier
  if (position === 1) {
    return 0;
  }

  const diceInfo = DICE_PROBABILITY[position];
  if (!diceInfo) return config.minMultiplier;

  // Get all safe positions for this difficulty
  const safePositions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(
    (p) => !config.snakePositions.includes(p)
  );

  // Calculate inverse probability weight (rarer = higher weight)
  const inverseWeight = 1 / diceInfo.probability;

  // Get min and max inverse weights for safe positions
  const safeWeights = safePositions.map((p) => 1 / DICE_PROBABILITY[p].probability);
  const minWeight = Math.min(...safeWeights);
  const maxWeight = Math.max(...safeWeights);

  // Normalize the weight to 0-1 range
  let normalized = 0;
  if (maxWeight !== minWeight) {
    normalized = (inverseWeight - minWeight) / (maxWeight - minWeight);
  }

  // Map to multiplier range
  const multiplier = config.minMultiplier + normalized * (config.maxMultiplier - config.minMultiplier);

  return Math.round(multiplier * 100) / 100;
};

// Pre-calculated multipliers for each position by difficulty
export const POSITION_MULTIPLIERS: Record<Difficulty, Record<number, number>> = {
  easy: {
    2: getPositionMultiplier(2, 'easy'),
    3: getPositionMultiplier(3, 'easy'),
    4: getPositionMultiplier(4, 'easy'),
    5: getPositionMultiplier(5, 'easy'),
    6: getPositionMultiplier(6, 'easy'),
    7: 0, // Snake
    8: getPositionMultiplier(8, 'easy'),
    9: getPositionMultiplier(9, 'easy'),
    10: getPositionMultiplier(10, 'easy'),
    11: getPositionMultiplier(11, 'easy'),
    12: getPositionMultiplier(12, 'easy'),
  },
  medium: {
    2: getPositionMultiplier(2, 'medium'),
    3: getPositionMultiplier(3, 'medium'),
    4: getPositionMultiplier(4, 'medium'),
    5: getPositionMultiplier(5, 'medium'),
    6: 0, // Snake
    7: 0, // Snake
    8: 0, // Snake
    9: getPositionMultiplier(9, 'medium'),
    10: getPositionMultiplier(10, 'medium'),
    11: getPositionMultiplier(11, 'medium'),
    12: getPositionMultiplier(12, 'medium'),
  },
  hard: {
    2: getPositionMultiplier(2, 'hard'),
    3: getPositionMultiplier(3, 'hard'),
    4: getPositionMultiplier(4, 'hard'),
    5: 0, // Snake
    6: 0, // Snake
    7: 0, // Snake
    8: 0, // Snake
    9: 0, // Snake
    10: getPositionMultiplier(10, 'hard'),
    11: getPositionMultiplier(11, 'hard'),
    12: getPositionMultiplier(12, 'hard'),
  },
  expert: {
    2: getPositionMultiplier(2, 'expert'),
    3: getPositionMultiplier(3, 'expert'),
    4: 0, // Snake
    5: 0, // Snake
    6: 0, // Snake
    7: 0, // Snake
    8: 0, // Snake
    9: 0, // Snake
    10: 0, // Snake
    11: getPositionMultiplier(11, 'expert'),
    12: getPositionMultiplier(12, 'expert'),
  },
  master: {
    2: getPositionMultiplier(2, 'master'),
    3: 0, // Snake
    4: 0, // Snake
    5: 0, // Snake
    6: 0, // Snake
    7: 0, // Snake
    8: 0, // Snake
    9: 0, // Snake
    10: 0, // Snake
    11: 0, // Snake
    12: getPositionMultiplier(12, 'master'),
  },
};

// Color palette
export const COLORS = {
  background: '#0f212e',
  tile: '#1a2c38',
  tileHighlighted: '#00d4ff',
  winText: '#00ff00',
  lossRed: '#ff4444',
  primaryCta: '#00e701',
  secondaryButton: '#2a3a47',
  textPrimary: '#ffffff',
  textMuted: '#7b8a96',
  trophyIcon: '#4a5c6a',
};

// Game constants
export const INITIAL_BALANCE = 1000.0;
export const CURRENCY_SYMBOL = 'G';
export const MAX_ROLLS = 5;
export const MIN_BET = 0.01;
export const MAX_BET = 100;

// Animation timings (ms)
export const DICE_ROLL_DURATION = 2000; // Exactly 2 seconds of smooth spinning
export const DICE_CYCLE_INTERVAL = 50;
export const WIN_DISPLAY_DURATION = 2000;
export const LOSE_DISPLAY_DURATION = 1500;
export const AUTO_ROLL_DELAY = 1000;
export const STEP_DURATION = 400; // Time per tile in stepping animation

// Difficulty display names
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
  master: 'Master',
};
