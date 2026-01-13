import { Difficulty, TileState } from '../types';
import { DIFFICULTY_CONFIGS, POSITION_MULTIPLIERS } from './constants';

/**
 * Roll two dice and return the result.
 * IMPORTANT: This is the ONLY place dice values are generated.
 * The returned values must be used for both display AND tile position.
 */
export function rollDice(): [number, number] {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return [die1, die2];
}

/**
 * Get the multiplier for a specific position based on difficulty
 * Multipliers are calculated based on dice probability odds
 */
export function getMultiplierForPosition(position: number, difficulty: Difficulty): number {
  return POSITION_MULTIPLIERS[difficulty][position] || 0;
}

/**
 * Generate the game board based on difficulty
 * All multipliers are now based on dice odds
 */
export function generateBoard(difficulty: Difficulty): TileState[] {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const board: TileState[] = [];

  // Create all 12 positions (2-12, but mapped to positions 1-12)
  // Position 1 is start, positions 2-12 correspond to dice sums 2-12
  for (let position = 1; position <= 12; position++) {
    if (position === 1) {
      // Position 1 is always the start
      board.push({
        position,
        type: 'start',
        revealed: true,
      });
    } else if (config.snakePositions.includes(position)) {
      // This position has a snake
      board.push({
        position,
        type: 'snake',
        revealed: false,
      });
    } else {
      // This position has a multiplier based on dice odds
      board.push({
        position,
        type: 'multiplier',
        value: getMultiplierForPosition(position, difficulty),
        revealed: false,
      });
    }
  }

  return board;
}

/**
 * Get the tile at a specific position
 */
export function getTileAtPosition(board: TileState[], position: number): TileState | undefined {
  return board.find((tile) => tile.position === position);
}

/**
 * Calculate payout based on bet and multiplier
 */
export function calculatePayout(betAmount: number, multiplier: number): number {
  return Math.round(betAmount * multiplier * 100) / 100;
}

/**
 * Calculate net gain from a win
 */
export function calculateNetGain(betAmount: number, multiplier: number): number {
  const payout = calculatePayout(betAmount, multiplier);
  return Math.round((payout - betAmount) * 100) / 100;
}

/**
 * Generate a random game ID (simulating blockchain transaction)
 */
export function generateGameId(): string {
  const bytes = new Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  }
  return '0x' + bytes.join('');
}

/**
 * Generate a dummy player address
 */
export function generatePlayerAddress(): string {
  const bytes = new Array(20);
  for (let i = 0; i < 20; i++) {
    bytes[i] = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  }
  return '0x' + bytes.join('');
}

/**
 * Format a multiplier value for display
 */
export function formatMultiplier(value: number): string {
  return value.toFixed(2) + 'x';
}

/**
 * Format currency amount for display
 */
export function formatCurrency(amount: number, symbol: string = 'G'): string {
  return `${amount.toFixed(2)} ${symbol}`;
}
