/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GameScreen: Core Tetris game screen with Pokemon integrations and styling
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PokemonPartner, TETRIMINOS, TetriminoType, Tetrimino } from '../data/pokemon';
import PixelSprite from './PixelSprite';
import { soundEffects } from '../utils/audio';
import { ScoreEntry } from './Leaderboard';

interface GameScreenProps {
  partner: PokemonPartner;
  onGameOver: (finalScore: number, partnerLevel: number, trainerName: string, pokemonName: string) => void;
  onQuit: () => void;
  theme: 'gameboy' | 'dark' | 'light';
  startLevel?: number;
}

const COLS = 10;
const ROWS = 20;

// List of wild Pokemon we can "encounter and catch" on line clears
const WILD_POKEMON = [
  "Pidgey", "Rattata", "Zubat", "Geodude", "Gastly", 
  "Oddish", "Sandshrew", "Diglett", "Meowth", "Psyduck", 
  "Mankey", "Growlithe", "Poliwag", "Abra", "Machop",
  "Ponyta", "Magnemite", "Gastly", "Onix", "Krabby"
];

export default function GameScreen({ partner, onGameOver, onQuit, theme, startLevel = 1 }: GameScreenProps) {
  // Game state
  const [grid, setGrid] = useState<(string | null)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );

  // Active and preview pieces
  const [currentPiece, setCurrentPiece] = useState<{
    type: TetriminoType;
    shape: number[][];
    x: number;
    y: number;
    color: string;
  } | null>(null);

  const [nextPiece, setNextPiece] = useState<TetriminoType>('I');

  // Stats
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [level, setLevel] = useState(startLevel);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Pokemon features
  const [partnerLevel, setPartnerLevel] = useState(1);
  const [partnerXp, setPartnerXp] = useState(0);
  const [abilityEnergy, setAbilityEnergy] = useState(0); // 0 to 100
  const [caughtLog, setCaughtLog] = useState<string[]>([]);
  const [specialStatus, setSpecialStatus] = useState<string>(''); // floating status text
  const [boardFlash, setBoardFlash] = useState(false);
  const [characterAnim, setCharacterAnim] = useState<'idle' | 'action-shake' | 'action-jump' | 'action-spin'>('idle');
  const [activeSkillOverlay, setActiveSkillOverlay] = useState<{type: string, dexId: number} | null>(null);

  // Ref to keep track of current states in timing loop
  const stateRef = useRef({
    grid,
    currentPiece,
    score,
    linesCleared,
    level,
    isPaused,
    gameOver,
    partnerLevel,
    partnerXp,
    abilityEnergy
  });

  useEffect(() => {
    stateRef.current = {
      grid,
      currentPiece,
      score,
      linesCleared,
      level,
      isPaused,
      gameOver,
      partnerLevel,
      partnerXp,
      abilityEnergy
    };
  }, [grid, currentPiece, score, linesCleared, level, isPaused, gameOver, partnerLevel, partnerXp, abilityEnergy]);

  // Determine current form based on level
  const getCurrentForm = useCallback((lvl: number) => {
    if (lvl >= 10) return partner.evolutions[2]; // Final
    if (lvl >= 5) return partner.evolutions[1];  // Mid
    return partner.evolutions[0];                // Starter
  }, [partner]);

  const currentForm = getCurrentForm(partnerLevel);

  // Generate random piece type
  const getRandomPieceType = (): TetriminoType => {
    const keys = Object.keys(TETRIMINOS) as TetriminoType[];
    return keys[Math.floor(Math.random() * keys.length)];
  };

  // Check if a piece collides with walls or locked blocks
  const checkCollision = useCallback((
    shape: number[][],
    px: number,
    py: number,
    boardGrid: (string | null)[][]
  ): boolean => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const nextX = px + c;
          const nextY = py + r;

          // Border check
          if (nextX < 0 || nextX >= COLS || nextY >= ROWS) {
            return true;
          }

          // Check against locked blocks
          if (nextY >= 0 && boardGrid[nextY][nextX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Spawn new piece
  const spawnPiece = useCallback((upcomingType: TetriminoType, nextUpcoming: TetriminoType) => {
    const pTemplate = TETRIMINOS[upcomingType];
    const spawnX = Math.floor((COLS - pTemplate.shape[0].length) / 2);
    const spawnY = -1; // start slightly above visible board

    if (checkCollision(pTemplate.shape, spawnX, spawnY, stateRef.current.grid)) {
      // Game over condition on spawn
      setGameOver(true);
      soundEffects.playGameOver();
    } else {
      setCurrentPiece({
        type: upcomingType,
        shape: pTemplate.shape,
        x: spawnX,
        y: spawnY,
        color: pTemplate.color,
      });
      setNextPiece(nextUpcoming);
    }
  }, [checkCollision]);

  // Handle piece rotation
  const rotatePiece = () => {
    if (isPaused || gameOver || !currentPiece) return;

    // Rotate matrix 90 degrees clockwise
    const n = currentPiece.shape.length;
    const rotated = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        rotated[c][n - 1 - r] = currentPiece.shape[r][c];
      }
    }

    // Wall kick simple checks
    let nextX = currentPiece.x;
    if (checkCollision(rotated, nextX, currentPiece.y, grid)) {
      // Try kick right
      if (!checkCollision(rotated, nextX + 1, currentPiece.y, grid)) {
        nextX += 1;
      }
      // Try kick left
      else if (!checkCollision(rotated, nextX - 1, currentPiece.y, grid)) {
        nextX -= 1;
      }
      // Try kick up
      else if (!checkCollision(rotated, nextX, currentPiece.y - 1, grid)) {
        // can rotate
      } else {
        return; // collision, cannot rotate
      }
    }

    soundEffects.playRotate();
    setCurrentPiece((prev) => prev ? { ...prev, shape: rotated, x: nextX } : null);
  };

  // Move piece sideways
  const movePiece = (dir: number) => {
    if (isPaused || gameOver || !currentPiece) return;

    const nextX = currentPiece.x + dir;
    if (!checkCollision(currentPiece.shape, nextX, currentPiece.y, grid)) {
      soundEffects.playMove();
      setCurrentPiece((prev) => prev ? { ...prev, x: nextX } : null);
    }
  };

  // Lock current piece into board and check line clears
  const lockPieceAndClear = useCallback((activePiece: typeof currentPiece) => {
    if (!activePiece) return;

    const newGrid = stateRef.current.grid.map(row => [...row]);
    
    // Merge piece to grid
    for (let r = 0; r < activePiece.shape.length; r++) {
      for (let c = 0; c < activePiece.shape[r].length; c++) {
        if (activePiece.shape[r][c]) {
          const gy = activePiece.y + r;
          const gx = activePiece.x + c;
          if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
            newGrid[gy][gx] = activePiece.color;
          }
        }
      }
    }

    // Check full lines
    let clearedCount = 0;
    const filteredGrid = newGrid.filter((row) => {
      const isFull = row.every((cell) => cell !== null);
      if (isFull) clearedCount++;
      return !isFull;
    });

    // Repopulate empty lines at top
    while (filteredGrid.length < ROWS) {
      filteredGrid.unshift(Array(COLS).fill(null));
    }

    // Compute metrics
    if (clearedCount > 0) {
      soundEffects.playClear(clearedCount);
      
      setBoardFlash(true);
      setTimeout(() => setBoardFlash(false), 300);
      
      setCharacterAnim('action-jump');
      setTimeout(() => setCharacterAnim('idle'), 400);

      // Score calc
      const basePoints = [0, 100, 300, 500, 800];
      const pointsEarned = (basePoints[clearedCount] || 800) * stateRef.current.level;
      
      // Pokemon XP and Special Ability Energy gain
      const xpEarned = clearedCount * 10 + (clearedCount === 4 ? 20 : 0);
      const energyEarned = clearedCount * 25; // 4 lines = 100% full!

      setScore((prev) => prev + pointsEarned);
      setLinesCleared((prev) => {
        const nextLines = prev + clearedCount;
        // Level up speed progression
        const nextLvl = startLevel + Math.floor(nextLines / 10);
        if (nextLvl > stateRef.current.level) {
          setLevel(nextLvl);
          soundEffects.playLevelUp();
        }
        return nextLines;
      });

      // Update Partner Pokemon progression
      setPartnerXp((prevXp) => {
        const nextXp = prevXp + xpEarned;
        const currentLvl = stateRef.current.partnerLevel;
        // Simple 100 XP per Pokemon Level
        const nextLvl = Math.floor(nextXp / 100) + 1;
        if (nextLvl > currentLvl) {
          setPartnerLevel(nextLvl);
          soundEffects.playEvolution();
          setSpecialStatus(`EVOLVED TO LV.${nextLvl}!`);
          setTimeout(() => setSpecialStatus(''), 3000);
        }
        return nextXp;
      });

      // Update special charge
      setAbilityEnergy((prev) => Math.min(100, prev + energyEarned));

      // Encounter & Catch wild pokemon on clear!
      if (Math.random() < 0.65) {
        const randomWild = WILD_POKEMON[Math.floor(Math.random() * WILD_POKEMON.length)];
        setCaughtLog((prev) => [
          `CAUGHT WILD ${randomWild.toUpperCase()}!`,
          ...prev.slice(0, 5)
        ]);
      }
    }

    setGrid(filteredGrid);
    
    // Spawn next piece
    const nextUpcoming = getRandomPieceType();
    spawnPiece(nextPiece, nextUpcoming);
  }, [nextPiece, spawnPiece]);

  // Tick gravity down
  const tickDown = useCallback(() => {
    if (isPaused || gameOver || !currentPiece) return;

    const nextY = currentPiece.y + 1;
    if (!checkCollision(currentPiece.shape, currentPiece.x, nextY, grid)) {
      setCurrentPiece((prev) => prev ? { ...prev, y: nextY } : null);
    } else {
      // Piece landed, lock in
      lockPieceAndClear(currentPiece);
    }
  }, [grid, currentPiece, isPaused, gameOver, checkCollision, lockPieceAndClear]);

  // Soft drop
  const softDrop = () => {
    if (isPaused || gameOver) return;
    setScore((prev) => prev + 1);
    tickDown();
  };

  // Hard drop instantly
  const hardDrop = () => {
    if (isPaused || gameOver || !currentPiece) return;

    let targetY = currentPiece.y;
    while (!checkCollision(currentPiece.shape, currentPiece.x, targetY + 1, grid)) {
      targetY++;
    }

    soundEffects.playDrop();
    const dropScoreBonus = (targetY - currentPiece.y) * 2;
    setScore((prev) => prev + dropScoreBonus);

    const updatedPiece = { ...currentPiece, y: targetY };
    setCurrentPiece(updatedPiece);
    
    // Merge and clear immediately
    setTimeout(() => {
      lockPieceAndClear(updatedPiece);
    }, 50);
  };

  // Ability Activation logic!
  const activateSpecialAbility = () => {
    if (abilityEnergy < 100 || isPaused || gameOver) return;

    soundEffects.playEvolution();
    setAbilityEnergy(0);
    setSpecialStatus(`${currentForm.abilityName.toUpperCase()}!`);
    setTimeout(() => setSpecialStatus(''), 3000);
    
    let animType: 'action-shake' | 'action-jump' | 'action-spin' = 'action-shake';
    if (partner.id === 'eevee' || partner.id === 'mew') animType = 'action-spin';
    if (partner.id === 'pikachu' || partner.id === 'charmander') animType = 'action-jump';
    
    setCharacterAnim(animType);
    setTimeout(() => setCharacterAnim('idle'), 600);
    
    setBoardFlash(true);
    setTimeout(() => setBoardFlash(false), 300);

    setActiveSkillOverlay({ type: partner.id, dexId: currentForm.dexId });
    setTimeout(() => setActiveSkillOverlay(null), 2000); // Effect duration 2 seconds

    const newGrid = grid.map(row => [...row]);

    switch (partner.id) {
      case 'pikachu':
        // Electric clearing lowest rows
        if (partnerLevel >= 10) {
          // Thunder: Clear 3 bottom rows
          for (let r = ROWS - 1; r >= ROWS - 3; r--) {
            newGrid[r] = Array(COLS).fill(null);
          }
          setScore((prev) => prev + 500);
        } else if (partnerLevel >= 5) {
          // Thunderbolt: Clear 2 bottom rows
          for (let r = ROWS - 1; r >= ROWS - 2; r--) {
            newGrid[r] = Array(COLS).fill(null);
          }
        } else {
          // Static Charge: Clear bottom row
          newGrid[ROWS - 1] = Array(COLS).fill(null);
        }
        break;

      case 'charmander':
        // Fire melts single random blocks
        const blocksToClear = partnerLevel >= 10 ? 12 : partnerLevel >= 5 ? 8 : 4;
        let count = 0;
        for (let i = 0; i < 60; i++) {
          const ry = Math.floor(Math.random() * ROWS);
          const rx = Math.floor(Math.random() * COLS);
          if (newGrid[ry][rx]) {
            newGrid[ry][rx] = null;
            count++;
            if (count >= blocksToClear) break;
          }
        }
        break;

      case 'squirtle':
        // Water Gun shifts all blocks down, closing gaps
        const gapFills = partnerLevel >= 10 ? 99 : partnerLevel >= 5 ? 6 : 3;
        let gapsFilled = 0;

        // Iterate bottom up, find holes with blocks above them, and fall
        for (let c = 0; c < COLS; c++) {
          let writeIndex = ROWS - 1;
          for (let r = ROWS - 1; r >= 0; r--) {
            if (newGrid[r][c] !== null) {
              const temp = newGrid[r][c];
              newGrid[r][c] = null;
              newGrid[writeIndex][c] = temp;
              writeIndex--;
            }
          }
        }
        break;

      case 'bulbasaur':
        // Vine whip: Slices vertical columns
        if (partnerLevel >= 10) {
          // Clear center columns and bottom rows
          for (let r = 0; r < ROWS; r++) {
            newGrid[r][3] = null;
            newGrid[r][4] = null;
            newGrid[r][5] = null;
            newGrid[r][6] = null;
          }
          newGrid[ROWS - 1] = Array(COLS).fill(null);
        } else if (partnerLevel >= 5) {
          // Clear 3 center columns
          for (let r = 0; r < ROWS; r++) {
            newGrid[r][3] = null;
            newGrid[r][4] = null;
            newGrid[r][5] = null;
          }
        } else {
          // Clear center columns
          for (let r = 0; r < ROWS; r++) {
            newGrid[r][4] = null;
            newGrid[r][5] = null;
          }
        }
        break;

      case 'eevee':
        // Swift Swift gives scores + clears
        if (partnerLevel >= 10) {
          newGrid[ROWS - 1] = Array(COLS).fill(null);
          setScore((prev) => prev + 1000);
        } else if (partnerLevel >= 5) {
          // Clears isolated floating single blocks
          for (let r = 1; r < ROWS - 1; r++) {
            for (let c = 0; c < COLS; c++) {
              if (newGrid[r][c] && !newGrid[r+1][c] && !newGrid[r-1][c]) {
                newGrid[r][c] = null;
              }
            }
          }
        } else {
          setScore((prev) => prev + 300);
        }
        break;

      case 'mew':
        // Teleport swap piece to straight line
        if (currentPiece) {
          const straightShape = [[1, 1, 1, 1]];
          const straightType: TetriminoType = 'I';
          setCurrentPiece({
            type: straightType,
            shape: straightShape,
            x: Math.floor((COLS - 4) / 2),
            y: currentPiece.y,
            color: '#00f0f0'
          });
        }
        break;
    }

    setGrid(newGrid);
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd', 'x', 'p', 'c', 'Escape', 'Shift', 'W', 'A', 'S', 'D', 'X', 'P', 'C'];
      if (gameKeys.includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePiece(-1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePiece(1);
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'x':
        case 'X':
          rotatePiece();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          softDrop();
          break;
        case ' ':
          hardDrop();
          break;
        case 'Escape':
        case 'p':
        case 'P':
          soundEffects.playClick();
          setIsPaused((prev) => !prev);
          break;
        case 'c':
        case 'C':
        case 'Shift':
          activateSpecialAbility();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, currentPiece, isPaused, gameOver]);

  // Initial Spawn
  useEffect(() => {
    const spawnInitial = () => {
      const first = getRandomPieceType();
      const second = getRandomPieceType();
      spawnPiece(first, second);
    };
    spawnInitial();
  }, []);

  // Main game tick interval
  useEffect(() => {
    if (isPaused || gameOver) return;

    // Tick speed decreases exponentially with level for high challenge!
    const tickSpeed = Math.max(80, 1000 - (level - 1) * 90);
    const id = setInterval(() => {
      tickDown();
    }, tickSpeed);

    return () => clearInterval(id);
  }, [tickDown, isPaused, gameOver, level]);

  // Passive energy regeneration over time
  useEffect(() => {
    if (isPaused || gameOver) return;
    
    // Add 1% energy every 500ms
    const energyId = setInterval(() => {
      setAbilityEnergy(prev => Math.min(100, prev + 1));
    }, 500);
    
    return () => clearInterval(energyId);
  }, [isPaused, gameOver]);

  // Helper to calculate Ghost Piece projection (where active piece would land)
  const getGhostY = (): number => {
    if (!currentPiece) return 0;
    let ghostY = currentPiece.y;
    while (!checkCollision(currentPiece.shape, currentPiece.x, ghostY + 1, grid)) {
      ghostY++;
    }
    return ghostY;
  };

  // State calculations
  const ghostY = getGhostY();

  // Name Entry / Leaderboard Save State
  const [trainerName, setTrainerName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveScore = () => {
    if (!trainerName.trim()) return;
    soundEffects.playClick();
    
    setIsSaved(true);
    setTimeout(() => {
      onGameOver(score, partnerLevel, trainerName.trim().toUpperCase(), currentForm.name);
    }, 1000);
  };

  // Color theme classes for styling
  const containerClass = theme === 'gameboy' ? 'bg-[#9bbc0f] text-[#0f380f] font-mono' : theme === 'dark' ? 'bg-zinc-950 text-zinc-100 font-sans' : 'bg-slate-50 text-slate-900 font-sans';
  const panelClass = theme === 'gameboy' ? 'border-4 border-[#0f380f] bg-[#8bac0f]/30' : theme === 'dark' ? 'border-4 border-purple-900/50 bg-zinc-900/90' : 'border-4 border-slate-300 bg-white';
  const labelClass = theme === 'gameboy' ? 'text-[#0f380f]/75 uppercase text-[9px] font-retro' : 'text-purple-400 uppercase text-[9px] font-retro';
  const valueClass = theme === 'gameboy' ? 'text-[#0f380f] font-retro text-sm' : 'text-zinc-100 font-retro text-sm';

  return (
    <div id="game-arena" className={`min-h-screen p-3 md:p-6 flex flex-col items-center justify-center crt-screen transition-all ${containerClass} ${boardFlash ? 'animate-board-flash' : ''}`}>
      {/* HUD Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <PixelSprite sprite={currentForm.sprite} pixelSize={4} dexId={currentForm.dexId} animate={characterAnim} />
          <div>
            <div className={`font-retro text-[10px] uppercase ${partner.textColor}`}>
              {currentForm.name}
            </div>
            <div className="text-[10px] opacity-75 font-mono">
              LEVEL {partnerLevel} (XP: {partnerXp % 100}/100)
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            id="pause-game-btn"
            onClick={() => {
              soundEffects.playClick();
              setIsPaused((p) => !p);
            }}
            className={`font-retro text-[9px] py-2 px-3 rounded border-2 cursor-pointer ${
              theme === 'gameboy' ? 'border-[#0f380f]' : 'border-zinc-700 bg-zinc-800'
            }`}
          >
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
          <button
            id="quit-game-btn"
            onClick={onQuit}
            className={`font-retro text-[9px] py-2 px-3 rounded border-2 cursor-pointer ${
              theme === 'gameboy' ? 'border-[#0f380f]' : 'border-red-900/50 bg-red-950/20 text-red-400'
            }`}
          >
            QUIT
          </button>
        </div>
      </div>

      {/* Floating Level / Ability Notification */}
      {specialStatus && (
        <div className="fixed top-24 z-50 bg-yellow-400 text-black border-4 border-black px-4 py-2 font-retro text-xs animate-bounce rounded shadow-xl">
          {specialStatus}
        </div>
      )}

      {/* Main Grid & Side Panels */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Pokedex Log & Ability */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {/* Trainer / Partner Card */}
          <div className={`p-3 rounded-lg ${panelClass}`}>
            <span className={labelClass}>Partner Pokemon</span>
            <div className="flex items-center justify-center py-4">
              <PixelSprite sprite={currentForm.sprite} pixelSize={7} className="hover:scale-110 transition-transform" dexId={currentForm.dexId} animate={characterAnim} />
            </div>
            <div className="font-retro text-[8px] leading-relaxed opacity-90 text-center">
              "{currentForm.description}"
            </div>

            {/* XP progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[9px] mb-1">
                <span>XP PROGRESS</span>
                <span>{partnerXp % 100}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded overflow-hidden border">
                <div
                  className="bg-sky-400 h-full transition-all duration-300"
                  style={{ width: `${partnerXp % 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Special Ability charge card */}
          <div className={`p-3 rounded-lg ${panelClass}`}>
            <span className={labelClass}>SPECIAL POWER</span>
            <div className="mt-1 font-retro text-[10px] text-amber-500 uppercase">
              {currentForm.abilityName}
            </div>
            <div className="mt-2 text-[11px] leading-relaxed opacity-80 mb-3">
              {currentForm.abilityDescription}
            </div>

            {/* Energy Bar */}
            <div>
              <div className="flex justify-between text-[9px] mb-1">
                <span>ENERGY CHARGE</span>
                <span className={abilityEnergy >= 100 ? "text-yellow-400 font-bold animate-pulse" : ""}>
                  {abilityEnergy}% {abilityEnergy >= 100 ? "READY" : ""}
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-3 rounded overflow-hidden border">
                <div
                  className={`h-full transition-all duration-300 ${abilityEnergy >= 100 ? 'bg-amber-400 animate-pulse' : 'bg-amber-600'}`}
                  style={{ width: `${abilityEnergy}%` }}
                />
              </div>
            </div>

            <button
              id="trigger-ability-btn"
              disabled={abilityEnergy < 100}
              onClick={activateSpecialAbility}
              className={`w-full mt-3 font-retro text-[8px] md:text-[9px] py-2 rounded-lg border-2 cursor-pointer select-none ${
                abilityEnergy >= 100
                  ? 'bg-yellow-400 border-yellow-600 text-black font-bold animate-bounce'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed'
              }`}
            >
              TRIGGER POWER! (C / SHIFT)
            </button>
          </div>
        </div>

        {/* MIDDLE COLUMN: Tetris Playing Board */}
        <div className="md:col-span-6 flex flex-col items-center">
          {/* The Board Arena Frame */}
          <div className={`relative p-2 rounded-xl border-8 ${theme === 'gameboy' ? 'border-[#0f380f]' : 'border-purple-800/80 bg-zinc-950'} shadow-2xl overflow-hidden`}>
            {/* Grid container */}
            <div
              className="grid gap-[1px] bg-zinc-900/60"
              style={{
                gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                width: 'min(300px, 85vw)',
                height: 'min(600px, 170vw)',
              }}
            >
              {grid.map((row, r) => {
                return row.map((cellColor, c) => {
                  // Determine if active piece is occupying this cell
                  let isActive = false;
                  let activeColor = '';
                  let isGhost = false;

                  if (currentPiece) {
                    const pr = r - currentPiece.y;
                    const pc = c - currentPiece.x;
                    if (pr >= 0 && pr < currentPiece.shape.length && pc >= 0 && pc < currentPiece.shape[pr].length) {
                      if (currentPiece.shape[pr][pc]) {
                        isActive = true;
                        activeColor = currentPiece.color;
                      }
                    }

                    // Render Ghost shadow preview
                    const gpr = r - ghostY;
                    if (!isActive && gpr >= 0 && gpr < currentPiece.shape.length && pc >= 0 && pc < currentPiece.shape[gpr].length) {
                      if (currentPiece.shape[gpr][pc]) {
                        isGhost = true;
                        activeColor = currentPiece.color;
                      }
                    }
                  }

                  const cellColorStyle = isActive
                    ? activeColor
                    : isGhost
                    ? 'transparent'
                    : cellColor || '';

                  const borderClassStyle = isGhost ? `border-2 border-dashed border-[${activeColor}] opacity-40` : '';

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`relative aspect-square rounded-[2px] transition-all duration-[40ms] ${
                        cellColorStyle ? 'pixel-cell shadow-inner' : 'bg-zinc-950/25'
                      } ${borderClassStyle}`}
                      style={{
                        backgroundColor: cellColorStyle || undefined,
                        boxShadow: (isActive || cellColor) ? 'inset 1px 1px 3px rgba(255,255,255,0.4), inset -1px -1px 3px rgba(0,0,0,0.6)' : undefined
                      }}
                    />
                  );
                });
              })}
            </div>

            {/* PAUSED OVERLAY */}
            {isPaused && (
              <div className="absolute inset-0 z-30 bg-black/85 flex flex-col items-center justify-center p-4">
                <div className="font-retro text-xs text-yellow-400 blink mb-4">GAME PAUSED</div>
                <div className="font-sans text-xs text-zinc-400 text-center max-w-[220px]">
                  Press P or ESC to continue catching blocks!
                </div>
              </div>
            )}

            {/* SKILL EFFECT OVERLAY */}
            {activeSkillOverlay && (
              <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 animate-pulse"></div>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${activeSkillOverlay.dexId}.gif`}
                  alt="Skill Effect"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${activeSkillOverlay.dexId}.png`;
                  }}
                  className="w-40 h-40 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-bounce relative z-30 scale-150"
                  style={{ imageRendering: 'pixelated' }}
                />
                
                {/* Type-based Particle Effects */}
                {activeSkillOverlay.type === 'pikachu' && (
                  <div className="absolute inset-0 z-40 bg-yellow-400/20 mix-blend-overlay"></div>
                )}
                {activeSkillOverlay.type === 'charmander' && (
                  <div className="absolute inset-0 z-40 bg-red-500/20 mix-blend-overlay"></div>
                )}
                {activeSkillOverlay.type === 'squirtle' && (
                  <div className="absolute inset-0 z-40 bg-blue-500/20 mix-blend-overlay"></div>
                )}
                {activeSkillOverlay.type === 'bulbasaur' && (
                  <div className="absolute inset-0 z-40 bg-green-500/20 mix-blend-overlay"></div>
                )}
                {activeSkillOverlay.type === 'mew' && (
                  <div className="absolute inset-0 z-40 bg-pink-500/20 mix-blend-overlay"></div>
                )}
              </div>
            )}

            {/* GAME OVER CARD ENTRY */}
            {gameOver && (
              <div className="absolute inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-4 text-center">
                <div className="font-retro text-xs text-red-500 mb-2 animate-pulse">GAME OVER</div>
                <div className="font-retro text-[8px] text-zinc-400 mb-6 leading-relaxed">
                  YOU SCORED:<br />
                  <span className="text-sm text-emerald-400 font-bold">{score} POINTS</span>
                </div>

                {!isSaved ? (
                  <div className="w-full max-w-[220px] flex flex-col items-center">
                    <span className="font-retro text-[8px] mb-2 text-zinc-300">ENTER TRAINER NAME:</span>
                    <input
                      id="trainer-name-input"
                      type="text"
                      maxLength={8}
                      placeholder="ASH"
                      value={trainerName}
                      onChange={(e) => setTrainerName(e.target.value)}
                      className="w-full text-center py-2 px-3 bg-zinc-900 border-2 border-purple-500 rounded font-retro text-xs text-yellow-400 uppercase tracking-widest focus:outline-none focus:border-yellow-400 mb-4"
                    />
                    <button
                      id="submit-score-btn"
                      onClick={handleSaveScore}
                      className="w-full font-retro text-[9px] py-3 bg-emerald-500 text-black font-bold rounded cursor-pointer"
                    >
                      SAVE SCORE!
                    </button>
                  </div>
                ) : (
                  <div className="font-retro text-[8px] text-emerald-400 blink">
                    RECORD SAVED SUCCESSFULLY!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Statistics, Next Piece, Caught Logs */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {/* Next Piece Card */}
          <div className={`p-3 rounded-lg ${panelClass} flex flex-col items-center`}>
            <span className={labelClass}>NEXT PIECE</span>
            <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-zinc-600/30 rounded mt-2 bg-zinc-950/20">
              {(() => {
                const p = TETRIMINOS[nextPiece];
                if (!p) return null;
                // Render Next Piece miniature grid
                return (
                  <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${p.shape[0].length}, minmax(0, 1fr))` }}>
                    {p.shape.map((row, r) =>
                      row.map((cell, c) => (
                        <div
                          key={`${r}-${c}`}
                          className={`w-4 h-4 rounded-[1px] ${cell ? 'pixel-cell' : ''}`}
                          style={{
                            backgroundColor: cell ? p.color : 'transparent',
                            boxShadow: cell ? 'inset 1px 1px 2px rgba(255,255,255,0.4), inset -1px -1px 2px rgba(0,0,0,0.6)' : undefined
                          }}
                        />
                      ))
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="font-retro text-[8px] text-zinc-500 mt-2 text-center uppercase">
              {TETRIMINOS[nextPiece]?.name}
            </div>
          </div>

          {/* Stats Sheet Card */}
          <div className={`p-3 rounded-lg ${panelClass} flex flex-col gap-3`}>
            <span className={labelClass}>TRAINER STATS</span>
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-retro text-zinc-400">SCORE</span>
              <span className="text-xs font-retro text-emerald-400">{score}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-retro text-zinc-400">LINES</span>
              <span className="text-xs font-mono font-bold">{linesCleared}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-retro text-zinc-400">SPEED LEVEL</span>
              <span className="text-xs font-retro text-yellow-400">{level}</span>
            </div>
          </div>

          {/* Encounter log card */}
          <div className={`p-3 rounded-lg ${panelClass} flex flex-col flex-grow min-h-[140px]`}>
            <span className={labelClass}>WILD LOG</span>
            <div className="mt-2 flex flex-col gap-1.5 overflow-hidden font-retro text-[7px] leading-relaxed text-zinc-400">
              {caughtLog.length === 0 ? (
                <div className="opacity-40 italic text-center py-6">
                  CLEAR ROWS TO<br />CATCH POKEMON
                </div>
              ) : (
                caughtLog.map((log, i) => (
                  <div key={i} className="flex gap-1 items-center border-b border-zinc-800/40 pb-1 text-sky-300">
                    <span>⚡</span> <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Retro keyboard hint */}
      <div className="mt-6 text-center max-w-lg text-[9px] font-retro leading-relaxed opacity-55 select-none">
        ← → : MOVE | ↑ / Z : ROTATE | ↓ : SOFT DROP | SPACE : HARD DROP<br />
        C / SHIFT : SPECIAL | ESC / P : PAUSE
      </div>
    </div>
  );
}
