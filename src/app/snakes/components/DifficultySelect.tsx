'use client';

import { Difficulty } from '../types';
import { DIFFICULTY_LABELS } from '../utils/constants';

interface DifficultySelectProps {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
  disabled?: boolean;
}

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert', 'master'];

export default function DifficultySelect({
  value,
  onChange,
  disabled = false,
}: DifficultySelectProps) {
  return (
    <div className="space-y-1 md:space-y-2">
      <label
        className="text-[0.7rem] md:text-xs font-bold uppercase tracking-wider"
        style={{ color: 'var(--text-secondary)' }}
      >
        Difficulty
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Difficulty)}
        disabled={disabled}
        className={`w-full rounded-lg py-2 md:py-3 px-3 md:px-4 font-bold focus:outline-none appearance-none cursor-pointer text-sm md:text-base ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '2px solid var(--text-tertiary)',
          color: 'var(--text-primary)',
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B6560' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25em 1.25em',
        }}
      >
        {difficulties.map((diff) => (
          <option key={diff} value={diff}>
            {DIFFICULTY_LABELS[diff]}
          </option>
        ))}
      </select>
    </div>
  );
}
