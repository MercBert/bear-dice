'use client';

import { motion } from 'framer-motion';
import { GameStatus } from '../types';
import { formatMultiplier } from '../utils/gameLogic';

interface ManualControlsProps {
  gameStatus: GameStatus;
  currentMultiplier: number;
  betAmount: number;
  isRolling: boolean;
  onPlay: () => void;
  onRoll: () => void;
  onCashout: () => void;
}

export default function ManualControls({
  gameStatus,
  currentMultiplier,
  betAmount,
  isRolling,
  onPlay,
  onRoll,
  onCashout,
}: ManualControlsProps) {
  const isIdle = gameStatus === 'idle';
  const isPlaying = gameStatus === 'playing';
  const canRoll = isPlaying && !isRolling;
  const canCashout = isPlaying && !isRolling && currentMultiplier > 1;

  const payout = betAmount * currentMultiplier;

  return (
    <div className="space-y-2 md:space-y-3">
      {isIdle ? (
        <motion.button
          onClick={onPlay}
          className="w-full py-3 md:py-4 font-bold rounded-xl transition-all text-sm md:text-base"
          style={{
            backgroundColor: 'var(--accent-amber)',
            color: 'var(--text-on-amber)',
            border: '2px solid var(--text-primary)',
          }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98, y: 1 }}
        >
          Play
        </motion.button>
      ) : isPlaying ? (
        <div className="flex gap-2 md:gap-3">
          <motion.button
            onClick={onCashout}
            disabled={!canCashout}
            className={`flex-1 py-2.5 md:py-4 font-bold rounded-xl transition-all ${
              !canCashout ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              backgroundColor: canCashout ? 'var(--accent-amber)' : 'var(--bg-primary)',
              color: canCashout ? 'var(--text-on-amber)' : 'var(--text-tertiary)',
              border: '2px solid var(--text-primary)',
            }}
            whileHover={canCashout ? { scale: 1.02, y: -1 } : {}}
            whileTap={canCashout ? { scale: 0.98, y: 1 } : {}}
          >
            <div className="text-xs md:text-sm">Cashout</div>
            {canCashout && (
              <div className="text-[10px] md:text-xs opacity-80 slashed-zero">
                {formatMultiplier(currentMultiplier)} = {payout.toFixed(2)} G
              </div>
            )}
          </motion.button>
          <motion.button
            onClick={onRoll}
            disabled={!canRoll}
            className={`flex-1 py-2.5 md:py-4 font-bold rounded-xl transition-all text-sm md:text-base ${
              !canRoll ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: canRoll ? 'var(--text-primary)' : 'var(--text-tertiary)',
              border: '2px solid var(--text-primary)',
            }}
            whileHover={canRoll ? { scale: 1.02, y: -1 } : {}}
            whileTap={canRoll ? { scale: 0.98, y: 1 } : {}}
          >
            {isRolling ? 'Rolling...' : 'Roll'}
          </motion.button>
        </div>
      ) : (
        <motion.button
          onClick={onPlay}
          className="w-full py-3 md:py-4 font-bold rounded-xl transition-all text-sm md:text-base"
          style={{
            backgroundColor: 'var(--accent-amber)',
            color: 'var(--text-on-amber)',
            border: '2px solid var(--text-primary)',
          }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98, y: 1 }}
        >
          Play Again
        </motion.button>
      )}
    </div>
  );
}
