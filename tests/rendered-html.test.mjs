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
  for (const pathname of ["/generate", "/mint"]) {
    const response = await render(pathname);
    assert.equal(response.status, 200, `${pathname} should render`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  }
});

test("keeps deterministic NFT guarantees in source", async () => {
  const [simulation, seed, mint, provider] = await Promise.all([
    readFile(new URL("../lib/simulation.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/seed.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/mint/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/providers.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(simulation, /particleCount:\s*100_000/);
  assert.match(seed, /SHA-256/);
  assert.match(mint, /4096/);
  assert.match(mint, /try\s*\{/);
  assert.doesNotMatch(provider, /WalletProviders|wagmi|rainbow/i);
});
