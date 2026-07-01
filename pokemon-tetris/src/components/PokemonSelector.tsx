/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PokemonSelector: starter Pokemon selection screen styled like Oak's Lab
 */

import React, { useState } from 'react';
import { POKEMON_CHARACTERS, PokemonPartner } from '../data/pokemon';
import PixelSprite from './PixelSprite';
import { soundEffects } from '../utils/audio';

interface PokemonSelectorProps {
  onSelect: (pokemon: PokemonPartner) => void;
  onBack: () => void;
  theme: 'gameboy' | 'dark' | 'light';
}

export default function PokemonSelector({ onSelect, onBack, theme }: PokemonSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedPokemon = POKEMON_CHARACTERS[selectedIndex];
  const initialForm = selectedPokemon.evolutions[0];

  const handlePrev = () => {
    soundEffects.playClick();
    setSelectedIndex((prev) => (prev === 0 ? POKEMON_CHARACTERS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    soundEffects.playClick();
    setSelectedIndex((prev) => (prev === POKEMON_CHARACTERS.length - 1 ? 0 : prev + 1));
  };

  const handleConfirm = () => {
    soundEffects.playEvolution(); // Evolution sound is nice and celebratory!
    onSelect(selectedPokemon);
  };

  // Theme-specific colors
  const borderClass = theme === 'gameboy' ? 'border-[#0f380f] bg-[#9bbc0f]' : theme === 'dark' ? 'border-purple-600 bg-zinc-900' : 'border-slate-800 bg-white';
  const textClass = theme === 'gameboy' ? 'text-[#0f380f]' : theme === 'dark' ? 'text-zinc-100' : 'text-slate-800';
  const headingClass = theme === 'gameboy' ? 'text-[#0f380f]' : theme === 'dark' ? 'text-yellow-400' : 'text-blue-600';
  const arrowBtnClass = theme === 'gameboy' ? 'bg-[#306230] text-[#8bac0f] border-[#0f380f]' : theme === 'dark' ? 'bg-purple-800 text-white border-purple-500 hover:bg-purple-700' : 'bg-slate-200 text-slate-800 border-slate-400 hover:bg-slate-300';
  const startBtnClass = theme === 'gameboy' ? 'bg-[#0f380f] text-[#8bac0f]' : theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-500 hover:scale-105' : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105';

  return (
    <div id="pokemon-selector" className={`p-4 md:p-8 max-w-2xl mx-auto rounded-xl border-4 pixel-border shadow-2xl transition-all ${borderClass} ${textClass}`}>
      <h2 className={`font-retro text-sm md:text-lg text-center mb-6 leading-relaxed uppercase tracking-tight ${headingClass}`}>
        Select Your Partner!
      </h2>

      {/* Professor Oak Intro text */}
      <div className={`p-3 rounded border-2 mb-6 font-sans text-xs md:text-sm leading-relaxed ${theme === 'gameboy' ? 'border-[#0f380f] bg-[#8bac0f]/30' : 'border-zinc-700 bg-zinc-800/40 text-zinc-300'}`}>
        <p className="font-retro text-[8px] md:text-[10px] mb-2 text-rose-500 uppercase">PROF. OAK:</p>
        "Welcome! Your partner Pokémon will level up as you clear rows. At Level 5 and 10, they will EVOLVE and enhance their special clearing abilities! Choose carefully!"
      </div>

      {/* Carousel */}
      <div className="flex flex-col items-center justify-center gap-6 mb-8">
        <div className="flex items-center justify-between w-full max-w-sm">
          <button
            id="prev-pokemon"
            onClick={handlePrev}
            className={`font-retro text-xs py-2 px-4 rounded border-2 cursor-pointer transition-transform active:scale-90 select-none ${arrowBtnClass}`}
          >
            &lt;
          </button>

          {/* Sprite Stage */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl border-4 border-dashed border-zinc-400/30 w-44 h-44 bg-zinc-950/20">
            <PixelSprite
              sprite={initialForm.sprite}
              pixelSize={8}
              animate="idle"
              className="mb-2"
              dexId={initialForm.dexId}
            />
            <div className={`font-retro text-xs text-center mt-3 uppercase ${selectedPokemon.textColor}`}>
              {initialForm.name}
            </div>
            <span className="text-[10px] opacity-65 font-sans mt-1">Type: {selectedPokemon.type}</span>
          </div>

          <button
            id="next-pokemon"
            onClick={handleNext}
            className={`font-retro text-xs py-2 px-4 rounded border-2 cursor-pointer transition-transform active:scale-90 select-none ${arrowBtnClass}`}
          >
            &gt;
          </button>
        </div>

        {/* Selected Details */}
        <div className={`w-full p-4 rounded border-2 text-left ${theme === 'gameboy' ? 'border-[#0f380f]' : 'border-zinc-700 bg-zinc-950/20'}`}>
          <div className="font-retro text-[10px] md:text-xs text-amber-500 uppercase mb-2">
            Ability: {initialForm.abilityName}
          </div>
          <p className="font-sans text-xs opacity-90 leading-relaxed text-zinc-300">
            {initialForm.abilityDescription}
          </p>

          <div className="border-t border-dashed border-zinc-600/30 my-3" />

          <div className="font-retro text-[9px] uppercase text-sky-400 mb-1">
            Evolution Path
          </div>
          <div className="font-sans text-xs opacity-75">
            {selectedPokemon.evolutions[0].name} (Lv.1) &rarr; {selectedPokemon.evolutions[1].name} (Lv.5) &rarr; {selectedPokemon.evolutions[2].name} (Lv.10)
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
        <button
          id="confirm-pokemon"
          onClick={handleConfirm}
          className={`font-retro text-xs md:text-sm py-3 px-8 rounded border-2 cursor-pointer font-bold select-none ${startBtnClass}`}
        >
          CHOOSE {selectedPokemon.name.toUpperCase()}!
        </button>
        <button
          id="back-to-title"
          onClick={onBack}
          className={`font-retro text-xs py-3 px-6 rounded border-2 cursor-pointer text-center select-none ${
            theme === 'gameboy' ? 'border-[#0f380f] text-[#0f380f]' : 'border-zinc-500 text-zinc-400 hover:text-white'
          }`}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
