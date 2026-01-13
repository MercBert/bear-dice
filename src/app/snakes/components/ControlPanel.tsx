'use client';

import ModeToggle from './ModeToggle';
import BetInput from './BetInput';
import DifficultySelect from './DifficultySelect';
import ManualControls from './ManualControls';
import AutoControls from './AutoControls';
import NetGainDisplay from './NetGainDisplay';
import TestModeControls from './TestModeControls';
import { GameState, Difficulty, GameMode, AutoSettings, TestModeSettings } from '../types';

interface ControlPanelProps {
  state: GameState;
  onBetChange: (value: number) => void;
  onHalfBet: () => void;
  onDoubleBet: () => void;
  onDifficultyChange: (value: Difficulty) => void;
  onModeChange: (mode: GameMode) => void;
  onAutoSettingsChange: (settings: Partial<AutoSettings>) => void;
  onTestModeSettingsChange: (settings: Partial<TestModeSettings>) => void;
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
  onTestModeSettingsChange,
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
    testModeSettings,
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
      className="w-full rounded-3xl p-4 md:p-6 flex flex-col"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* Panel Header */}
      <h2
        className="text-lg md:text-xl font-bold mb-3 md:mb-5"
        style={{ color: 'var(--text-primary)' }}
      >
        Setup Game
      </h2>

      {/* Controls Section - flex with order classes for mobile reordering */}
      <div className="flex flex-col gap-3 md:gap-5">
        {/* Play/Roll Controls - first on mobile, fourth on desktop */}
        <div className="order-1 md:order-4">
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

        {/* Bet Input - second on both */}
        <div className="order-2 md:order-2">
          <BetInput
            value={betAmount}
            onChange={onBetChange}
            onHalf={onHalfBet}
            onDouble={onDoubleBet}
            disabled={controlsDisabled}
            maxBet={balance}
          />
        </div>

        {/* Difficulty Select - third on both */}
        <div className="order-3 md:order-3">
          <DifficultySelect
            value={difficulty}
            onChange={onDifficultyChange}
            disabled={controlsDisabled}
          />
        </div>

        {/* Net Gain Display - fourth on mobile, fifth on desktop */}
        <div className="order-4 md:order-5">
          <NetGainDisplay totalNetGain={totalNetGain} balance={balance} />
        </div>

        {/* Mode Toggle - last on mobile, first on desktop */}
        <div className="order-5 md:order-1">
          <ModeToggle
            mode={mode}
            onModeChange={onModeChange}
            disabled={controlsDisabled}
          />
        </div>

        {/* Test Mode Controls - at the bottom */}
        <div className="order-6 md:order-6">
          <TestModeControls
            settings={testModeSettings}
            onSettingsChange={onTestModeSettingsChange}
            disabled={controlsDisabled}
          />
        </div>
      </div>
    </div>
  );
}
