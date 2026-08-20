import { MuseumMode } from "@/components/MuseumMode";

export function generateStaticParams() { return Array.from({ length: 5_200 }, (_, index) => ({ tokenId: String(index + 1) })); }
export default async function ArtworkPage({ params }: { params: Promise<{ tokenId: string }> }) { const { tokenId } = await params; return <MuseumMode tokenId={Number(tokenId)} />; }
