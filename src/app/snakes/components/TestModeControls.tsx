'use client';

import { TestModeSettings } from '../types';

interface TestModeControlsProps {
  settings: TestModeSettings;
  onSettingsChange: (settings: Partial<TestModeSettings>) => void;
  disabled?: boolean;
}

export default function TestModeControls({
  settings,
  onSettingsChange,
  disabled = false,
}: TestModeControlsProps) {
  const handleDieChange = (die: 'die1Value' | 'die2Value', value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 6) {
      onSettingsChange({ [die]: numValue });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Test Mode Toggle */}
      <div
        className="flex rounded-xl overflow-hidden p-0.5 md:p-1"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '2px solid var(--text-tertiary)',
        }}
      >
        <button
          className={`flex-1 py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-bold transition-all rounded-lg ${
            !settings.enabled ? '' : 'hover:opacity-80'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            backgroundColor: !settings.enabled ? 'var(--accent-amber)' : 'transparent',
            color: !settings.enabled ? 'var(--text-on-amber)' : 'var(--text-secondary)',
          }}
          onClick={() => onSettingsChange({ enabled: false })}
          disabled={disabled}
        >
          Normal
        </button>
        <button
          className={`flex-1 py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-bold transition-all rounded-lg ${
            settings.enabled ? '' : 'hover:opacity-80'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            backgroundColor: settings.enabled ? 'var(--accent-amber)' : 'transparent',
            color: settings.enabled ? 'var(--text-on-amber)' : 'var(--text-secondary)',
          }}
          onClick={() => onSettingsChange({ enabled: true })}
          disabled={disabled}
        >
          Test
        </button>
      </div>

      {/* Dice Value Inputs - only show when test mode is enabled */}
      {settings.enabled && (
        <div className="flex gap-3 mt-2">
          <div className="flex-1">
            <label
              className="block text-xs font-bold mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              DIE 1 VALUE
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={settings.die1Value}
              onChange={(e) => handleDieChange('die1Value', e.target.value)}
              disabled={disabled}
              className={`w-full py-2 px-3 text-center text-sm font-bold rounded-lg ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '2px solid var(--text-tertiary)',
              }}
            />
          </div>
          <div className="flex-1">
            <label
              className="block text-xs font-bold mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              DIE 2 VALUE
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={settings.die2Value}
              onChange={(e) => handleDieChange('die2Value', e.target.value)}
              disabled={disabled}
              className={`w-full py-2 px-3 text-center text-sm font-bold rounded-lg ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '2px solid var(--text-tertiary)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
