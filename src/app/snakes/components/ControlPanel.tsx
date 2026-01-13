'use client';

import ModeToggle from './ModeToggle';
import BetInput from './BetInput';
import DifficultySelect from './DifficultySelect';
import ManualControls from './ManualControls';
import AutoControls from './AutoControls';
import NetGainDisplay from './NetGainDisplay';
import { GameState, Difficulty, GameMode, AutoSettings } from '../types';

interface ControlPanelProps {
  state: GameState;
  onBetChange: (value: number) => void;
  onHalfBet: () => void;
  onDoubleBet: () => void;
  onDifficultyChange: (value: Difficulty) => void;
  onModeChange: (mode: GameMode) => void;
  onAutoSettingsChange: (settings: Partial<AutoSettings>) => void;
  onPlay: () => void;
  onRoll: () => void;
  onCashout: () => void;
  onStartAutoPlay: () => void;
  onStopAutoPlay: () => void;
}

export default function ControlPanel({
  state,
  onBetChange,
  onHalfBet,
  onDoubleBet,
  onDifficultyChange,
  onModeChange,
  onAutoSettingsChange,
  onPlay,
  onRoll,
  onCashout,
  onStartAutoPlay,
  onStopAutoPlay,
}: ControlPanelProps) {
  const {
    betAmount,
    difficulty,
    mode,
    balance,
    autoSettings,
    gameStatus,
    currentMultiplier,
    isRolling,
    totalNetGain,
  } = state;

  const isGameInProgress = gameStatus === 'playing';
  const isAutoRunning = autoSettings.isRunning;
  const controlsDisabled = isGameInProgress || isAutoRunning;

  return (
    <div
      className="w-full rounded-3xl p-6 flex flex-col"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* Panel Header */}
      <h2
        className="text-xl font-bold mb-5"
        style={{ color: 'var(--text-primary)' }}
      >
        Setup Game
      </h2>

      {/* Controls Section */}
      <div className="space-y-5">
        {/* Mode Toggle */}
        <ModeToggle
          mode={mode}
          onModeChange={onModeChange}
          disabled={controlsDisabled}
        />

        {/* Bet Input */}
        <BetInput
          value={betAmount}
          onChange={onBetChange}
          onHalf={onHalfBet}
          onDouble={onDoubleBet}
          disabled={controlsDisabled}
          maxBet={balance}
        />

        {/* Difficulty Select */}
        <DifficultySelect
          value={difficulty}
          onChange={onDifficultyChange}
          disabled={controlsDisabled}
        />

        {/* Controls based on mode */}
        {mode === 'manual' ? (
          <ManualControls
            gameStatus={gameStatus}
            currentMultiplier={currentMultiplier}
            betAmount={betAmount}
            isRolling={isRolling}
            onPlay={onPlay}
            onRoll={onRoll}
            onCashout={onCashout}
          />
        ) : (
          <AutoControls
            autoSettings={autoSettings}
            onSettingsChange={onAutoSettingsChange}
            onStart={onStartAutoPlay}
            onStop={onStopAutoPlay}
            disabled={isGameInProgress && !isAutoRunning}
          />
        )}
      </div>

      {/* Spacer to push stats to bottom */}
      <div className="flex-1 min-h-4" />

      {/* Net Gain Display - anchored to bottom */}
      <NetGainDisplay totalNetGain={totalNetGain} balance={balance} />
    </div>
  );
}
