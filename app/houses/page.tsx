/* eslint-disable @next/next/no-img-element -- Editorial House artwork is served directly by Sites. */
import Link from "next/link";
import {Brand} from "@/components/Brand";
import {SiteFooter} from "@/components/SiteFooter";
import {ROYAL_HOUSES} from "@/lib/houses";

export default function HousesPage(){return <main className="collection-page chain-page houses-page"><nav className="studio-nav"><Brand/><div className="collection-nav"><Link href="/gallery">GALLERY</Link><Link href="/my-collection">MY COLLECTION</Link><Link href="/generate">CREATE</Link></div></nav><header className="chain-hero houses-intro"><p className="eyebrow"><span/>THE ROYAL INDEX</p><h1>FIVE <em>HOUSES.</em></h1><p>Every movement seed enters one distinct mathematical universe. Explore each House and its verified works.</p></header><section className="house-dashboard-grid">{ROYAL_HOUSES.map(house=><Link href={`/houses/${house.id}`} key={house.id} style={{"--house-primary":house.primary,"--house-secondary":house.secondary} as React.CSSProperties}><div className="house-card-image"><img src={`/houses/${house.id}-royal-editorial.png`} alt={`${house.name} generative pattern`}/></div><div className="house-card-copy"><small>{house.gemstone.toUpperCase()}</small><h2>{house.name}</h2><p>{house.motto}.</p><span>{house.algorithm.toUpperCase()} ↗</span></div></Link>)}</section><SiteFooter/></main>}
