import type { ReactNode } from "react";

export function EditorialPage({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro: string; children: ReactNode }) {
  return <main className="editorial-page"><header><p className="eyebrow"><span />{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header><article className="editorial-copy">{children}</article></main>;
}
