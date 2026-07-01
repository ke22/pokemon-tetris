/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 8-Bit Web Audio API Sound Synthesizer for Pokémon Tetris
 */

let audioCtx: AudioContext | null = null;
let bgmInterval: number | null = null;
let bgmEnabled = false;
let sfxEnabled = true;

export function setSfxEnabled(enable: boolean) {
  sfxEnabled = enable;
}

// Initialize Audio Context on user interaction
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Standard audio context
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Low-level helper to play a classic chip-synth beep
function playBeep(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.1, slideToFreq?: number, isBgm = false) {
  if (!isBgm && !sfxEnabled) return;

  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideToFreq, ctx.currentTime + duration);
    }

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error('Failed to play retro beep', e);
  }
}

// High-level retro sound effects
export const soundEffects = {
  playMove() {
    // Quick 8-bit short click
    playBeep(120, 0.05, 'triangle', 0.15, 80);
  },

  playRotate() {
    // Quick rising blip
    playBeep(240, 0.08, 'square', 0.1, 350);
  },

  playDrop() {
    // Fast sliding pitch down
    playBeep(200, 0.12, 'sawtooth', 0.08, 50);
  },

  playClick() {
    // Nice retro select beep
    playBeep(440, 0.06, 'square', 0.12, 660);
  },

  playClear(linesCount: number) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const time = ctx.currentTime;

    // Line clear chiptune arpeggio
    if (linesCount >= 4) {
      // Triumphant Tetris clear
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major scale arpeggio
      notes.forEach((freq, i) => {
        setTimeout(() => {
          playBeep(freq, 0.15, 'sawtooth', 0.12, freq * 1.05);
        }, i * 60);
      });
    } else {
      // Normal clear
      const notes = [329.63, 392.00, 523.25, 659.25];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          playBeep(freq, 0.12, 'square', 0.1, freq * 1.05);
        }, i * 70);
      });
    }
  },

  playLevelUp() {
    // Classic Pokemon level-up chime!
    const melody = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    melody.forEach((freq, i) => {
      setTimeout(() => {
        playBeep(freq, 0.15, 'square', 0.15, freq);
      }, i * 80);
    });
  },

  playEvolution() {
    // Pokémon evolution tension followed by success!
    const notes = [300, 310, 300, 310, 320, 330, 320, 330, 340, 350, 360, 370, 380, 400];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playBeep(freq, 0.1, 'sawtooth', 0.1, freq + 10);
      }, i * 90);
    });
    // Final evolve flourish!
    setTimeout(() => {
      const flourish = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
      flourish.forEach((freq, i) => {
        setTimeout(() => {
          playBeep(freq, 0.25, 'square', 0.15, freq + 20);
        }, i * 100);
      });
    }, notes.length * 90);
  },

  playGameOver() {
    // Descending sad retro tune
    const melody = [392.00, 370.00, 349.23, 311.13, 293.66, 261.63];
    melody.forEach((freq, i) => {
      setTimeout(() => {
        playBeep(freq, 0.25, 'sawtooth', 0.15, freq - 50);
      }, i * 140);
    });
  }
};

// Note frequencies mapping for BGM
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const G4 = 392.00;
const A4 = 440.00;
const B4 = 493.88;
const C5 = 523.25;

// 8-Bit Chiptune Background Music Loop (Synthesized dynamic Pokey-melody!)
// Plays a simplified version of the main Pokémon Theme / Retro A-Theme loop
const bgmNotes = [
  // Intro/verse: C4, G4, C4, G4, A4, G4, F4, G4...
  E4, G4, A4, G4, F4, G4, E4, C4,
  D4, F4, G4, F4, E4, D4, C4, D4,
  E4, G4, A4, B4, C5, B4, A4, G4,
  C5, B4, A4, G4, A4, B4, C5, C5
];

export function toggleBgm(enable: boolean) {
  bgmEnabled = enable;
  if (!enable) {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  if (bgmInterval) {
    clearInterval(bgmInterval);
  }

  let noteIndex = 0;
  
  // High-performance 8-bit square wave sequencer
  const bpm = 135;
  const beatDuration = 60 / bpm; // duration of one beat in seconds

  bgmInterval = window.setInterval(() => {
    if (!bgmEnabled) return;
    
    const freq = bgmNotes[noteIndex % bgmNotes.length];
    
    // Play slightly softer for BGM to avoid blocking game sfx
    playBeep(freq, beatDuration * 0.85, 'square', 0.03, undefined, true);
    
    noteIndex++;
  }, beatDuration * 1000);
}
