/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Pokémon Data, 8-Bit Pixel Sprites, and Tetrimino Configs
 */

export interface PokemonSprite {
  grid: string[];
  colors: Record<string, string>;
}

export interface PokemonEvolution {
  name: string;
  level: number;
  description: string;
  sprite: PokemonSprite;
  abilityName: string;
  abilityDescription: string;
  dexId: number;
}

export interface PokemonPartner {
  id: string;
  name: string;
  type: string;
  themeColor: string; // Tailwind color class or hex
  textColor: string;
  evolutions: PokemonEvolution[];
}

// Retro pixel art colors
const POKEMON_COLORS = {
  '.': 'transparent',
  'b': '#121212', // Black border
  'w': '#f6f6f6', // White
  'y': '#fbd73c', // Electric Yellow
  'y-dark': '#cfa512', // Darker shadow Yellow
  'r': '#e53935', // Fire Red
  'r-dark': '#b71c1c', // Dark red
  'g': '#4caf50', // Grass Green
  'g-dark': '#1b5e20', // Dark Green
  'u': '#2196f3', // Water Blue
  'u-dark': '#0d47a1', // Dark blue
  'p': '#9c27b0', // Psychic Purple
  'p-light': '#e040fb', // Light Purple
  'o': '#ff9800', // Orange
  'o-dark': '#e65100', // Dark Orange
  'br': '#795548', // Brown
  'br-light': '#a1887f', // Light Brown
  'pk': '#ff80ab', // Pink
  'pk-dark': '#f50057', // Dark Pink
  'gr': '#9e9e9e', // Grey
  'gr-dark': '#616161', // Dark Grey
  'fl': '#ffcc80', // Flesh / Pale Orange
};

// 12x12 Pixel grids for Pokemons in evolution stages
// 'b' = black/dark outline, other letters map to colors above

const pichuSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....bbbb....",
    "..bb..yybb..",
    ".b..yy..yyb.",
    ".b..ybybyyb.",
    "b.y.yyyyyy.b",
    "b.yywyyywyyb",
    "b.yyyybyyyyb",
    ".b.yyyrryyb.",
    "..b.yyyyyb..",
    "...bbbbbb...",
    "....bbbb....",
    "............"
  ]
};

const pikachuSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "..b......b..",
    ".byb....byb.",
    "byyb....byyb",
    "byyb....byyb",
    ".byyyyyyyyb.",
    "byybyyybyyyb",
    "byywywwyyyyb",
    "byyyyyyyyyyb",
    ".byyrrryyrb.",
    "..byyyyyyb..",
    "...byyyyb...",
    "....bbbb...."
  ]
};

const raichuSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....bbbbb...",
    "..bbooooobb.",
    ".byyooooooyb",
    "byyyyoooyyyb",
    "bbyywwywwybb",
    "b.yoooooooyb",
    "b.byyooyybyb",
    "b..byrrryb.b",
    "bb..byyyb..b",
    ".bb..bbb..b.",
    "..bbb...bb..",
    "............"
  ]
};

const charmanderSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....bbbb....",
    "..bboooobb..",
    ".byoooooooyb",
    "byywoooowyyb",
    "byyboooobyyb",
    "b.ooooooooyb",
    "b..byoooyb.b",
    ".b.byyyybyb.",
    "..b..bbbb...",
    "...b....b...",
    "....bbbbb...",
    "......rr...."
  ]
};

const charmeleonSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....bbbb....",
    "..bboooobb..",
    ".byoooroooyb",
    "byywoooroowb",
    "byybooorbbyb",
    "b.oooooroooy",
    "b..byyooyb.b",
    "b..byyyybyb.",
    ".bb.bbbbb.b.",
    "..b......b..",
    "..b.rrrr.b..",
    "...bb..bb..."
  ]
};

const charizardSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....bbbb....",
    "..bboooobb..",
    "ubyooooooybu",
    "uyywoooowyyu",
    "uyyboooobyyu",
    "u.ooooooooyb",
    "uu.byoooyb.u",
    "uu.byyyyby.u",
    "u..bbbbbb..u",
    "u.b.b..b.b.u",
    "ub..b..b..bu",
    "....b..b...."
  ]
};

const squirtleSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....bbbb....",
    "..bbuuuubb..",
    ".byuuuuuuyb.",
    "byywuuuuwwyb",
    "byybuuuubbyb",
    "b.uuuuuuuuyb",
    "b..buuuub..b",
    ".b.byyyybyb.",
    "..b.bbbb.b..",
    "...b.br.b...",
    "....bbbbb...",
    "............"
  ]
};

const wartortleSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "...ww..ww...",
    "..wwbbuuww..",
    "..bbuuuubb..",
    ".byuuuuuuyb.",
    "byywuuuuwwyb",
    "byybuuuubbyb",
    "b.uuuuuuuuyb",
    ".b.byyyybyb.",
    "..b.bbbb.b..",
    "...b.br.b...",
    "....bbbbb...",
    "............"
  ]
};

const blastoiseSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "gr..bbbb..gr",
    "grbbbuuubggr",
    ".bbuuuuubbb.",
    "byuuuuuuuuyb",
    "bywuuuuuuwyb",
    "bybuuuuuubyb",
    "b.uuuuuuuuyb",
    "b..buuuub..b",
    "bb.byyyybybb",
    ".b..bbbb..b.",
    "..bb....bb..",
    "............"
  ]
};

const bulbasaurSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....bbbb....",
    "..bbggggbb..",
    ".byggggggyb.",
    "byywggggwwyb",
    "byyrggggbbyb",
    "b.ggggggggyb",
    "b..bggggb..b",
    ".b.byyyybyb.",
    "..b.bbbb.b..",
    "...b....b...",
    "....bbbb....",
    "............"
  ]
};

const ivysaurSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    ".....rr.....",
    "....rrrr....",
    "..bbggggbb..",
    ".byggggggyb.",
    "byywggggwwyb",
    "byyrggggbbyb",
    "b.ggggggggyb",
    "b..bggggb..b",
    "bb.byyyybybb",
    ".b..bbbb..b.",
    "..bb....bb..",
    "............"
  ]
};

const venusaurSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....rrrr....",
    "..r rrr r...",
    "gr.bbggbb.gr",
    "gbbggggggybg",
    "bywggggggwyb",
    "byrggggggrby",
    "b.ggggggggyb",
    "b..bggggb..b",
    "bb.byyyybybb",
    ".b..bbbb..b.",
    "..bb....bb..",
    "............"
  ]
};

const eeveeSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "..b......b..",
    ".bbr....rbb.",
    "bbrr....rrbb",
    "byyrr..rryyb",
    ".byyyyyyyyb.",
    "byybyyybyyyb",
    "byywywwyyyyb",
    "byyyyyyyyyyb",
    ".byywwwyyyb.",
    "..byyyyyyb..",
    "...bwwwwb...",
    "....bbbb...."
  ]
};

const flareonSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....rrrr....",
    "..bbrrrryb..",
    ".byyooooyyb.",
    "byywoooowyyb",
    "byyboooobyyb",
    "b.ooooooooyb",
    "b..byoooyb.b",
    ".b.byyyybyb.",
    "..b.bbbb.b..",
    "...b.yy.b...",
    "....bbbb....",
    "............"
  ]
};

const jolteonSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "..y......y..",
    ".byb....byb.",
    "byyb....byyb",
    "byybywwybyyb",
    ".byyyyyyyyb.",
    "byybyyybyyyb",
    "byywywwyyyyb",
    "byyyyyyyyyyb",
    ".byywwwyyyb.",
    "..byyyyyyb..",
    "...byyyyb...",
    "....bbbb...."
  ]
};

const mewSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....bbbb....",
    "..bbpkkpbb..",
    ".bppppppppb.",
    "bppwppppwwpb",
    "bppippppibpb",
    "b.ppppppppib",
    "b..bppppb..b",
    ".b.bppppb.b.",
    "..b.bbbb.b..",
    "...b....b...",
    "....bbbb....",
    "............"
  ]
};

const mewtwoSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....bbbb....",
    "..bbpppbbb..",
    ".bppppppppb.",
    "bppwppppwwpb",
    "bppippppibpb",
    "b.ppppppppib",
    "b..bppppb..b",
    ".bb.bbbb.b..",
    "..b......b..",
    "..b.pppp.b..",
    "..b.ppppb...",
    "...bbbbb...."
  ]
};

const pokeballSprite: PokemonSprite = {
  colors: POKEMON_COLORS,
  grid: [
    "....bbbb....",
    "..bbrrrrbb..",
    ".bbrrrrrrbb.",
    "bbrrrrrrrrbb",
    "bbbbbbbbbbbb",
    "bbbwwbbwwbbb",
    "bbbwwbbwwbbb",
    "bbbbbbbbbbbb",
    "bbwwwwwwwwbb",
    ".bbwwwwwwbb.",
    "..bbwwwwbb..",
    "....bbbb...."
  ]
};

