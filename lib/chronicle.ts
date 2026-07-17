import type { InteractionFeatures } from "./analyzer";
import type { RoyalHouse } from "./houses";

export interface RoyalChronicle {
  title: string;
  legend: string;
  omen: string;
  decree: string;
}

const arrivals = ["at the velvet hour", "beneath a silent crown", "as the last bell faded", "under a wandering star", "when the palace clocks stood still"];
const gestures = ["a ribbon of light", "an unbroken constellation", "a secret royal cartography", "a bright and restless sigil", "a path no court had witnessed"];
const omens = ["The Returning Star", "The Open Gate", "The Gilded Comet", "The Sleeping Rose", "The Crown in Motion", "The Unwritten Orbit"];
const decrees = ["Let no second be repeated.", "What moved once shall remain singular.", "The hand remembers what time forgets.", "Every gesture is a kingdom.", "The minute is sealed; the legend begins."];

function pick<T>(values: readonly T[], hash: string, offset: number): T {
  return values[Number.parseInt(hash.slice(offset, offset + 4), 16) % values.length];
}

export function royalChronicle(hash: string, features: InteractionFeatures, house: RoyalHouse, artwork: string): RoyalChronicle {
  const pace = features.averageSpeed > 0.5 ? "swift" : features.pauses > 4 ? "contemplative" : "measured";
  const texture = features.directionEntropy > 2.5 ? "many-minded" : features.averageCurvature > 1 ? "spiralling" : "clear";
  const witnesses = Math.max(1, features.taps + 1);
  return {
    title: `The Chronicle of ${artwork}`,
    legend: `${pick(arrivals, hash, 8)}, a ${pace} traveller entered ${house.name} and drew ${pick(gestures, hash, 20)} through its halls. The court counted ${witnesses} celestial ${witnesses === 1 ? "witness" : "witnesses"}; the royal archivists named the motion ${texture}, and sealed it in ${house.gemstone.toLowerCase()} light.`,
    omen: pick(omens, hash, 40),
    decree: pick(decrees, hash, 52),
  };
}
