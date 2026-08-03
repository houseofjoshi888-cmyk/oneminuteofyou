export type InteractionKind = "move" | "down" | "up";

export interface InteractionPoint {
  x: number;
  y: number;
  t: number;
  pressure: number;
  kind: InteractionKind;
  pointer: string;
}

export interface Recording {
  version: 1;
  durationMs: number;
  width: number;
  height: number;
  points: InteractionPoint[];
}

export function normalizedPoint(event: PointerEvent, rect: DOMRect, startedAt: number, kind: InteractionKind): InteractionPoint {
  return {
    x: Math.round(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * 100000) / 100000,
    y: Math.round(Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) * 100000) / 100000,
    t: Math.max(0, Math.round(performance.now() - startedAt)),
    pressure: Math.round((event.pressure || (kind === "down" ? 0.5 : 0)) * 1000) / 1000,
    kind,
    pointer: event.pointerType || "mouse",
  };
}

export function createRecording(points: InteractionPoint[], durationMs: number, width: number, height: number): Recording {
  return { version: 1, durationMs: Math.round(durationMs), width: Math.round(width), height: Math.round(height), points };
}