export const DECORATIVE_SPRITES = {
  pokeball: pokeballSprite,
};

// Pokémon characters configurations
export const POKEMON_CHARACTERS: PokemonPartner[] = [
  {
    id: "pikachu",
    name: "Pikachu",
    type: "Electric",
    themeColor: "from-yellow-400 to-amber-500",
    textColor: "text-yellow-400",
    evolutions: [
      {
        name: "Pichu",
        level: 1,
        description: "Small baby electric mouse. High tension but cute!",
        sprite: pichuSprite,
        abilityName: "Static Charge",
        abilityDescription: "Triggers a pulse that charges a random full row with lightning, immediately vaporizing it.",
        dexId: 172
      },
      {
        name: "Pikachu",
        level: 5,
        description: "An iconic electric mouse Pokemon. Super popular!",
        sprite: pikachuSprite,
        abilityName: "Thunderbolt",
        abilityDescription: "Unleashes a powerful thunder strike that instantly vaporizes the 2 lowest rows of the board.",
        dexId: 25
      },
      {
        name: "Raichu",
        level: 10,
        description: "The fully evolved electric mouse. Power level is maxed!",
        sprite: raichuSprite,
        abilityName: "Thunder",
        abilityDescription: "Thunderstorms clear 3 bottom rows and give 500 bonus points!",
        dexId: 26
      }
    ]
  },
  {
    id: "charmander",
    name: "Charmander",
    type: "Fire",
    themeColor: "from-orange-500 to-red-600",
    textColor: "text-orange-500",
    evolutions: [
      {
        name: "Charmander",
        level: 1,
        description: "A cute fire lizard. The flame on its tail burns bright.",
        sprite: charmanderSprite,
        abilityName: "Ember",
        abilityDescription: "Melts away 3 random single blocks from the board.",
        dexId: 4
      },
      {
        name: "Charmeleon",
        level: 5,
        description: "Tough fire dinosaur. Loves fighting!",
        sprite: charmeleonSprite,
        abilityName: "Flame Burst",
        abilityDescription: "Melts away 8 random single blocks and clears any floating block tiles!",
        dexId: 5
      },
      {
        name: "Charizard",
        level: 10,
        description: "An incredibly powerful flying dragon-like Pokemon.",
        sprite: charizardSprite,
        abilityName: "Seismic Toss",
        abilityDescription: "Clears a 4x4 block of tiles in the center of the board, sorting remaining tiles down.",
        dexId: 6
      }
    ]
  },
  {
    id: "squirtle",
    name: "Squirtle",
    type: "Water",
    themeColor: "from-sky-400 to-blue-500",
    textColor: "text-sky-400",
    evolutions: [
      {
        name: "Squirtle",
        level: 1,
        description: "Water turtle Pokemon with a shell that protects it.",
        sprite: squirtleSprite,
        abilityName: "Water Gun",
        abilityDescription: "Pushes all blocks downwards to fill 3 random air holes underneath!",
        dexId: 7
      },
      {
        name: "Wartortle",
        level: 5,
        description: "Tough water turtle with elegant furry ears and tail.",
        sprite: wartortleSprite,
        abilityName: "Bubble Beam",
        abilityDescription: "Pushes all blocks downwards to fill 6 empty air holes and closes the gaps!",
        dexId: 8
      },
      {
        name: "Blastoise",
        level: 10,
        description: "Massive shell turtle with dual water cannons.",
        sprite: blastoiseSprite,
        abilityName: "Hydro Pump",
        abilityDescription: "Completely reorganizes and compresses the board downwards, closing all air pockets.",
        dexId: 9
      }
    ]
  },
  {
    id: "bulbasaur",
    name: "Bulbasaur",
    type: "Grass",
    themeColor: "from-emerald-400 to-teal-500",
    textColor: "text-emerald-400",
    evolutions: [
      {
        name: "Bulbasaur",
        level: 1,
        description: "A seed Pokemon with a bulb on its back.",
        sprite: bulbasaurSprite,
        abilityName: "Vine Whip",
        abilityDescription: "Slices down the central 2 vertical columns, clearing all blocks in them.",
        dexId: 1
      },
      {
        name: "Ivysaur",
        level: 5,
        description: "The bulb on its back has grown into a rosebud.",
        sprite: ivysaurSprite,
        abilityName: "Razor Leaf",
        abilityDescription: "Slices through 3 vertical columns, clearing all blocks, and awards double points for next lines.",
        dexId: 2
      },
      {
        name: "Venusaur",
        level: 10,
        description: "A gigantic dinosaur with a fully blossomed palm flower.",
        sprite: venusaurSprite,
        abilityName: "Solar Beam",
        abilityDescription: "Vaporizes a massive grid of blocks (clears 4 columns and 2 rows) and triggers a 2x level speed slow-down!",
        dexId: 3
      }
    ]
  },
  {
    id: "eevee",
    name: "Eevee",
    type: "Normal",
    themeColor: "from-amber-600 to-yellow-700",
    textColor: "text-amber-500",
    evolutions: [
      {
        name: "Eevee",
        level: 1,
        description: "Adaptable Pokemon with multiple potential evolution paths.",
        sprite: eeveeSprite,
        abilityName: "Swift",
        abilityDescription: "Gives 300 instant bonus points and clears 1 random row.",
        dexId: 133
      },
      {
        name: "Flareon",
        level: 5,
        description: "Fluffy flame Pokemon evolved using a Fire Stone.",
        sprite: flareonSprite,
        abilityName: "Fire Spin",
        abilityDescription: "Removes all isolated single blocks from the board completely.",
        dexId: 136
      },
      {
        name: "Jolteon",
        level: 10,
        description: "Spiky electric Pokemon evolved using a Thunder Stone.",
        sprite: jolteonSprite,
        abilityName: "Zap Cannon",
        abilityDescription: "Clears the bottom row, and transforms all falling blocks into simple 2x2 yellow O-blocks for the next 3 pieces!",
        dexId: 135
      }
    ]
  },
  {
    id: "mew",
    name: "Mew",
    type: "Psychic",
    themeColor: "from-pink-400 to-purple-500",
    textColor: "text-pink-400",
    evolutions: [
      {
        name: "Mew",
        level: 1,
        description: "A rare and mythical Psychic Pokemon. Capable of learning any move.",
        sprite: mewSprite,
        abilityName: "Teleport",
        abilityDescription: "Swaps the currently falling Tetrimino with a simple 1x4 straight I-bar!",
        dexId: 151
      },
      {
        name: "Mew",
        level: 5,
        description: "Psychic power grows stronger. It's playing around playfully.",
        sprite: mewSprite,
        abilityName: "Metronome",
        abilityDescription: "Triggers a random fully evolved ability from any other Pokemon character!",
        dexId: 151
      },
      {
        name: "Mewtwo",
        level: 10,
        description: "The ultimate genetic Psychic Pokemon. Overwhelming psychic presence.",
        sprite: mewtwoSprite,
        abilityName: "Psystrike",
        abilityDescription: "Instantly clears half the blocks on the board (targeting top blocks) to reduce the pile height by 50%!",
        dexId: 150
      }
    ]
  }
];

