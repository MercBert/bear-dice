'use client';

import { motion } from 'framer-motion';
import { MAX_ROLLS } from '../utils/constants';

interface RollIndicatorProps {
  currentRoll: number;
}

export default function RollIndicator({ currentRoll }: RollIndicatorProps) {
  return (
    <div className="flex gap-2 justify-center mt-5">
      {Array.from({ length: MAX_ROLLS }).map((_, index) => {
        const isActive = index < currentRoll;
        return (
          <motion.div
            key={index}
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-200"
            style={{
              backgroundColor: isActive ? 'var(--accent-amber)' : 'var(--text-tertiary)',
              boxShadow: isActive ? '0 0 8px rgba(245, 166, 35, 0.5)' : 'none',
            }}
            initial={false}
            animate={
              isActive
                ? { scale: [1, 1.3, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
          />
        );
      })}
    </div>
  );
}
