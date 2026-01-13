'use client';

import { motion } from 'framer-motion';

interface DieProps {
  value: number;
  isRolling?: boolean;
}

// Dot positions for each die face (1-6)
const dotPatterns: Record<number, { row: number; col: number }[]> = {
  1: [{ row: 1, col: 1 }],
  2: [
    { row: 0, col: 2 },
    { row: 2, col: 0 },
  ],
  3: [
    { row: 0, col: 2 },
    { row: 1, col: 1 },
    { row: 2, col: 0 },
  ],
  4: [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
  ],
  5: [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 1, col: 1 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
  ],
  6: [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 1, col: 0 },
    { row: 1, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
  ],
};

export default function Die({ value, isRolling = false }: DieProps) {
  const dots = dotPatterns[value] || dotPatterns[1];

  return (
    <motion.div
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg relative"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '2px solid var(--text-primary)',
      }}
      animate={
        isRolling
          ? {
              rotate: [0, -5, 5, 0],
              scale: [1, 1.05, 1.05, 1],
            }
          : { rotate: 0, scale: 1 }
      }
      transition={
        isRolling
          ? {
              duration: 0.1,
              repeat: Infinity,
              ease: 'linear',
            }
          : { duration: 0.2 }
      }
    >
      <div className="absolute inset-1.5 sm:inset-2 grid grid-cols-3 grid-rows-3 gap-0.5">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const hasDot = dots.some((d) => d.row === row && d.col === col);
            return (
              <div
                key={`${row}-${col}`}
                className="flex items-center justify-center"
              >
                {hasDot && (
                  <div
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                    style={{ backgroundColor: 'var(--dice-dots)' }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
