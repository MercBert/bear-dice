export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master';
export type GameMode = 'manual' | 'auto';
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';
export type TileType = 'start' | 'multiplier' | 'snake';

export interface TileState {
  position: number; // 1-12
  type: TileType;
  value?: number; // Multiplier value if type is 'multiplier'
  revealed: boolean;
}

export interface AutoSettings {
  rollsPerGame: number; // 1-5
  numberOfGames: number; // 0 = infinite
  gamesPlayed: number;
  isRunning: boolean;
}

export interface TestModeSettings {
  enabled: boolean;
  die1Value: number; // 1-6
  die2Value: number; // 1-6
}

export interface GameState {
  // Configuration
  betAmount: number;
  difficulty: Difficulty;
  mode: GameMode;
  balance: number;

  // Auto mode settings
  autoSettings: AutoSettings;

  // Test mode settings
  testModeSettings: TestModeSettings;

  // Game state
  gameStatus: GameStatus;
  currentRoll: number; // 0-5
  currentMultiplier: number; // Accumulated multiplier
  totalNetGain: number;

  // Board
  board: TileState[];

  // Animation
  diceValues: [number, number];
  highlightedPosition: number | null;
  isRolling: boolean;
}

export interface RollResult {
  rollNumber: number;
  diceResult: number;
  position: number;
  result: 'multiplier' | 'snake';
  value?: number;
}

export interface GameResult {
  gameId: string;
  playerAddress: string;
  betAmount: number;
  difficulty: string;
  outcome: 'win' | 'lose';
  finalMultiplier: number;
  payout: number;
  rolls: RollResult[];
  timestamp: number;
}

export interface DifficultyConfig {
  snakePositions: number[];
  minMultiplier: number;
  maxMultiplier: number;
}
