'use client';

import { motion } from 'framer-motion';
import { AutoSettings } from '../types';

interface AutoControlsProps {
  autoSettings: AutoSettings;
  onSettingsChange: (settings: Partial<AutoSettings>) => void;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
  onClickSound?: () => void;
}

export default function AutoControls({
  autoSettings,
  onSettingsChange,
  onStart,
  onStop,
  disabled = false,
  onClickSound,
}: AutoControlsProps) {
  const { rollsPerGame, numberOfGames, isRunning, gamesPlayed } = autoSettings;

  return (
    <div className="space-y-4">
      {/* Rolls per game */}
      <div className="space-y-2">
        <label
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          Rolls per Game
        </label>
        <select
          value={rollsPerGame}
          onChange={(e) =>
            onSettingsChange({ rollsPerGame: parseInt(e.target.value) })
          }
          disabled={disabled || isRunning}
          className={`w-full rounded-lg py-3 px-4 font-bold focus:outline-none appearance-none cursor-pointer ${
            disabled || isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '2px solid var(--text-tertiary)',
            color: 'var(--text-primary)',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B6560' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 1rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'roll' : 'rolls'}
            </option>
          ))}
        </select>
      </div>

      {/* Number of games */}
      <div className="space-y-2">
        <label
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          Number of Games
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={numberOfGames === 0 ? '' : numberOfGames}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              onSettingsChange({ numberOfGames: isNaN(val) ? 0 : Math.max(0, val) });
            }}
            placeholder="∞"
            disabled={disabled || isRunning}
            min="0"
            className={`flex-1 rounded-lg py-3 px-4 font-bold slashed-zero focus:outline-none ${
              disabled || isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '2px solid var(--text-tertiary)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            onClick={() => { if (!disabled && !isRunning) { onClickSound?.(); onSettingsChange({ numberOfGames: 0 }); } }}
            disabled={disabled || isRunning}
            className={`px-4 py-3 rounded-lg text-lg font-bold transition-all ${
              disabled || isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: numberOfGames === 0 ? '2px solid var(--accent-amber)' : '2px solid var(--text-tertiary)',
              color: 'var(--text-primary)',
            }}
          >
            ∞
          </button>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {numberOfGames === 0 ? 'Infinite games' : `${numberOfGames} games`}
        </p>
      </div>

      {/* Games played counter */}
      {isRunning && (
        <div
          className="text-center py-3 rounded-lg"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Games Played: </span>
          <span className="font-bold slashed-zero" style={{ color: 'var(--text-primary)' }}>{gamesPlayed}</span>
          {numberOfGames > 0 && (
            <span style={{ color: 'var(--text-tertiary)' }}> / {numberOfGames}</span>
          )}
        </div>
      )}

      {/* Start/Stop button */}
      <motion.button
        onClick={() => { if (!disabled) { onClickSound?.(); isRunning ? onStop() : onStart(); } }}
        disabled={disabled}
        className={`w-full py-4 font-bold rounded-xl transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          backgroundColor: isRunning ? 'var(--state-danger)' : 'var(--accent-amber)',
          color: isRunning ? 'var(--text-on-dark)' : 'var(--text-on-amber)',
          border: '2px solid var(--text-primary)',
        }}
        whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.98, y: 1 } : {}}
      >
        {isRunning ? 'Stop Autoplay' : 'Start Autoplay'}
      </motion.button>
    </div>
  );
}
