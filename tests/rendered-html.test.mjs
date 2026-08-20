import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished collection homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>One Minute of You<\/title>/i);
  assert.match(html, /Your movement/);
  assert.match(html, /Made visible/);
  assert.match(html, /Begin your minute/);
  assert.match(html, /Royal Houses/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Codex is working/i);
});

test("serves every product route", async () => {
  for (const pathname of ["/generate", "/mint", "/collection", "/legal", "/staking", "/artwork/1"]) {
    const response = await render(pathname);
    assert.equal(response.status, 200, `${pathname} should render`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  }
});

test("locks collection administration and treasury policy in the contract source", async () => {
  const contract = await readFile(new URL("../contracts/OneMinuteOfYou.sol", import.meta.url), "utf8");
  assert.match(contract, /ADMIN_WALLET\s*=\s*0x69Bf308E5e30158072Cf9d2c6DE7b86F5Ae2f9B4/);
  assert.match(contract, /HOUSE_WALLET\s*=\s*payable\(0x6736d2eA9807297F0e56967361B9410854B86a5f\)/);
  assert.match(contract, /ROYALTY_BPS\s*=\s*700/);
  assert.match(contract, /MAX_SUPPLY\s*=\s*5_200/);
  assert.match(contract, /MINT_PRICE\s*=\s*0\.025 ether/);
  assert.match(contract, /function airdrop[\s\S]*onlyOwner/);
  assert.match(contract, /function withdraw\(\) external onlyOwner/);
  assert.match(contract, /block\.timestamp < mintStart/);
  assert.match(contract, /mapping\(bytes32 => bool\) public seedMinted/);
  assert.match(contract, /HOUSE_WALLET\.call\{value:\s*amount\}/);
  assert.doesNotMatch(contract, /withdraw\(address payable recipient\)/);
});

test("keeps deterministic NFT guarantees, direct reveal, and global wallet access", async () => {
  const [simulation, seed, generate, provider, museum] = await Promise.all([
    readFile(new URL("../lib/simulation.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/seed.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/generate/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/providers.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/MuseumMode.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(simulation, /particleCount:\s*100_000/);
  assert.match(seed, /SHA-256/);
  assert.match(generate, /YOUR ONE-OF-ONE NFT/);
  assert.doesNotMatch(generate, /Prepare royal edition|SeedReveal/);
  assert.doesNotMatch(museum, /museumRecord/);
  assert.match(provider, /WalletProviders/);
});
