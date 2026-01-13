'use client';

import Die from './Die';
import MultiplierDisplay from './MultiplierDisplay';
import { GameStatus } from '../types';

interface DiceDisplayProps {
  diceValues: [number, number];
  isRolling: boolean;
  multiplier: number;
  gameStatus: GameStatus;
  betAmount: number;
}

export default function DiceDisplay({
  diceValues,
  isRolling,
  multiplier,
  gameStatus,
  betAmount,
}: DiceDisplayProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 sm:gap-4 p-4 rounded-2xl h-full"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '2px solid var(--text-tertiary)',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="flex gap-3 sm:gap-4">
        <Die value={diceValues[0]} isRolling={isRolling} />
        <Die value={diceValues[1]} isRolling={isRolling} />
      </div>
      <MultiplierDisplay
        value={multiplier}
        gameStatus={gameStatus}
        betAmount={betAmount}
      />
    </div>
  );
}
