'use client';

import { Volume2, VolumeX } from 'lucide-react';

interface MuteToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export default function MuteToggle({ isMuted, onToggle }: MuteToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
      style={{
        backgroundColor: 'var(--bg-accent)',
        color: 'var(--text-primary)',
      }}
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
}
