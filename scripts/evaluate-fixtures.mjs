#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { analyze, PROFILE_OPTIONS } from '../src/engine.ts';

const defaultFixture = new URL('../fixtures/logic-cases.json', import.meta.url);
const usage = `LogicLint fixture evaluator

Usage:
  npm run --silent evaluate
  npm run --silent evaluate -- --json
  npm run --silent evaluate -- path/to/fixtures.json`;

function fail(message) {
  process.stderr.write(`${message}\n\n${usage}\n`);
  process.exit(2);
}

function parseArgs(args) {
  let json = false;
  let fixture = defaultFixture;
  for (const arg of args) {
    if (arg === '--json') json = true;
    else if (arg === '--help' || arg === '-h') { process.stdout.write(`${usage}\n`); process.exit(0); }
    else if (arg.startsWith('-')) fail(`无法识别的选项：${arg}`);
    else if (fixture !== defaultFixture) fail('只能指定一个 fixture 文件。');
    else fixture = arg;
  }
  return { json, fixture };
}

function unique(values) {
  return [...new Set(values)];
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const fixtureText = await readFile(options.fixture, 'utf8');
  const fixture = JSON.parse(fixtureText);
  if (!Array.isArray(fixture.cases)) fail('fixture 必须包含 cases 数组。');

  const results = fixture.cases.map((testCase) => {
    if (!testCase.id || typeof testCase.text !== 'string') fail('每个 fixture case 都需要 id 和 text。');
    if (!PROFILE_OPTIONS.some((option) => option.id === testCase.profile)) fail(`${testCase.id} 使用了未知 profile：${testCase.profile}`);
    const analysis = analyze(testCase.text, testCase.profile);
    const detected = unique(analysis.issues.map((issue) => issue.kind));
    const expected = unique(testCase.expectedKinds ?? []);
    const forbidden = unique(testCase.forbiddenKinds ?? []);
    const missing = expected.filter((kind) => !detected.includes(kind));
    const forbiddenHits = forbidden.filter((kind) => detected.includes(kind));
    return { id: testCase.id, label: testCase.label ?? testCase.id, profile: testCase.profile, expected, forbidden, detected, missing, forbiddenHits, pass: missing.length === 0 && forbiddenHits.length === 0 };
  });

  const failed = results.filter((result) => !result.pass);
  const kinds = unique(results.flatMap((result) => [...result.expected, ...result.forbidden, ...result.detected])).sort();
  const byKind = Object.fromEntries(kinds.map((kind) => [kind, {
    expectedCases: results.filter((result) => result.expected.includes(kind)).length,
    detectedCases: results.filter((result) => result.detected.includes(kind)).length,
    forbiddenHits: results.filter((result) => result.forbiddenHits.includes(kind)).length,
  }]));
  const summary = { fixture: typeof options.fixture === 'string' ? options.fixture : 'fixtures/logic-cases.json', total: results.length, passed: results.length - failed.length, failed: failed.length, byKind, results };
  if (options.json) {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  } else {
    results.forEach((result) => {
      const status = result.pass ? 'PASS' : 'FAIL';
      const detected = result.detected.length > 0 ? result.detected.join(', ') : 'none';
      const details = result.pass ? '' : ` · missing=${result.missing.join(',') || 'none'} forbidden=${result.forbiddenHits.join(',') || 'none'}`;
      process.stdout.write(`${status} ${result.id} · detected=${detected}${details}\n`);
    });
    process.stdout.write(`\n${summary.passed}/${summary.total} fixture cases passed. This is a rule regression check, not a model accuracy benchmark.\n`);
    process.stdout.write('Rule counts are case counts only (expected / detected / forbidden hits):\n');
    Object.entries(byKind).forEach(([kind, counts]) => process.stdout.write(`  ${kind}: ${counts.expectedCases} / ${counts.detectedCases} / ${counts.forbiddenHits}\n`));
  }
  if (failed.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`评测失败：${message}\n`);
  process.exitCode = 1;
});
