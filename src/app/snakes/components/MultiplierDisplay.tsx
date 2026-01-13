'use client';

import { motion } from 'framer-motion';
import { GameStatus } from '../types';
import { formatMultiplier } from '../utils/gameLogic';

interface MultiplierDisplayProps {
  value: number;
  gameStatus: GameStatus;
  betAmount?: number;
}

export default function MultiplierDisplay({
  value,
  gameStatus,
  betAmount = 0,
}: MultiplierDisplayProps) {
  const isWin = gameStatus === 'won';
  const isLoss = gameStatus === 'lost';
  const isPlaying = gameStatus === 'playing';

  const getTextColor = () => {
    if (isWin) return 'var(--state-success-text)';
    if (isLoss) return 'var(--state-danger)';
    if (isPlaying && value > 1) return 'var(--state-success-text)';
    return 'var(--text-primary)';
  };

  const payout = betAmount * value;

  // Win celebration container
  if (isWin) {
    return (
      <motion.div
        className="rounded-xl p-3 sm:p-4 text-center win-celebration"
        style={{
          backgroundColor: 'var(--state-success)',
          border: '3px solid var(--state-success-text)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="text-2xl sm:text-3xl font-black slashed-zero"
          style={{ color: 'var(--state-success-text)' }}
        >
          {formatMultiplier(value)}
        </motion.div>
        {betAmount > 0 && (
          <motion.div
            className="text-sm sm:text-base font-bold mt-1"
            style={{ color: 'var(--state-success-text)' }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            +{payout.toFixed(2)} G
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl p-2 sm:p-3">
      <motion.div
        className="text-2xl sm:text-3xl font-black slashed-zero text-center"
        style={{ color: getTextColor() }}
        key={value}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.2 }}
      >
        {formatMultiplier(value)}
      </motion.div>
    </div>
  );
}
