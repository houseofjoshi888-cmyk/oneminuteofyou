export function ProvenanceSeal({ hash }: { hash: string; primary: string; secondary: string }) {
  return <div className="provenance-seal provenance-record" aria-label={`SHA-256 provenance ${hash.slice(0,8)}`}><div className="provenance-mark">#</div><div><small>SHA-256 PROVENANCE</small><strong>{hash.slice(0,8).toUpperCase()}</strong><span>{hash.match(/.{1,16}/g)?.join(" · ")}</span></div></div>;
}
