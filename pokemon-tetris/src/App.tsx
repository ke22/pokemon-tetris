/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * App.tsx: Main controller and coordinator for the Pokemon Tetris experience
 */

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';
import { POKEMON_CHARACTERS, DECORATIVE_SPRITES, PokemonPartner } from './data/pokemon';
import PixelSprite from './components/PixelSprite';
import PokemonSelector from './components/PokemonSelector';
import Leaderboard, { ScoreEntry } from './components/Leaderboard';
import GameScreen from './components/GameScreen';
import SettingsScreen from './components/SettingsScreen';
import { soundEffects, toggleBgm, setSfxEnabled } from './utils/audio';

type Screen = 'title' | 'select' | 'game' | 'leaderboard' | 'settings';
type Theme = 'gameboy' | 'dark' | 'light';

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [theme, setTheme] = useState<Theme>('dark');
  const [bgm, setBgm] = useState(false);
  const [sfx, setSfx] = useState(true);
  const [startLevel, setStartLevel] = useState(1);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<PokemonPartner | null>(null);

  // Load scores on start from Firebase
  useEffect(() => {
    const scoresQuery = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10));
    const unsubscribe = onSnapshot(scoresQuery, (snapshot) => {
      const fetchedScores = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as ScoreEntry[];
      setScores(fetchedScores);
    });

    return () => unsubscribe();
  }, []);

  // Load user settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pokemon_tetris_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.startLevel) setStartLevel(parsed.startLevel);
        if (parsed.bgm !== undefined) {
          setBgm(parsed.bgm);
          toggleBgm(parsed.bgm);
        }
        if (parsed.sfx !== undefined) {
          setSfx(parsed.sfx);
          setSfxEnabled(parsed.sfx);
        }
      } catch (e) {
        console.error("Failed to parse local settings", e);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pokemon_tetris_settings', JSON.stringify({ theme, bgm, sfx, startLevel }));
  }, [theme, bgm, sfx, startLevel]);

  // Handle BGM changes
  const handleToggleBgm = (val: boolean) => {
    setBgm(val);
    toggleBgm(val);
    if (!val) soundEffects.playClick();
  };

  const handleToggleSfx = (val: boolean) => {
    setSfx(val);
    setSfxEnabled(val);
    if (val) {
      // Play a quick test sound when turning on
      setTimeout(() => soundEffects.playClick(), 10);
    }
  };

  const handleThemeChange = (val: Theme) => {
    setTheme(val);
  };

  const startSelectingPartner = () => {
    soundEffects.playClick();
    setScreen('select');
  };

  const showLeaderboard = () => {
    soundEffects.playClick();
    setScreen('leaderboard');
  };
  
  const showSettings = () => {
    soundEffects.playClick();
    setScreen('settings');
  };

  const handlePartnerSelected = (partner: PokemonPartner) => {
    setSelectedPartner(partner);
    setScreen('game');
  };

  const handleClearScores = async () => {
    try {
      const qs = await getDocs(collection(db, 'scores'));
      qs.forEach((docSnap) => {
        deleteDoc(docSnap.ref);
      });
    } catch (e) {
      console.error("Error clearing scores: ", e);
    }
  };

  const handleGameOver = async (finalScore: number, partnerLevel: number, trainerName: string, pokemonName: string) => {
    if (trainerName) {
      try {
        await addDoc(collection(db, 'scores'), {
          name: trainerName,
          score: finalScore,
          level: partnerLevel,
          pokemon: pokemonName,
          date: new Date().toLocaleDateString()
        });
      } catch (e) {
        console.error("Error saving score: ", e);
      }
    }
    // Return to title after game over is completed
    setScreen('title');
  };

  const cycleTheme = () => {
    soundEffects.playClick();
    setTheme((prev) => {
      if (prev === 'dark') return 'gameboy';
      if (prev === 'gameboy') return 'light';
      return 'dark';
    });
  };

  // Theme-specific container classes
  const containerThemeClass = 
    theme === 'gameboy' 
      ? 'bg-[#8bac0f] text-[#0f380f]' 
      : theme === 'dark' 
      ? 'bg-zinc-950 text-zinc-100' 
      : 'bg-slate-50 text-slate-800';

  const cardThemeClass =
    theme === 'gameboy'
      ? 'border-4 border-[#0f380f] bg-[#9bbc0f]'
      : theme === 'dark'
      ? 'border-4 border-purple-800/80 bg-zinc-900/90 shadow-2xl'
      : 'border-4 border-slate-300 bg-white shadow-xl';

  const btnThemeClass =
    theme === 'gameboy'
      ? 'bg-[#306230] hover:bg-[#0f380f] text-[#9bbc0f] border-2 border-[#0f380f]'
      : theme === 'dark'
      ? 'bg-purple-800 hover:bg-purple-700 text-zinc-100 border-2 border-purple-500 shadow-lg'
      : 'bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-400 shadow';

  return (
    <div id="app-container" className={`min-h-screen flex flex-col justify-between transition-all duration-300 font-sans ${containerThemeClass}`}>
      
      {/* Upper header */}
      <header className="py-4 px-6 border-b border-zinc-800/20 flex items-center justify-center md:justify-start">
        <div className="flex items-center gap-2">
          <PixelSprite sprite={DECORATIVE_SPRITES.pokeball} pixelSize={2} />
          <span className="font-retro text-[8px] md:text-[10px] tracking-widest uppercase font-bold">
            8-Bit Pokémon Tetris
          </span>
        </div>
      </header>

      {/* Main Screen Router */}
      <main className="flex-grow flex items-center justify-center p-4">
        {screen === 'title' && (
          <div id="title-screen" className={`max-w-md w-full p-6 md:p-8 rounded-2xl text-center border-4 pixel-border crt-screen ${cardThemeClass}`}>
            
            {/* Branding Header */}
            <div className="mb-4">
              <span className={`font-retro text-[10px] uppercase tracking-widest ${theme === 'gameboy' ? 'text-[#0f380f]' : 'text-red-500'}`}>
                Pokémon Mini
              </span>
              <h1 className={`font-retro text-base md:text-xl leading-snug mt-2 select-none uppercase tracking-tight ${theme === 'gameboy' ? 'text-[#0f380f]' : 'text-yellow-400 font-bold'}`}>
                POCKET TETRIS
              </h1>
            </div>

            {/* Stage illustration */}
            <div className="flex items-center justify-center gap-4 py-8">
              <PixelSprite sprite={POKEMON_CHARACTERS[0].evolutions[1].sprite} dexId={25} pixelSize={8} animate="bounce" />
            </div>

            {/* Menu options */}
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <button
                id="start-btn"
                onClick={startSelectingPartner}
                className={`font-retro text-xs md:text-sm py-4 px-6 rounded-lg cursor-pointer font-bold select-none transition-transform active:scale-95 ${btnThemeClass}`}
              >
                START GAME
              </button>

              <button
                id="leaderboard-btn"
                onClick={showLeaderboard}
                className={`font-retro text-[10px] md:text-xs py-3 px-6 rounded-lg cursor-pointer select-none border-2 ${
                  theme === 'gameboy'
                    ? 'border-[#0f380f] text-[#0f380f]'
                    : 'border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white'
                }`}
              >
                HALL OF FAME
              </button>

              <button
                id="settings-btn"
                onClick={showSettings}
                className={`font-retro text-[10px] md:text-xs py-3 px-6 rounded-lg cursor-pointer select-none border-2 ${
                  theme === 'gameboy'
                    ? 'border-[#0f380f] text-[#0f380f]'
                    : 'border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white'
                }`}
              >
                SETTINGS
              </button>
            </div>

            <div className="mt-8 pt-4 flex justify-center text-xs">
              <div className="text-[9px] text-zinc-500 font-mono">
                v1.1 (VERCEL READY)
              </div>
            </div>
          </div>
        )}

        {screen === 'select' && (
          <PokemonSelector
            theme={theme}
            onSelect={handlePartnerSelected}
            onBack={() => setScreen('title')}
          />
        )}

        {screen === 'game' && selectedPartner && (
          <GameScreen
            partner={selectedPartner}
            theme={theme}
            startLevel={startLevel}
            onGameOver={handleGameOver}
            onQuit={() => {
              soundEffects.playClick();
              setScreen('title');
            }}
          />
        )}

        {screen === 'leaderboard' && (
          <Leaderboard
            scores={scores}
            theme={theme}
            onClear={handleClearScores}
            onBack={() => setScreen('title')}
          />
        )}

        {screen === 'settings' && (
          <SettingsScreen
            theme={theme}
            onThemeChange={handleThemeChange}
            bgm={bgm}
            onBgmChange={handleToggleBgm}
            sfx={sfx}
            onSfxChange={handleToggleSfx}
            startLevel={startLevel}
            onStartLevelChange={(val) => {
              setStartLevel(val);
              soundEffects.playClick();
            }}
            onBack={() => setScreen('title')}
          />
        )}
      </main>

      {/* Footer credits */}
      <footer className="py-3 px-6 text-center text-[8px] font-retro opacity-45 select-none border-t border-zinc-800/10">
        © 2026 POCKET TETRIS RETRO INC. - CHIP SYNTHESIS ENABLED
      </footer>
    </div>
  );
}
