import { MuseumMode } from "@/components/MuseumMode";

export default async function ArtworkPage({ params }: { params: Promise<{ tokenId: string }> }) { const { tokenId } = await params; return <MuseumMode tokenId={Number(tokenId)} />; }
