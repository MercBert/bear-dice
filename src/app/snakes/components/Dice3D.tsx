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

// Rotation values to land on each number (front face shows the value)
const diceRotations: Record<number, { x: number; y: number }> = {
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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isRolling) {
      // Start rapid spinning
      setIsAnimating(true);

      // Random spin during roll
      const spinInterval = setInterval(() => {
        setRotation({
          x: Math.random() * 360,
          y: Math.random() * 360,
        });
      }, 100);

      return () => clearInterval(spinInterval);
    } else {
      // Land on the final value
      setIsAnimating(false);
      const target = diceRotations[value] || diceRotations[1];

      // Add extra spins for dramatic effect when landing
      setRotation({
        x: target.x,
        y: target.y,
      });
    }
  }, [isRolling, value]);

  return (
    <div className="dice-3d">
      <div
        className={`dice-cube ${isAnimating ? 'rolling' : ''}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
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
