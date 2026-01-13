'use client';

import { CURRENCY_SYMBOL } from '../utils/constants';

interface BetInputProps {
  value: number;
  onChange: (value: number) => void;
  onHalf: () => void;
  onDouble: () => void;
  disabled?: boolean;
  maxBet: number;
}

export default function BetInput({
  value,
  onChange,
  onHalf,
  onDouble,
  disabled = false,
  maxBet,
}: BetInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(Math.max(0.01, Math.min(newValue, maxBet)));
    }
  };

  return (
    <div className="space-y-2">
      <label
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: 'var(--text-secondary)' }}
      >
        Bet Amount
      </label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 font-bold"
            style={{ color: 'var(--text-secondary)' }}
          >
            {CURRENCY_SYMBOL}
          </span>
          <input
            type="number"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            step="0.01"
            min="0.01"
            max={maxBet}
            className={`w-full rounded-lg py-3 pl-8 pr-3 text-right font-bold slashed-zero focus:outline-none ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '2px solid var(--text-tertiary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <button
          onClick={onHalf}
          disabled={disabled}
          className={`px-4 py-3 rounded-lg text-sm font-bold transition-all hover:border-amber-400 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '2px solid var(--text-tertiary)',
            color: 'var(--text-secondary)',
          }}
        >
          ½
        </button>
        <button
          onClick={onDouble}
          disabled={disabled}
          className={`px-4 py-3 rounded-lg text-sm font-bold transition-all hover:border-amber-400 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '2px solid var(--text-tertiary)',
            color: 'var(--text-secondary)',
          }}
        >
          2×
        </button>
      </div>
    </div>
  );
}
