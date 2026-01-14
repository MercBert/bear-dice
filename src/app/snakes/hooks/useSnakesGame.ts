'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Difficulty, GameMode, TileState } from '../types';
import { useAudio } from './useAudio';
import {
  generateBoard,
  rollDice,
  getTileAtPosition,
  calculateNetGain,
  calculatePayout,
} from '../utils/gameLogic';
import {
  INITIAL_BALANCE,
  MAX_ROLLS,
  DICE_ROLL_DURATION,
  WIN_DISPLAY_DURATION,
  LOSE_DISPLAY_DURATION,
  AUTO_ROLL_DELAY,
  STEP_DURATION,
} from '../utils/constants';

const initialState: GameState = {
  betAmount: 1.0,
  difficulty: 'easy',
  mode: 'manual',
  balance: INITIAL_BALANCE,
  autoSettings: {
    rollsPerGame: 3,
    numberOfGames: 0,
    gamesPlayed: 0,
    isRunning: false,
  },
  testModeSettings: {
    enabled: false,
    die1Value: 1,
    die2Value: 1,
  },
  gameStatus: 'idle',
  currentRoll: 0,
  currentMultiplier: 1.0,
  totalNetGain: 0,
  board: [],
  diceValues: [1, 1],
  highlightedPosition: null,
  isRolling: false,
};

