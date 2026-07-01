import React from 'react';
import { soundEffects } from '../utils/audio';

interface SettingsScreenProps {
  theme: 'gameboy' | 'dark' | 'light';
  onThemeChange: (theme: 'gameboy' | 'dark' | 'light') => void;
  bgm: boolean;
  onBgmChange: (bgm: boolean) => void;
  sfx: boolean;
  onSfxChange: (sfx: boolean) => void;
  startLevel: number;
  onStartLevelChange: (level: number) => void;
  onBack: () => void;
}

export default function SettingsScreen({ theme, onThemeChange, bgm, onBgmChange, sfx, onSfxChange, startLevel, onStartLevelChange, onBack }: SettingsScreenProps) {
  const cardThemeClass =
    theme === 'gameboy'
      ? 'border-4 border-[#0f380f] bg-[#9bbc0f] text-[#0f380f]'
      : theme === 'dark'
      ? 'border-4 border-purple-800/80 bg-zinc-900/90 shadow-2xl text-zinc-100'
      : 'border-4 border-slate-300 bg-white shadow-xl text-slate-800';

  const headingClass = 
    theme === 'gameboy' 
      ? 'text-[#0f380f]' 
      : theme === 'dark' 
      ? 'text-yellow-400 font-bold' 
      : 'text-blue-600 font-bold';

  const btnThemeClass =
    theme === 'gameboy'
      ? 'bg-[#306230] hover:bg-[#0f380f] text-[#9bbc0f] border-2 border-[#0f380f]'
      : theme === 'dark'
      ? 'bg-purple-800 hover:bg-purple-700 text-zinc-100 border-2 border-purple-500 shadow-lg'
      : 'bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-400 shadow';

  const handleThemeChange = (newTheme: 'gameboy' | 'dark' | 'light') => {
    soundEffects.playClick();
    onThemeChange(newTheme);
  };

  const handleBack = () => {
    soundEffects.playClick();
    onBack();
  };

  return (
    <div id="settings-screen" className={`max-w-md w-full p-6 md:p-8 rounded-2xl border-4 pixel-border crt-screen ${cardThemeClass}`}>
      <h2 className={`font-retro text-lg text-center mb-8 uppercase tracking-widest ${headingClass}`}>
        SETTINGS
      </h2>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-4 border-zinc-500/20">
          <span className="font-retro text-sm uppercase">Theme</span>
          <div className="flex gap-2">
            {(['gameboy', 'dark', 'light'] as const).map(t => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={`font-retro text-[8px] py-2 px-3 rounded uppercase border-2 ${
                  theme === t ? (theme === 'gameboy' ? 'bg-[#0f380f] text-[#8bac0f] border-[#0f380f]' : 'bg-yellow-400 text-black border-yellow-400') : (theme === 'gameboy' ? 'border-[#0f380f] text-[#0f380f]' : 'border-zinc-500 text-zinc-400')
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-b pb-4 border-zinc-500/20">
          <span className="font-retro text-sm uppercase">Music (BGM)</span>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={bgm}
              onChange={(e) => onBgmChange(e.target.checked)}
              className="w-5 h-5 rounded accent-purple-600"
            />
            <span className="font-retro text-[10px] uppercase">
              {bgm ? 'ON' : 'OFF'}
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between border-b pb-4 border-zinc-500/20">
          <span className="font-retro text-sm uppercase">Sound Effects</span>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sfx}
              onChange={(e) => onSfxChange(e.target.checked)}
              className="w-5 h-5 rounded accent-purple-600"
            />
            <span className="font-retro text-[10px] uppercase">
              {sfx ? 'ON' : 'OFF'}
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between border-b pb-4 border-zinc-500/20">
          <span className="font-retro text-sm uppercase">Start Level</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="15"
              value={startLevel}
              onChange={(e) => onStartLevelChange(Number(e.target.value))}
              className="w-24 accent-purple-600"
            />
            <span className="font-retro text-xs w-6 text-right">
              {startLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleBack}
          className={`font-retro text-xs py-3 px-8 rounded border-2 cursor-pointer transition-transform active:scale-95 ${btnThemeClass}`}
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  );
}
