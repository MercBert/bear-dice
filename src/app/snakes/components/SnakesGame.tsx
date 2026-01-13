'use client';

import { useEffect, useCallback } from 'react';
import ControlPanel from './ControlPanel';
import GameBoard from './GameBoard';
import { useSnakesGame } from '../hooks/useSnakesGame';
import { useAudio } from '../hooks/useAudio';

export default function SnakesGame() {
  const {
    state,
    setBetAmount,
    setDifficulty,
    setMode,
    setAutoSettings,
    setTestModeSettings,
    startGame,
    roll,
    cashout,
    resetGame,
    startAutoPlay,
    stopAutoPlay,
    halfBet,
    doubleBet,
  } = useSnakesGame();

  const { play } = useAudio();
  const playClick = useCallback(() => play('click'), [play]);

  // Keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (state.mode === 'manual') {
          if (state.gameStatus === 'idle') {
            startGame();
          } else if (state.gameStatus === 'playing' && !state.isRolling) {
            roll();
          } else if (state.gameStatus === 'won' || state.gameStatus === 'lost') {
            resetGame();
          }
        }
      }

      if (e.code === 'Escape') {
        if (state.mode === 'auto' && state.autoSettings.isRunning) {
          stopAutoPlay();
        } else if (state.mode === 'manual' && state.gameStatus === 'playing') {
          cashout();
        }
      }
    },
    [state, startGame, roll, cashout, resetGame, stopAutoPlay]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (state.mode === 'manual') {
      if (state.gameStatus === 'won' || state.gameStatus === 'lost') {
        const timeout = setTimeout(() => {
          resetGame();
        }, state.gameStatus === 'won' ? 2000 : 1500);
        return () => clearTimeout(timeout);
      }
    }
  }, [state.gameStatus, state.mode, resetGame]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4 lg:gap-6 items-stretch">
        {/* Game Play Area - Left Panel */}
        <div
          className="flex items-center justify-center rounded-3xl p-4 sm:p-6"
          style={{ backgroundColor: '#C8B8DC' }}
        >
          <GameBoard
            board={state.board}
            diceValues={state.diceValues}
            isRolling={state.isRolling}
            multiplier={state.currentMultiplier}
            gameStatus={state.gameStatus}
            highlightedPosition={state.highlightedPosition}
            currentRoll={state.currentRoll}
            betAmount={state.betAmount}
            difficulty={state.difficulty}
          />
        </div>

        {/* Setup Panel - Right Panel */}
        <ControlPanel
          state={state}
          onBetChange={setBetAmount}
          onHalfBet={halfBet}
          onDoubleBet={doubleBet}
          onDifficultyChange={setDifficulty}
          onModeChange={setMode}
          onAutoSettingsChange={setAutoSettings}
          onTestModeSettingsChange={setTestModeSettings}
          onPlay={startGame}
          onRoll={roll}
          onCashout={cashout}
          onStartAutoPlay={startAutoPlay}
          onStopAutoPlay={stopAutoPlay}
          onClickSound={playClick}
        />
      </div>
    </div>
  );
}
