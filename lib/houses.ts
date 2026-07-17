export type RGB = [number, number, number];

export interface RoyalHouse {
  id: "ruby" | "sapphire" | "emerald" | "amethyst" | "gold";
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
}

export const ROYAL_HOUSES: readonly RoyalHouse[] = [
  { id: "ruby", name: "House of Ruby", gemstone: "Ruby", motto: "Movement becomes fire", ornament: "arch", background: "#090308", primary: "#ff315f", secondary: "#f4b84f", palette: [[255,49,95],[151,12,48],[255,111,119],[244,184,79],[255,224,160]], titles: ["Crimson","Regal","Bloodlight","Ember","Scarlet"], subjects: ["Throne","Flame","Rose","Dynasty","Oath"] },
  { id: "sapphire", name: "House of Sapphire", gemstone: "Sapphire", motto: "Attention becomes infinity", ornament: "stars", background: "#020713", primary: "#3d7dff", secondary: "#69e4ff", palette: [[61,125,255],[34,60,180],[105,228,255],[124,107,255],[245,215,137]], titles: ["Azure","Celestial","Deepwater","Midnight","Stellar"], subjects: ["Crown","Tide","Vault","Star","Sceptre"] },
  { id: "emerald", name: "House of Emerald", gemstone: "Emerald", motto: "Stillness becomes life", ornament: "lattice", background: "#020c09", primary: "#20c987", secondary: "#d6bd65", palette: [[32,201,135],[6,111,78],[92,239,177],[214,189,101],[180,255,220]], titles: ["Verdant","Secret","Evergreen","Jade","Sacred"], subjects: ["Garden","Temple","Vine","Bloom","Sanctum"] },
  { id: "amethyst", name: "House of Amethyst", gemstone: "Amethyst", motto: "Gesture becomes myth", ornament: "lotus", background: "#090411", primary: "#a36cff", secondary: "#ff75c8", palette: [[163,108,255],[91,47,184],[255,117,200],[127,218,255],[245,208,137]], titles: ["Violet","Mystic","Velvet","Oracle","Dreaming"], subjects: ["Reverie","Veil","Halo","Prophecy","Chamber"] },
  { id: "gold", name: "House of Gold", gemstone: "Golden Beryl", motto: "Time becomes legacy", ornament: "sunburst", background: "#0b0802", primary: "#f2c65c", secondary: "#fff0ac", palette: [[242,198,92],[176,112,24],[255,232,151],[255,153,65],[255,248,205]], titles: ["Gilded","Solar","Aureate","Radiant","Imperial"], subjects: ["Legacy","Diadem","Sun","Empire","Seal"] },
] as const;

export function royalHouseFromWords(words: readonly number[]): RoyalHouse { return ROYAL_HOUSES[(words[3] >>> 0) % ROYAL_HOUSES.length]; }
export function royalHouseFromHash(hash: string): RoyalHouse { return ROYAL_HOUSES[Number.parseInt(hash.slice(24, 32), 16) % ROYAL_HOUSES.length]; }

export function royalRarity(hash: string, behavioralScore = 0): { tier: string; score: number } {
  const score = (Number.parseInt(hash.slice(-8), 16) + Math.round(behavioralScore * 997)) % 100;
  const tier = score >= 97 ? "Crown Jewel" : score >= 88 ? "Imperial" : score >= 70 ? "Sovereign" : "Noble";
  return { tier, score };
}
