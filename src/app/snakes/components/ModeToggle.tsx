'use client';

import { GameMode } from '../types';

interface ModeToggleProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  disabled?: boolean;
}

export default function ModeToggle({
  mode,
  onModeChange,
  disabled = false,
}: ModeToggleProps) {
  return (
    <div
      className="flex rounded-xl overflow-hidden p-0.5 md:p-1"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '2px solid var(--text-tertiary)'
      }}
    >
      <button
        className={`flex-1 py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-bold transition-all rounded-lg ${
          mode === 'manual'
            ? ''
            : 'hover:opacity-80'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          backgroundColor: mode === 'manual' ? 'var(--accent-amber)' : 'transparent',
          color: mode === 'manual' ? 'var(--text-on-amber)' : 'var(--text-secondary)',
        }}
        onClick={() => onModeChange('manual')}
        disabled={disabled}
      >
        Manual
      </button>
      <button
        className={`flex-1 py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-bold transition-all rounded-lg ${
          mode === 'auto'
            ? ''
            : 'hover:opacity-80'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          backgroundColor: mode === 'auto' ? 'var(--accent-amber)' : 'transparent',
          color: mode === 'auto' ? 'var(--text-on-amber)' : 'var(--text-secondary)',
        }}
        onClick={() => onModeChange('auto')}
        disabled={disabled}
      >
        Auto
      </button>
    </div>
  );
}
