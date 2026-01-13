'use client';

import Tile from './Tile';
import DiceDisplay from './DiceDisplay';
import RollIndicator from './RollIndicator';
import { TileState, GameStatus, Difficulty } from '../types';

interface GameBoardProps {
  board: TileState[];
  diceValues: [number, number];
  isRolling: boolean;
  multiplier: number;
  gameStatus: GameStatus;
  highlightedPosition: number | null;
  currentRoll: number;
  betAmount: number;
  difficulty: Difficulty;
}

// Position to grid coordinates mapping (1-indexed for CSS grid)
const POSITION_TO_GRID: Record<number, { col: number; row: number }> = {
  1: { col: 1, row: 1 },
  2: { col: 2, row: 1 },
  3: { col: 3, row: 1 },
  4: { col: 4, row: 1 },
  5: { col: 4, row: 2 },
  6: { col: 4, row: 3 },
  7: { col: 4, row: 4 },
  8: { col: 3, row: 4 },
  9: { col: 2, row: 4 },
  10: { col: 1, row: 4 },
  11: { col: 1, row: 3 },
  12: { col: 1, row: 2 },
};

const TILE_POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function GameBoard({
  board,
  diceValues,
  isRolling,
  multiplier,
  gameStatus,
  highlightedPosition,
  currentRoll,
  betAmount,
  difficulty,
}: GameBoardProps) {
  const getTileAtPosition = (position: number): TileState | null => {
    return board.find((t) => t.position === position) || null;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative scanlines w-full max-w-[420px]">
        <div className="grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3 w-full">
          {/* Render all 12 tiles with explicit positioning */}
          {TILE_POSITIONS.map((position) => {
            const gridPos = POSITION_TO_GRID[position];
            const tile = getTileAtPosition(position);
            const isHighlighted = highlightedPosition === position;

            return (
              <div
                key={`tile-${position}`}
                style={{
                  gridColumn: gridPos.col,
                  gridRow: gridPos.row,
                }}
              >
                <Tile
                  tile={tile}
                  isHighlighted={isHighlighted}
                  position={position}
                  difficulty={difficulty}
                  showValues={true}
                />
              </div>
            );
          })}

          {/* Center dice display (2x2) */}
          <div
            style={{
              gridColumn: '2 / 4',
              gridRow: '2 / 4',
            }}
          >
            <DiceDisplay
              diceValues={diceValues}
              isRolling={isRolling}
              multiplier={multiplier}
              gameStatus={gameStatus}
              betAmount={betAmount}
            />
          </div>
        </div>
      </div>
      <RollIndicator currentRoll={currentRoll} />
    </div>
  );
}