// Classic Tetrimino Configurations & Styles
export type TetriminoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Tetrimino {
  type: TetriminoType;
  shape: number[][]; // 2D array representation
  color: string;     // Tailwind hex or CSS color
  bgColor: string;   // Tailwind class for drawing preview
  borderColor: string;
  name: string;      // Pokemon-themed block name
}

export const TETRIMINOS: Record<TetriminoType, Tetrimino> = {
  I: {
    type: 'I',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f0f0', // Sky Blue / Squirtle Water
    bgColor: 'bg-cyan-400',
    borderColor: 'border-cyan-600',
    name: 'Water Spray'
  },
  O: {
    type: 'O',
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000', // Pikachu Yellow
    bgColor: 'bg-yellow-400',
    borderColor: 'border-yellow-600',
    name: 'Thunder Shock'
  },
  T: {
    type: 'T',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#a000f0', // Mew Purple
    bgColor: 'bg-purple-500',
    borderColor: 'border-purple-700',
    name: 'Psy Wave'
  },
  S: {
    type: 'S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#00f000', // Bulbasaur Green
    bgColor: 'bg-green-500',
    borderColor: 'border-green-700',
    name: 'Vine Whip'
  },
  Z: {
    type: 'Z',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#f00000', // Charmander Fire
    bgColor: 'bg-red-500',
    borderColor: 'border-red-700',
    name: 'Flame Singe'
  },
  J: {
    type: 'J',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#0000f0', // Deep Blue
    bgColor: 'bg-blue-600',
    borderColor: 'border-blue-800',
    name: 'Bubble Splash'
  },
  L: {
    type: 'L',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#f0a000', // Fire Orange
    bgColor: 'bg-orange-500',
    borderColor: 'border-orange-600',
    name: 'Lava Melt'
  }
};
