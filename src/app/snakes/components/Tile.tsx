'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TileState, Difficulty } from '../types';
import { formatMultiplier } from '../utils/gameLogic';
import { POSITION_MULTIPLIERS, DIFFICULTY_CONFIGS } from '../utils/constants';

interface TileProps {
  tile: TileState | null;
  isHighlighted: boolean;
  position: number;
  difficulty: Difficulty;
  showValues: boolean;
}

// Play icon for start tile
const PlayIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function Tile({ tile, isHighlighted, position, difficulty, showValues }: TileProps) {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const isSnakePosition = config.snakePositions.includes(position);
  const multiplier = POSITION_MULTIPLIERS[difficulty][position] || 0;

  const isStart = position === 1;
  const isSnakeHit = tile?.type === 'snake' && tile.revealed;
  const isMultiplierHit = tile?.type === 'multiplier' && tile.revealed;

  const getBackgroundColor = () => {
    if (isSnakeHit) return 'var(--tile-snake)';
    if (isHighlighted) return 'var(--tile-highlighted)';
    if (isStart) return 'var(--accent-amber)';
    if (isSnakePosition && showValues) return 'var(--state-danger-bg)';
    return 'var(--tile-default)';
  };

  const getBorderStyle = () => {
    if (isHighlighted) return '3px solid var(--text-primary)';
    if (isStart) return '2px solid var(--text-primary)';
    if (isSnakePosition && showValues) return '2px solid var(--state-danger)';
    return '2px solid transparent';
  };

  return (
    <motion.div
      className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200"
      style={{
        backgroundColor: getBackgroundColor(),
        border: getBorderStyle(),
        boxShadow: isHighlighted ? '0 4px 12px rgba(245, 166, 35, 0.3)' : 'none',
      }}
      initial={false}
      animate={
        isHighlighted
          ? { scale: 1.05 }
          : isSnakeHit
          ? { scale: [1, 1.1, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 0.3 }}
    >
      {/* Start tile */}
      {isStart && (
        <>
          <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: 'var(--text-on-amber)' }} />
          <span className="text-[10px] sm:text-xs font-bold mt-1" style={{ color: 'var(--text-secondary)' }}>
            START
          </span>
        </>
      )}

      {/* Bear tile (danger) */}
      {isSnakePosition && !isStart && (
        <motion.div
          initial={isSnakeHit ? { scale: 0.5, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <Image
            src="/images/bear-head.png"
            alt="Bear"
            width={60}
            height={60}
            className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
            style={{
              filter: isSnakeHit ? 'invert(1)' : 'none',
              opacity: isSnakeHit ? 1 : 0.7,
            }}
          />
          {isSnakeHit && (
            <span className="text-xs font-bold mt-1" style={{ color: 'var(--text-on-dark)' }}>
              BUST!
            </span>
          )}
        </motion.div>
      )}

      {/* Multiplier tile */}
      {!isSnakePosition && !isStart && (
        <motion.div
          initial={isMultiplierHit ? { scale: 0.5, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="text-center"
        >
          <span
            className="text-base sm:text-lg font-extrabold slashed-zero"
            style={{
              color: isHighlighted
                ? 'var(--text-on-amber)'
                : isMultiplierHit
                ? 'var(--state-success-text)'
                : 'var(--text-primary)',
            }}
          >
            {formatMultiplier(multiplier)}
          </span>
        </motion.div>
      )}

      {/* Position number indicator */}
      {!isStart && (
        <span
          className="absolute bottom-0.5 right-1.5 text-[8px] sm:text-[10px] font-bold opacity-40"
          style={{ color: isSnakePosition ? 'var(--text-on-dark)' : 'var(--text-secondary)' }}
        >
          {position}
        </span>
      )}
    </motion.div>
  );
}
