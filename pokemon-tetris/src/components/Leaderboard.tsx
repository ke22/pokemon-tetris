/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Leaderboard: displays retro high score ranking from localStorage
 */

import React from 'react';
import { soundEffects } from '../utils/audio';

export interface ScoreEntry {
  name: string;
  score: number;
  level: number;
  pokemon: string;
  date: string;
}

interface LeaderboardProps {
  scores: ScoreEntry[];
  onClear: () => void;
  onBack: () => void;
  theme: 'gameboy' | 'dark' | 'light';
}

export default function Leaderboard({ scores, onClear, onBack, theme }: LeaderboardProps) {
  const handleClear = () => {
    if (confirm("Are you sure you want to clear all high scores?")) {
      soundEffects.playClick();
      onClear();
    }
  };

  const handleBack = () => {
    soundEffects.playClick();
    onBack();
  };

  const borderClass = theme === 'gameboy' ? 'border-[#0f380f] bg-[#9bbc0f]' : theme === 'dark' ? 'border-purple-600 bg-zinc-900' : 'border-slate-800 bg-white';
  const textClass = theme === 'gameboy' ? 'text-[#0f380f]' : theme === 'dark' ? 'text-zinc-100' : 'text-slate-800';
  const headingClass = theme === 'gameboy' ? 'text-[#0f380f]' : theme === 'dark' ? 'text-yellow-400 font-bold' : 'text-blue-600 font-bold';
  const rowClass = (index: number) => {
    if (theme === 'gameboy') {
      return index % 2 === 0 ? 'bg-[#8bac0f]/20' : '';
    }
    return index % 2 === 0 ? 'bg-zinc-800/50 text-zinc-200' : 'text-zinc-400';
  };

  return (
    <div id="leaderboard-screen" className={`p-4 md:p-8 max-w-2xl mx-auto rounded-xl border-4 pixel-border shadow-2xl transition-all ${borderClass} ${textClass}`}>
      <h2 className={`font-retro text-sm md:text-lg text-center mb-6 uppercase tracking-widest ${headingClass}`}>
        ★ RANKING HALL OF FAME ★
      </h2>

      {scores.length === 0 ? (
        <div className="text-center py-12 font-retro text-xs opacity-60">
          NO RECORDS SAVED YET.<br />
          BE THE FIRST TO MAKE HISTORY!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs md:text-sm">
            <thead>
              <tr className={`border-b-2 font-retro text-[8px] md:text-[10px] pb-2 uppercase ${theme === 'gameboy' ? 'border-[#0f380f] text-[#0f380f]' : 'border-zinc-700 text-purple-400'}`}>
                <th className="py-2 px-1 text-center">RANK</th>
                <th className="py-2 px-2">TRAINER</th>
                <th className="py-2 px-2 text-center">LVL</th>
                <th className="py-2 px-2">PARTNER</th>
                <th className="py-2 px-2 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {scores.slice(0, 10).map((entry, index) => {
                let rankColor = '';
                if (theme !== 'gameboy') {
                  if (index === 0) rankColor = 'text-yellow-400 font-bold';
                  else if (index === 1) rankColor = 'text-slate-300 font-bold';
                  else if (index === 2) rankColor = 'text-amber-600 font-bold';
                }
                
                return (
                  <tr key={index} className={`border-b border-zinc-700/20 ${rowClass(index)}`}>
                    <td className={`py-3 px-1 text-center font-retro text-[10px] ${rankColor}`}>
                      #{index + 1}
                    </td>
                    <td className="py-3 px-2 font-retro text-[10px] truncate max-w-[120px] uppercase">
                      {entry.name || 'ANON'}
                    </td>
                    <td className="py-3 px-2 text-center font-mono">
                      {entry.level}
                    </td>
                    <td className="py-3 px-2 font-mono truncate max-w-[100px]">
                      {entry.pokemon}
                    </td>
                    <td className="py-3 px-2 text-right font-retro text-[10px] text-emerald-400">
                      {entry.score.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Button Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <button
          id="back-btn"
          onClick={handleBack}
          className={`font-retro text-xs py-3 px-8 rounded border-2 cursor-pointer font-bold transition-transform active:scale-95 select-none ${
            theme === 'gameboy' ? 'bg-[#0f380f] text-[#8bac0f] border-[#0f380f]' : 'bg-purple-600 text-white border-purple-500 hover:bg-purple-500'
          }`}
        >
          RETURN TO MAIN MENU
        </button>
        
        {scores.length > 0 && (
          <button
            id="clear-scores-btn"
            onClick={handleClear}
            className={`font-retro text-xs py-3 px-6 rounded border-2 cursor-pointer transition-colors select-none ${
              theme === 'gameboy' ? 'border-[#0f380f] text-[#0f380f]' : 'border-red-600 text-red-500 hover:bg-red-950/20'
            }`}
          >
            RESET LEADERBOARD
          </button>
        )}
      </div>
    </div>
  );
}
