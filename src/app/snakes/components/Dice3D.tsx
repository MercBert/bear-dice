'use client';

import { useEffect, useState } from 'react';

interface Dice3DProps {
  value: number;
  isRolling: boolean;
}

// Dot positions for each dice value (0-8 for 3x3 grid)
const dotPositions: Record<number, number[]> = {
  1: [4],                    // center
  2: [0, 8],                 // top-left, bottom-right
  3: [0, 4, 8],              // diagonal
  4: [0, 2, 6, 8],           // corners
  5: [0, 2, 4, 6, 8],        // corners + center
  6: [0, 2, 3, 5, 6, 8],     // two columns
};

// Final rotation values to land on each number (front face shows the value)
const FINAL_ROTATIONS: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: 90 },
  4: { x: 0, y: -90 },
  5: { x: 90, y: 0 },
  6: { x: 180, y: 0 },
};

// Component for rendering dots on a dice face
function DiceFace({ value }: { value: number }) {
  const positions = dotPositions[value] || [];

  return (
    <div className="dice-face-dots">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="dot-space">
          {positions.includes(i) && <div className="dot" />}
        </div>
      ))}
    </div>
  );
}

export default function Dice3D({ value, isRolling }: Dice3DProps) {
  const [displayRotation, setDisplayRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isRolling && value) {
      // When rolling stops, set final position
      setDisplayRotation(FINAL_ROTATIONS[value] || FINAL_ROTATIONS[1]);
    }
  }, [isRolling, value]);

  return (
    <div className="dice-3d">
      <div
        className={`dice-cube ${isRolling ? 'rolling' : 'stopped'}`}
        style={!isRolling ? {
          transform: `rotateX(${displayRotation.x}deg) rotateY(${displayRotation.y}deg)`
        } : undefined}
      >
        {/* Front face - shows 1 */}
        <div className="dice-face front">
          <DiceFace value={1} />
        </div>
        {/* Back face - shows 6 */}
        <div className="dice-face back">
          <DiceFace value={6} />
        </div>
        {/* Right face - shows 3 */}
        <div className="dice-face right">
          <DiceFace value={3} />
        </div>
        {/* Left face - shows 4 */}
        <div className="dice-face left">
          <DiceFace value={4} />
        </div>
        {/* Top face - shows 2 */}
        <div className="dice-face top">
          <DiceFace value={2} />
        </div>
        {/* Bottom face - shows 5 */}
        <div className="dice-face bottom">
          <DiceFace value={5} />
        </div>
      </div>
    </div>
  );
}
