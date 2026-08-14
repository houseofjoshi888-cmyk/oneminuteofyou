export type RGB = [number, number, number];

export interface RoyalHouse {
  id: "peridot" | "ruby" | "sapphire" | "turquoise" | "gold";
  name: string;
  gemstone: string;
  motto: string;
  ornament: "arch" | "stars" | "lattice" | "lotus" | "sunburst";
  background: string;
  primary: string;
  secondary: string;
  palette: RGB[];
  titles: string[];
  subjects: string[];
  algorithm: "Crystal Growth" | "Flow Fields" | "Fractal Roots" | "Magnetic Nebula" | "Sacred Geometry";
}

export const ROYAL_HOUSES: readonly RoyalHouse[] = [
  { id: "peridot", name: "House of Peridot", gemstone: "Peridot", motto: "Stillness becomes life", ornament: "lattice", background: "#071003", primary: "#9dce2f", secondary: "#e7dc70", palette: [[157,206,47],[76,126,13],[194,239,88],[231,220,112],[225,255,167]], titles: ["Verdant","Luminous","Evergreen","Olive","Sacred"], subjects: ["Garden","Temple","Vine","Bloom","Sanctum"], algorithm: "Fractal Roots" },
  { id: "ruby", name: "House of Ruby", gemstone: "Ruby", motto: "Movement becomes fire", ornament: "arch", background: "#090308", primary: "#ff315f", secondary: "#f4b84f", palette: [[255,49,95],[151,12,48],[255,111,119],[244,184,79],[255,224,160]], titles: ["Crimson","Regal","Bloodlight","Ember","Scarlet"], subjects: ["Throne","Flame","Rose","Dynasty","Oath"], algorithm: "Crystal Growth" },
  { id: "sapphire", name: "House of Sapphire", gemstone: "Sapphire", motto: "Attention becomes infinity", ornament: "stars", background: "#020713", primary: "#3d7dff", secondary: "#69e4ff", palette: [[61,125,255],[34,60,180],[105,228,255],[124,107,255],[245,215,137]], titles: ["Azure","Celestial","Deepwater","Midnight","Stellar"], subjects: ["Crown","Tide","Vault","Star","Sceptre"], algorithm: "Flow Fields" },
  { id: "turquoise", name: "House of Turquoise", gemstone: "Turquoise", motto: "Gesture becomes current", ornament: "lotus", background: "#02100f", primary: "#21c8c6", secondary: "#8ee8d7", palette: [[33,200,198],[11,116,125],[80,232,220],[142,232,215],[235,207,126]], titles: ["Tidal","Mineral","Lagoon","Voyaging","Cerulean"], subjects: ["Current","Vein","Compass","Passage","Chamber"], algorithm: "Magnetic Nebula" },
  { id: "gold", name: "House of Gold", gemstone: "Golden Beryl", motto: "Time becomes legacy", ornament: "sunburst", background: "#0b0802", primary: "#f2c65c", secondary: "#fff0ac", palette: [[242,198,92],[176,112,24],[255,232,151],[255,153,65],[255,248,205]], titles: ["Gilded","Solar","Aureate","Radiant","Imperial"], subjects: ["Legacy","Diadem","Sun","Empire","Seal"], algorithm: "Sacred Geometry" },
] as const;

export function royalHouseFromWords(words: readonly number[]): RoyalHouse { return ROYAL_HOUSES[(words[3] >>> 0) % ROYAL_HOUSES.length]; }
export function royalHouseFromHash(hash: string): RoyalHouse { return ROYAL_HOUSES[Number.parseInt(hash.slice(24, 32), 16) % ROYAL_HOUSES.length]; }

export function royalRarity(_hash: string, behavioralScore = 0): { tier: string; score: number } {
  // Rarity is intentionally caused by the motion, never by a random mint roll.
  const score = Math.max(0, Math.min(99, Math.round(behavioralScore * 26)));
  const tier = score >= 97 ? "Crown Jewel" : score >= 88 ? "Imperial" : score >= 70 ? "Sovereign" : "Noble";
  return { tier, score };
}
