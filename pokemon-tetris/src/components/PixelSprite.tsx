/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Reusable PixelSprite component to render 8-bit character grids
 */

import React from 'react';
import { PokemonSprite } from '../data/pokemon';

interface PixelSpriteProps {
  sprite: PokemonSprite;
  pixelSize?: number; // width/height of a single pixel in px
  className?: string;
  animate?: 'idle' | 'evolve' | 'bounce' | 'none' | 'action-shake' | 'action-jump' | 'action-spin';
  dexId?: number;
}

export default function PixelSprite({
  sprite,
  pixelSize = 3,
  className = '',
  animate = 'idle',
  dexId,
}: PixelSpriteProps) {
  const { grid, colors } = sprite;
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  // Animation CSS class mappings
  let animationClass = '';
  if (animate === 'idle') {
    animationClass = 'animate-pulse duration-[1500ms]';
  } else if (animate === 'evolve') {
    animationClass = 'animate-bounce';
  } else if (animate === 'bounce') {
    animationClass = 'animate-bounce duration-1000';
  } else if (animate === 'action-shake') {
    animationClass = 'animate-action-shake';
  } else if (animate === 'action-jump') {
    animationClass = 'animate-action-jump';
  } else if (animate === 'action-spin') {
    animationClass = 'animate-action-spin';
  }

  if (dexId !== undefined) {
    return (
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`}
        alt="pokemon sprite"
        className={`inline-block select-none rendering-pixelated ${animationClass} ${className}`}
        style={{
          width: `${cols * pixelSize * 1.5}px`, // Slight scaling for better visibility
          height: `${rows * pixelSize * 1.5}px`,
          objectFit: 'contain'
        }}
        draggable={false}
      />
    );
  }

  return (
    <div
      className={`inline-block select-none p-1 bg-transparent ${animationClass} ${className}`}
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        width: `${cols * pixelSize}px`,
        height: `${rows * pixelSize}px`,
        gap: '0px',
      }}
    >
      {grid.map((rowText, rowIndex) => {
        return rowText.split('').map((char, colIndex) => {
          const color = colors[char] || 'transparent';
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-full h-full"
              style={{
                backgroundColor: color,
                // Give black pixels a slight outline feel
                boxShadow: char === 'b' ? 'inset 0 0 1px rgba(0,0,0,0.2)' : 'none',
              }}
            />
          );
        });
      })}
    </div>
  );
}
