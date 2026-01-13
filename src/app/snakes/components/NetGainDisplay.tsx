'use client';

import { motion } from 'framer-motion';
import { CURRENCY_SYMBOL } from '../utils/constants';

interface NetGainDisplayProps {
  totalNetGain: number;
  balance: number;
}

export default function NetGainDisplay({
  totalNetGain,
  balance,
}: NetGainDisplayProps) {
  const isPositive = totalNetGain > 0;
  const isNegative = totalNetGain < 0;

  return (
    <div
      className="space-y-3 pt-5 mt-2"
      style={{ borderTop: '2px solid var(--text-tertiary)' }}
    >
      {/* Balance */}
      <div className="flex justify-between items-center">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          Balance
        </span>
        <span className="font-bold slashed-zero" style={{ color: 'var(--text-primary)' }}>
          {balance.toFixed(2)} {CURRENCY_SYMBOL}
        </span>
      </div>

      {/* Total Net Gain */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '2px solid var(--text-tertiary)',
        }}
      >
        <div
          className="text-xs font-bold uppercase tracking-wider mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          Total Net Gain
        </div>
        <motion.div
          key={totalNetGain}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-black slashed-zero"
          style={{
            color: isPositive
              ? 'var(--state-success-text)'
              : isNegative
              ? 'var(--state-danger)'
              : 'var(--text-primary)',
          }}
        >
          {isPositive ? '+' : ''}
          {totalNetGain.toFixed(2)} {CURRENCY_SYMBOL}
        </motion.div>
      </div>
    </div>
  );
}
