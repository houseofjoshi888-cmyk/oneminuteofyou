interface CountdownProps { remainingMs: number; active: boolean; }
export function Countdown({ remainingMs, active }: CountdownProps) {
  if (!active) return null;
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  return <div className="countdown" aria-live="polite"><strong>{String(seconds).padStart(2, "0")}</strong><span>SECONDS REMAIN</span></div>;
}
