#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { analyze, createReport, PROFILE_OPTIONS } from '../src/engine.ts';

const usage = `LogicLint CLI

Usage:
  npm run --silent logiclint -- [options] [file]
  cat draft.md | npm run --silent logiclint -- --json -

Options:
  --json                  Print the versioned JSON report
  --profile <profile>    balanced, logic, or technical
  --help                 Show this help

With no file, LogicLint reads stdin when stdin is piped. It never edits the input file.`;

function fail(message, code = 2) {
  process.stderr.write(`${message}\n\n${usage}\n`);
  process.exit(code);
}

function parseArgs(args) {
  let json = false;
  let profile = 'balanced';
  let source = null;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(`${usage}\n`);
      process.exit(0);
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--profile' || arg === '-p') {
      profile = args[index + 1];
      index += 1;
      if (!profile) fail('--profile 需要一个值。');
      continue;
    }
    if (arg.startsWith('--profile=')) {
      profile = arg.slice('--profile='.length);
      if (!profile) fail('--profile 需要一个值。');
      continue;
    }
    if (arg !== '-' && arg.startsWith('-')) fail(`无法识别的选项：${arg}`);
    if (source) fail(`只能检查一个输入文件，收到：${arg}`);
    source = arg;
  }

  if (!PROFILE_OPTIONS.some((option) => option.id === profile)) {
    fail(`未知检查模式：${profile}。可选值：${PROFILE_OPTIONS.map((option) => option.id).join('、')}`);
  }
  return { json, profile, source };
}

async function readStdin() {
  let value = '';
  for await (const chunk of process.stdin.setEncoding('utf8')) value += chunk;
  return value;
}

async function readSource(source) {
  if (source && source !== '-') return { text: await readFile(source, 'utf8'), label: source };
  if (process.stdin.isTTY) fail('没有输入文本。请传入文件路径，或通过 stdin 管道输入 Markdown。');
  return { text: await readStdin(), label: 'stdin' };
}

function humanReport(report) {
  const { analysis } = report;
  const profile = PROFILE_OPTIONS.find((option) => option.id === analysis.profile);
  const lines = [
    `LogicLint v${analysis.version} · ${report.source}`,
    `得分 ${analysis.score}/100 · ${profile?.label ?? analysis.profile} · ${analysis.issues.length} 条提示`,
    `结构：${analysis.metrics.paragraphs} 段 · ${analysis.metrics.claims} 个观点 · ${analysis.metrics.evidence} 个依据 · ${analysis.metrics.bridges} 个桥接词`,
  ];
  const priority = { high: 0, medium: 1, low: 2 };
  const issues = [...analysis.issues].sort((left, right) => priority[left.severity] - priority[right.severity] || right.confidence - left.confidence);
  if (issues.length === 0) {
    lines.push('', '没有检测到规则提示。仍建议人工通读。');
    return lines.join('\n');
  }
  lines.push('', '需要回看：');
  issues.forEach((issue) => {
    const hit = issue.spans.map((span) => span.text).join(' · ') || '结构信号';
    lines.push(`P${issue.blockIndex + 1} [${issue.severity} · ${Math.round(issue.confidence * 100)}%] ${issue.label}：${issue.title}`);
    lines.push(`  命中：${hit}`);
    lines.push(`  建议：${issue.suggestion}`);
  });
  return lines.join('\n');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = await readSource(options.source);
  const report = createReport(analyze(input.text, options.profile), input.label);
  process.stdout.write(`${options.json ? JSON.stringify(report, null, 2) : humanReport(report)}\n`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`读取输入失败：${message}\n`);
  process.exitCode = 1;
});
