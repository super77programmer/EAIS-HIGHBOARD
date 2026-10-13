const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const client = new Module(__filename);
const httpTest=new Module(__filename);httpTest._compile(ts.transpileModule(fs.readFileSync('lib/http.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,__filename);const normalRequire=client.require.bind(client);client.require=id=>id==='./http'?httpTest.exports:normalRequire(id);
client._compile(ts.transpileModule(fs.readFileSync('lib/community-client.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText, __filename);
const { communityFetch, peekCommunity, invalidateCommunity } = client.exports;
const originalNow = Date.now;
let now = originalNow(), calls = 0, status = 200;
Date.now = () => now;
global.fetch = async () => { calls++; return new Response(JSON.stringify({ messages: ['private'] }), { status }); };
(async () => {
  await Promise.all([communityFetch('/thread'), communityFetch('/thread')]);
  assert.equal(calls, 1, 'Concurrent consumers share a request');
  now += 31000;
  assert.deepEqual(peekCommunity('/thread').messages, ['private'], 'Reopening shows an in-memory snapshot after refresh TTL');
  await communityFetch('/thread');
  assert.equal(calls, 2, 'Snapshot does not suppress server refresh');
  invalidateCommunity();
  assert.equal(peekCommunity('/thread'), null, 'Sign-out invalidation removes private snapshots');
  await communityFetch('/thread');
  status = 403;
  await communityFetch('/thread', true);
  assert.equal(peekCommunity('/thread'), null, 'Revoked access removes cached history');
  status = 200;
  await communityFetch('/thread', true);
  now += 300001;
  assert.equal(peekCommunity('/thread'), null, 'Snapshots expire after five minutes');
  global.fetch=async()=>{calls++;return new Response('<!DOCTYPE html><h1>Sign in</h1>',{status:200,headers:{'content-type':'text/html'}})};
  await assert.rejects(communityFetch('/thread',true),/unexpected page/);assert.equal(peekCommunity('/thread'),null,'HTML pages cannot become inbox snapshots');
  const previousCalls=calls;await assert.rejects(communityFetch('/thread',true),/unexpected page/);assert.equal(calls,previousCalls+1,'Failed HTML requests can be retried');
  console.log('PASS: request deduplication, immediate reopen, background refresh, sign-out and access-revocation cache clearing.');
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => { Date.now = originalNow; });