export function useSnakesGame() {
  const [state, setState] = useState<GameState>(initialState);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const diceAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const steppingAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const { play, stop } = useAudio();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      if (diceAnimationRef.current) {
        clearTimeout(diceAnimationRef.current);
      }
      if (steppingAnimationRef.current) {
        clearTimeout(steppingAnimationRef.current);
      }
    };
  }, []);

  // Set bet amount
  const setBetAmount = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      betAmount: Math.max(0.01, Math.min(amount, prev.balance)),
    }));
  }, []);

  // Set difficulty
  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setState((prev) => ({ ...prev, difficulty }));
  }, []);

  // Set mode
  const setMode = useCallback((mode: GameMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  // Set auto settings
  const setAutoSettings = useCallback(
    (settings: Partial<GameState['autoSettings']>) => {
      setState((prev) => ({
        ...prev,
        autoSettings: { ...prev.autoSettings, ...settings },
      }));
    },
    []
  );

  // Set test mode settings
  const setTestModeSettings = useCallback(
    (settings: Partial<GameState['testModeSettings']>) => {
      setState((prev) => ({
        ...prev,
        testModeSettings: { ...prev.testModeSettings, ...settings },
      }));
    },
    []
  );

  // Animate dice rolling - CSS handles the visual spin animation
  const animateDice = useCallback(
    (finalValues: [number, number]): Promise<void> => {
      return new Promise((resolve) => {
        // Start rolling animation (CSS takes over the visual spin)
        setState((prev) => ({ ...prev, isRolling: true }));

        // After exactly 2 seconds, stop and show results
        diceAnimationRef.current = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            diceValues: finalValues,
            isRolling: false,
          }));
          resolve();
        }, DICE_ROLL_DURATION);
      });
    },
    []
  );

  // Animate stepping through tiles from position 1 to target
  // isFinalBear: if true, skip footstep on final tile (bear slash sound will play instead)
  const animateSteps = useCallback(
    (targetPosition: number, isFinalBear: boolean = false): Promise<void> => {
      return new Promise((resolve) => {
        // Build array of all positions to step through: [1, 2, 3, ..., targetPosition]
        const positions: number[] = [];
        for (let i = 1; i <= targetPosition; i++) {
          positions.push(i);
        }

        let index = 0;

        const step = () => {
          if (index >= positions.length) {
            // All positions visited, wait a moment then resolve
            steppingAnimationRef.current = setTimeout(resolve, STEP_DURATION / 2);
            return;
          }

          const position = positions[index];
          const isLastStep = index === positions.length - 1;

          // Update highlighted position
          setState((prev) => ({ ...prev, highlightedPosition: position }));

          // Play footstep when moving to a new tile, but:
          // - Not at start position (position 1)
          // - Not on final bear tile (slash sound will play instead)
          if (position > 1 && !(isLastStep && isFinalBear)) {
            play('footstep');
          }

          index++;

          // Schedule next step after STEP_DURATION
          steppingAnimationRef.current = setTimeout(step, STEP_DURATION);
        };

        // Start stepping
        step();
      });
    },
    [play]
  );

  // Start a new game
  const startGame = useCallback(() => {
    setState((prev) => {
      if (prev.betAmount > prev.balance) return prev;

      const newBoard = generateBoard(prev.difficulty);
      return {
        ...prev,
        gameStatus: 'playing',
        currentRoll: 0,
        currentMultiplier: 1.0,
        board: newBoard,
        highlightedPosition: null,
        diceValues: [1, 1],
      };
    });
  }, []);

  // Perform a roll
  const roll = useCallback(async () => {
    // Get current state snapshot
    const currentState = state;

    if (currentState.gameStatus !== 'playing' || currentState.isRolling) return;
    if (currentState.currentRoll >= MAX_ROLLS) return;

    // Clear any pending stepping animation
    if (steppingAnimationRef.current) {
      clearTimeout(steppingAnimationRef.current);
    }

    // SINGLE SOURCE OF TRUTH: Generate dice values ONCE
    // These exact values are used for BOTH display AND tile position
    // Use test values OR random based on test mode
    const { testModeSettings } = currentState;
    const diceResult: [number, number] = testModeSettings.enabled
      ? [testModeSettings.die1Value, testModeSettings.die2Value]
      : rollDice();
    const [die1, die2] = diceResult;
    const position = die1 + die2; // Tile position = sum of dice (2-12)

    // Play dice roll sound (stop any previous to handle rapid re-rolls)
    stop('diceRoll');
    play('diceRoll');

    // Animate dice - passes the SAME values to display
    await animateDice(diceResult);

    // Check if landing tile is a bear BEFORE animating (to skip footstep on bear)
    const tile = getTileAtPosition(currentState.board, position);
    const isLandingOnBear = tile?.type === 'snake';

    // Animate stepping from tile 1 to landing position
    // Pass bear flag to skip footstep on final tile (slash sound plays instead)
    await animateSteps(position, isLandingOnBear);

    if (!tile) return;

    // Determine outcome based on tile type (reuse check from above)
    const isSnake = isLandingOnBear;
    const newMultiplier =
      tile.type === 'multiplier' && tile.value
        ? Math.round(currentState.currentMultiplier * tile.value * 100) / 100
        : currentState.currentMultiplier;
    const newRoll = currentState.currentRoll + 1;
    const isMaxRolls = newRoll >= MAX_ROLLS;

    // Update state
    setState((prev) => {
      // Reveal the tile
      const newBoard = prev.board.map((t) =>
        t.position === position ? { ...t, revealed: true } : t
      );

      if (isSnake) {
        // Player hit a snake - lose
        return {
          ...prev,
          board: newBoard,
          highlightedPosition: position,
          gameStatus: 'lost',
          totalNetGain: prev.totalNetGain - prev.betAmount,
          balance: prev.balance - prev.betAmount,
        };
      } else if (isMaxRolls) {
        // Max rolls reached (auto-cashout)
        const netGain = calculateNetGain(prev.betAmount, newMultiplier);
        const payout = calculatePayout(prev.betAmount, newMultiplier);
        return {
          ...prev,
          board: newBoard,
          highlightedPosition: position,
          currentMultiplier: newMultiplier,
          currentRoll: newRoll,
          gameStatus: 'won',
          totalNetGain: prev.totalNetGain + netGain,
          balance: prev.balance + payout - prev.betAmount,
        };
      } else {
        // Player landed on multiplier, game continues
        return {
          ...prev,
          board: newBoard,
          highlightedPosition: position,
          currentMultiplier: newMultiplier,
          currentRoll: newRoll,
        };
      }
    });

    // Play outcome sound after stepping and state update complete
    if (isSnake) {
      play('lose');
    } else if (isMaxRolls) {
      play('win');
    } else {
      // Landed on multiplier tile, game continues - play coin sound
      play('coin');
    }
  }, [state, animateDice, animateSteps, play, stop]);

  // Cash out
  const cashout = useCallback(() => {
    setState((prev) => {
      if (prev.gameStatus !== 'playing') return prev;

      const netGain = calculateNetGain(prev.betAmount, prev.currentMultiplier);
      const payout = calculatePayout(prev.betAmount, prev.currentMultiplier);

      play('win');
      return {
        ...prev,
        gameStatus: 'won',
        totalNetGain: prev.totalNetGain + netGain,
        balance: prev.balance + payout - prev.betAmount,
      };
    });
  }, [play]);

  // Reset game to idle
  const resetGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      gameStatus: 'idle',
      currentRoll: 0,
      currentMultiplier: 1.0,
      board: [],
      highlightedPosition: null,
      diceValues: [1, 1],
    }));
  }, []);

  // Auto-play logic
  const runAutoPlay = useCallback(async () => {
    const currentState = state;

    if (!currentState.autoSettings.isRunning) return;

    // Check if we've played enough games
    if (
      currentState.autoSettings.numberOfGames > 0 &&
      currentState.autoSettings.gamesPlayed >= currentState.autoSettings.numberOfGames
    ) {
      setState((prev) => ({
        ...prev,
        autoSettings: { ...prev.autoSettings, isRunning: false },
      }));
      return;
    }

    // Start a new game if in idle state
    if (currentState.gameStatus === 'idle') {
      startGame();
      autoPlayTimeoutRef.current = setTimeout(runAutoPlay, AUTO_ROLL_DELAY);
      return;
    }

    // Roll if playing
    if (currentState.gameStatus === 'playing' && !currentState.isRolling) {
      // Check if we should cashout based on auto settings
      if (currentState.currentRoll >= currentState.autoSettings.rollsPerGame) {
        cashout();
        setState((prev) => ({
          ...prev,
          autoSettings: {
            ...prev.autoSettings,
            gamesPlayed: prev.autoSettings.gamesPlayed + 1,
          },
        }));
        autoPlayTimeoutRef.current = setTimeout(() => {
          resetGame();
          autoPlayTimeoutRef.current = setTimeout(runAutoPlay, AUTO_ROLL_DELAY);
        }, WIN_DISPLAY_DURATION);
        return;
      }

      await roll();
      autoPlayTimeoutRef.current = setTimeout(runAutoPlay, AUTO_ROLL_DELAY);
      return;
    }

    // Handle win/loss states
    if (currentState.gameStatus === 'won') {
      setState((prev) => ({
        ...prev,
        autoSettings: {
          ...prev.autoSettings,
          gamesPlayed: prev.autoSettings.gamesPlayed + 1,
        },
      }));
      autoPlayTimeoutRef.current = setTimeout(() => {
        resetGame();
        autoPlayTimeoutRef.current = setTimeout(runAutoPlay, AUTO_ROLL_DELAY);
      }, WIN_DISPLAY_DURATION);
      return;
    }

    if (currentState.gameStatus === 'lost') {
      setState((prev) => ({
        ...prev,
        autoSettings: {
          ...prev.autoSettings,
          gamesPlayed: prev.autoSettings.gamesPlayed + 1,
        },
      }));
      autoPlayTimeoutRef.current = setTimeout(() => {
        resetGame();
        autoPlayTimeoutRef.current = setTimeout(runAutoPlay, AUTO_ROLL_DELAY);
      }, LOSE_DISPLAY_DURATION);
      return;
    }
  }, [state, startGame, roll, cashout, resetGame]);

  // Start auto-play
  const startAutoPlay = useCallback(() => {
    setState((prev) => ({
      ...prev,
      autoSettings: {
        ...prev.autoSettings,
        isRunning: true,
        gamesPlayed: 0,
      },
    }));
  }, []);

  // Stop auto-play
  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    setState((prev) => ({
      ...prev,
      autoSettings: { ...prev.autoSettings, isRunning: false },
    }));
  }, []);

  // Effect to handle auto-play
  useEffect(() => {
    if (state.autoSettings.isRunning && state.mode === 'auto') {
      runAutoPlay();
    }
  }, [state.autoSettings.isRunning, state.gameStatus, runAutoPlay, state.mode]);

  // Half bet
  const halfBet = useCallback(() => {
    setState((prev) => ({
      ...prev,
      betAmount: Math.max(0.01, Math.round((prev.betAmount / 2) * 100) / 100),
    }));
  }, []);

  // Double bet
  const doubleBet = useCallback(() => {
    setState((prev) => ({
      ...prev,
      betAmount: Math.min(prev.balance, Math.round(prev.betAmount * 2 * 100) / 100),
    }));
  }, []);

  return {
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
  };
}
