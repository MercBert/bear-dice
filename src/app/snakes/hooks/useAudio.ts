'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Audio hook for the Snakes game.
 * Handles preloading, playback, and mute state for all game sounds.
 *
 * @example
 * const { play, stop, toggleMute, isMuted } = useAudio();
 * play('diceRoll'); // Start dice rolling sound
 * stop('diceRoll'); // Stop it
 */

export type AudioKey = 'diceRoll' | 'win' | 'lose' | 'click' | 'footstep' | 'coin';

const AUDIO_PATHS: Record<AudioKey, string> = {
  diceRoll: '/audio/dice-roll.mp3',
  win: '/audio/win.mp3',
  lose: '/audio/lose.mp3',
  click: '/audio/click.mp3',
  footstep: '/audio/footstep.mp3',
  coin: '/audio/coin.mp3',
};

const STORAGE_KEY = 'audio-muted';

export function useAudio() {
  const audioRef = useRef<Record<AudioKey, HTMLAudioElement> | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  // Initialize audio elements on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audioElements: Record<AudioKey, HTMLAudioElement> = {
      diceRoll: new Audio(AUDIO_PATHS.diceRoll),
      win: new Audio(AUDIO_PATHS.win),
      lose: new Audio(AUDIO_PATHS.lose),
      click: new Audio(AUDIO_PATHS.click),
      footstep: new Audio(AUDIO_PATHS.footstep),
      coin: new Audio(AUDIO_PATHS.coin),
    };

    // Apply initial mute state and preload
    const storedMuted = localStorage.getItem(STORAGE_KEY) === 'true';
    (Object.keys(audioElements) as AudioKey[]).forEach((key) => {
      audioElements[key].muted = storedMuted;
      audioElements[key].load();
    });

    audioRef.current = audioElements;

    // Cleanup on unmount
    return () => {
      (Object.keys(audioElements) as AudioKey[]).forEach((key) => {
        audioElements[key].pause();
        audioElements[key].src = '';
      });
      audioRef.current = null;
    };
  }, []);

  // Sync mute state to localStorage and audio elements
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, String(isMuted));

    if (audioRef.current) {
      (Object.keys(audioRef.current) as AudioKey[]).forEach((key) => {
        audioRef.current![key].muted = isMuted;
      });
    }
  }, [isMuted]);

  const play = useCallback((key: AudioKey) => {
    if (!audioRef.current || audioRef.current[key].muted) return;

    const audio = audioRef.current[key];

    // Reset to start if already playing
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore autoplay errors - browser may block until user interaction
    });
  }, []);

  const stop = useCallback((key: AudioKey) => {
    if (!audioRef.current) return;

    const audio = audioRef.current[key];
    audio.pause();
    audio.currentTime = 0;
  }, []);

  const stopAll = useCallback(() => {
    if (!audioRef.current) return;

    (Object.keys(audioRef.current) as AudioKey[]).forEach((key) => {
      audioRef.current![key].pause();
      audioRef.current![key].currentTime = 0;
    });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    play,
    stop,
    stopAll,
    toggleMute,
    isMuted,
  };
}
