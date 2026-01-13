'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Difficulty, GameMode, TileState } from '../types';
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
  DICE_CYCLE_INTERVAL,
  WIN_DISPLAY_DURATION,
  LOSE_DISPLAY_DURATION,
  AUTO_ROLL_DELAY,
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      if (diceAnimationRef.current) {
        clearTimeout(diceAnimationRef.current);
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

  // Animate dice rolling
  const animateDice = useCallback(
    (finalValues: [number, number]): Promise<void> => {
      return new Promise((resolve) => {
        setState((prev) => ({ ...prev, isRolling: true }));

        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;

          if (elapsed < DICE_ROLL_DURATION) {
            // Show random dice values during animation
            const randomDie1 = Math.floor(Math.random() * 6) + 1;
            const randomDie2 = Math.floor(Math.random() * 6) + 1;
            setState((prev) => ({
              ...prev,
              diceValues: [randomDie1, randomDie2] as [number, number],
            }));
            diceAnimationRef.current = setTimeout(animate, DICE_CYCLE_INTERVAL);
          } else {
            // Show final values
            setState((prev) => ({
              ...prev,
              diceValues: finalValues,
              isRolling: false,
            }));
            resolve();
          }
        };

        animate();
      });
    },
    []
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

    // Roll the dice
    const diceResult = rollDice();
    const position = diceResult[0] + diceResult[1];

    // Animate the dice
    await animateDice(diceResult);

    // Get the tile at the position
    const tile = getTileAtPosition(currentState.board, position);

    if (!tile) return;

    setState((prev) => {
      // Reveal the tile
      const newBoard = prev.board.map((t) =>
        t.position === position ? { ...t, revealed: true } : t
      );

      if (tile.type === 'snake') {
        // Player hit a snake - lose
        return {
          ...prev,
          board: newBoard,
          highlightedPosition: position,
          gameStatus: 'lost',
          totalNetGain: prev.totalNetGain - prev.betAmount,
          balance: prev.balance - prev.betAmount,
        };
      } else {
        // Player landed on multiplier
        const newMultiplier =
          tile.type === 'multiplier' && tile.value
            ? Math.round(prev.currentMultiplier * tile.value * 100) / 100
            : prev.currentMultiplier;

        const newRoll = prev.currentRoll + 1;

        // Check if max rolls reached (auto-cashout)
        if (newRoll >= MAX_ROLLS) {
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
        }

        return {
          ...prev,
          board: newBoard,
          highlightedPosition: position,
          currentMultiplier: newMultiplier,
          currentRoll: newRoll,
        };
      }
    });
  }, [state, animateDice]);

  // Cash out
  const cashout = useCallback(() => {
    setState((prev) => {
      if (prev.gameStatus !== 'playing') return prev;

      const netGain = calculateNetGain(prev.betAmount, prev.currentMultiplier);
      const payout = calculatePayout(prev.betAmount, prev.currentMultiplier);

      return {
        ...prev,
        gameStatus: 'won',
        totalNetGain: prev.totalNetGain + netGain,
        balance: prev.balance + payout - prev.betAmount,
      };
    });
  }, []);

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
