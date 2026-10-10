export type Profile = 'balanced' | 'logic' | 'technical';
export type Severity = 'high' | 'medium' | 'low';
export type IssueKind = 'evidence' | 'causal' | 'drift' | 'vague' | 'pronoun' | 'duplicate' | 'paragraph' | 'number' | 'reference' | 'tone';
export type BlockKind = 'paragraph' | 'heading' | 'list' | 'quote' | 'code';
export type ParagraphRole = 'claim' | 'evidence' | 'bridge' | 'mixed' | 'neutral';

export interface TextSpan {
  start: number;
  end: number;
  text: string;
}

export interface DocumentBlock {
  index: number;
  kind: BlockKind;
  text: string;
  start: number;
  end: number;
  lineStart: number;
  lineEnd: number;
  sentences: string[];
  role: ParagraphRole;
  issues: Issue[];
}

export interface Issue {
  id: string;
  blockIndex: number;
  kind: IssueKind;
  severity: Severity;
  confidence: number;
  label: string;
  title: string;
  detail: string;
  suggestion: string;
  why: string;
  source: string;
  spans: TextSpan[];
}

export interface AnalysisMetrics {
  blocks: number;
  paragraphs: number;
  headings: number;
  lists: number;
  claims: number;
  evidence: number;
  bridges: number;
  cited: number;
  words: number;
}

export interface Analysis {
  version: '0.2';
  profile: Profile;
  score: number;
  paragraphs: DocumentBlock[];
  blocks: DocumentBlock[];
  issues: Issue[];
  metrics: AnalysisMetrics;
}

export interface ProfileOption {
  id: Profile;
  label: string;
  description: string;
}

export const PROFILE_OPTIONS: ProfileOption[] = [
  { id: 'balanced', label: '逻辑 + 表达', description: '观点、依据、推理和表达信号' },
  { id: 'logic', label: '只看逻辑', description: '只保留论证关系和段落结构' },
  { id: 'technical', label: '技术文档', description: '额外关注数字、引用和文档结构' },
];

const STOP_WORDS = new Set('我们 你们 他们 这个 那个 以及 但是 因为 所以 如果 可以 需要 进行 实现 通过 对于 其中 相关 一个 一种 已经 将会 目前 项目 系统 用户 产品 方案 这里 这是 以及 由于'.split(' '));
const CLAIM_WORDS = ['能够', '可以', '应该', '需要', '计划', '值得', '证明', '说明', '表明', '有效', '可行', '解决', '提升', '改善', '保证', '意味着', '因此', '所以', '导致', '结论', '建议', '认为'];
const EVIDENCE_WORDS = ['测试', '结果', '数据', '样本', '日志', '指标', '用户', '反馈', '实验', '对照', '记录', '覆盖', '观察', '测量', '报告', '基线', '来源', '引用'];
const BRIDGE_WORDS = ['因为', '由于', '因此', '所以', '从而', '导致', '说明', '表明', '意味着', '换言之', '也就是说', '基于', '根据'];
const PRONOUN_WORDS = ['这', '它', '其', '该', '上述', '这一', '这些', '那些'];
const VAGUE_WORDS = ['显著', '明显', '积极', '先进', '智能', '高效', '全面', '充分', '极大', '持续', '进一步', '赋能', '降本增效', '比较不错', '大规模', '体验变好', '始终稳定', '一键', '无缝'];
const TONE_PATTERNS = ['不是', '而是', '让我们', '值得注意的是', '总的来说', '归根结底', '从某种意义上说', '不难看出', '无疑', '综上所述', '在当今', '随着\S{0,12}不断'];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function hasAny(value: string, words: string[]): boolean {
  return words.some((word) => value.includes(word));
}

function matches(value: string, words: string[]): TextSpan[] {
  const spans: TextSpan[] = [];
  words.forEach((word) => {
    const expression = word.includes('\\S') ? new RegExp(word, 'g') : new RegExp(escapeRegExp(word), 'g');
    for (const match of value.matchAll(expression)) {
      const start = match.index ?? 0;
      spans.push({ start, end: start + match[0].length, text: match[0] });
    }
  });
  return spans.sort((a, b) => a.start - b.start || b.end - a.end);
}

function meaningfulTokens(value: string): string[] {
  return (value.match(/[\u4e00-\u9fff]{2,}|[A-Za-z]{3,}|\d+(?:\.\d+)?%?/g) ?? [])
    .map((token) => token.toLowerCase())
    .filter((token) => !STOP_WORDS.has(token));
}

function splitSentences(value: string): string[] {
  return value.match(/[^。！？!?；;.!?]+[。！？!?；;.!?]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
}

function classifyLine(line: string): BlockKind {
  if (/^\s*```/.test(line)) return 'code';
  if (/^\s*#{1,6}\s+/.test(line)) return 'heading';
  if (/^\s*>/.test(line)) return 'quote';
  if (/^\s*(?:[-*+]\s+|\d+[.)]\s+)/.test(line)) return 'list';
  return 'paragraph';
}

function parseBlocks(value: string): DocumentBlock[] {
  const normalized = value.replace(/\r\n?/g, '\n');
  if (!normalized.trim()) return [];

  const lines = normalized.split('\n');
  const blocks: DocumentBlock[] = [];
  let offset = 0;
  let start = 0;
  let lineStart = 1;
  let pending: string[] = [];
  let pendingKind: BlockKind = 'paragraph';
  let inCode = false;

  const flush = (_endOffset: number, endLine: number) => {
    const rawText = pending.join('\n');
    const text = rawText.trim();
    if (!text) {
      pending = [];
      return;
    }
    const leadingTrim = rawText.length - rawText.trimStart().length;
    blocks.push({ index: blocks.length, kind: pendingKind, text, start: start + leadingTrim, end: start + leadingTrim + text.length, lineStart, lineEnd: endLine, sentences: [], role: 'neutral', issues: [] });
    pending = [];
  };

  lines.forEach((line, lineIndex) => {
    const blank = line.trim() === '';
    const lineKind = classifyLine(line);
    const nextOffset = offset + line.length;
    if (lineKind === 'code' && !inCode) {
      if (pending.length > 0) flush(offset, lineIndex);
      inCode = true;
      start = offset;
      lineStart = lineIndex + 1;
      pendingKind = 'code';
      pending.push(line);
    } else if (inCode) {
      pending.push(line);
      if (lineKind === 'code' && pending.length > 1) {
        flush(nextOffset, lineIndex + 1);
        inCode = false;
      }
    } else if (blank) {
      flush(offset, lineIndex);
    } else if (pending.length === 0) {
      start = offset;
      lineStart = lineIndex + 1;
      pendingKind = lineKind;
      pending.push(line);
    } else if (pendingKind === 'heading' || pendingKind !== lineKind && lineKind === 'heading') {
      flush(offset, lineIndex);
      start = offset;
      lineStart = lineIndex + 1;
      pendingKind = lineKind;
      pending.push(line);
    } else {
      pending.push(line);
    }
    offset = nextOffset + 1;
  });
  flush(normalized.length, lines.length);
  return blocks;
}

function roleFor(text: string): ParagraphRole {
  const hasClaim = hasAny(text, CLAIM_WORDS) || /(?:计划|建议|应该|需要)\s*[^。！？!?；;]+/.test(text);
  const hasEvidence = hasAny(text, EVIDENCE_WORDS) || /\d/.test(text);
  const hasBridge = hasAny(text, BRIDGE_WORDS);
  const count = Number(hasClaim) + Number(hasEvidence) + Number(hasBridge);
  if (count > 1) return 'mixed';
  if (hasEvidence) return 'evidence';
  if (hasBridge) return 'bridge';
  if (hasClaim) return 'claim';
  return 'neutral';
}

function overlap(left: string[], right: string[]): number {
  const a = new Set(left);
  const b = new Set(right);
  if (a.size === 0 || b.size === 0) return 0;
  const common = [...a].filter((token) => b.has(token)).length;
  return common / Math.max(1, Math.min(a.size, b.size));
}

function sourceFor(kind: IssueKind): string {
  if (kind === 'paragraph' || kind === 'number' || kind === 'reference') return '阮一峰《中文技术文档的写作规范》';
  if (kind === 'drift') return '阮一峰段落原则 · Google Technical Writing One';
  if (kind === 'vague' || kind === 'tone') return 'Humanizer 的 26 类表达信号（改写为人工复核提示）';
  return 'LogicLint 论证关系规则';
}

function addIssue(target: Issue[], blockIndex: number, kind: IssueKind, severity: Severity, confidence: number, label: string, title: string, detail: string, suggestion: string, why: string, spans: TextSpan[]): void {
  target.push({ id: `${kind}-${blockIndex}-${target.length}`, blockIndex, kind, severity, confidence, label, title, detail, suggestion, why, source: sourceFor(kind), spans: spans.slice(0, 6) });
}

function analyzeBlock(block: DocumentBlock, profile: Profile, allIssues: Issue[], previousClaims: Array<{ blockIndex: number; tokens: string[] }>): void {
  if (block.kind === 'code' || block.kind === 'heading') return;
  const text = block.text;
  const sentences = splitSentences(text);
  block.sentences = sentences;
  block.role = roleFor(text);
  const hasClaim = block.role === 'claim' || block.role === 'bridge' || block.role === 'mixed';
  const hasEvidence = block.role === 'evidence' || block.role === 'mixed';
  const hasBridge = hasAny(text, BRIDGE_WORDS);
  const add = (kind: IssueKind, severity: Severity, confidence: number, label: string, title: string, detail: string, suggestion: string, why: string, spans: TextSpan[]) => {
    addIssue(allIssues, block.index, kind, severity, confidence, label, title, detail, suggestion, why, spans);
    block.issues.push(allIssues[allIssues.length - 1]);
  };

  if (hasClaim && !hasEvidence && (sentences.length <= 2 || hasBridge)) {
    add('evidence', 'high', 0.9, '依据缺口', '结论先到了，依据还没出现', '这段用了结论或行动词，但读者找不到可以核验的样本、指标或观察对象。', '补一个具体对象：测了什么、和谁比、结果是多少？', '观点需要至少一个可核验的事实、例子或限制条件来支撑。', matches(text, CLAIM_WORDS));
  }

  if (hasBridge && !hasEvidence) {
    add('causal', 'high', 0.88, '推理跳步', '桥接词把两件事直接连上了', '“因此 / 所以 / 说明”后面给出了结论，但中间少了能解释关系的事实或条件。', '把中间那一步写出来：这个事实为什么足以支持后面的判断？', '因果词本身不是证据；它只告诉读者作者认为两件事有关。', matches(text, BRIDGE_WORDS));
  }

  if (profile !== 'logic') {
    const vagueSpans = matches(text, VAGUE_WORDS);
    if (vagueSpans.length > 0) {
      add('vague', 'medium', 0.78, '表达信号', `“${unique(vagueSpans.map((span) => span.text)).slice(0, 2).join('、')}”需要落地`, '这些词表达了方向，却没有说明范围、指标或限制条件。', '替换成可观察的动作或数字，必要时补充边界。', 'Humanizer 将类似表达视为“信号”，不是错误；这里保留原文，只提醒作者做一次具体化检查。', vagueSpans);
    }
    const toneSpans = matches(text, TONE_PATTERNS);
    if (toneSpans.length > 0) {
      add('tone', 'low', 0.66, '模板化表达', `发现“${toneSpans[0].text}”一类铺垫`, '这类句式可能在强调重要性，却没有增加事实。单独出现不代表文本有问题。', '试着直接说事实或结论，把铺垫删掉后比较信息是否变少。', 'Humanizer 建议对单一信号保持克制，只有多处同类表达同时出现时才值得重写。', toneSpans);
    }
  }

  const firstSentence = sentences[0] ?? text;
  const pronounSpans = matches(firstSentence, PRONOUN_WORDS).filter((span) => span.start < 3);
  if (pronounSpans.length > 0) {
    add('pronoun', 'low', 0.72, '指代不明', `“${pronounSpans[0].text}”没有明确指向`, '句子一开始就使用代词，读者还没有足够上下文判断它指的是哪个对象。', '把代词换成名词，或把它放到已经出现过的对象之后。', '技术文档和方案需要让读者无需回读就知道每个代词指向什么。', pronounSpans);
  }

  if (sentences.length >= 3 || text.length > 180) {
    const firstTokens = meaningfulTokens(firstSentence);
    const detached = sentences.slice(1).filter((sentence) => overlap(firstTokens, meaningfulTokens(sentence)) < 0.15);
    if (detached.length >= 1) {
      add('drift', 'medium', 0.74, '段落结构', '这段可能承载了多个主题', '前后句没有共享足够的关键名词，读者需要自己猜它们为什么放在同一段。', '让段首中心句覆盖后面的句子，或拆成两个段落并补上关系。', '阮一峰和 Google 的段落建议都强调单段单主题，并把中心句放在段首。', sentences.slice(1).flatMap((sentence) => matches(text, meaningfulTokens(sentence).slice(0, 2))).slice(0, 4));
    }
  }

  if (profile === 'technical') {
    const unformattedNumberSpans = [...text.matchAll(/(?<![\d,])\d{4,}(?![\d,])/g)].map((match) => ({ start: match.index ?? 0, end: (match.index ?? 0) + match[0].length, text: match[0] }));
    if (unformattedNumberSpans.length > 0) {
      add('number', 'low', 0.84, '数字格式', '这个数字可能需要千分号或单位', '四位以上的数字最好统一格式，避免读者误读数量级。', '考虑写成 1,000，或补充明确的单位和比较基线。', '阮一峰规范建议四位以上数字使用千分号，并把单位写清楚。', unformattedNumberSpans);
    }
    const rangeSpans = [...text.matchAll(/\d+\s*[-~～—]\s*\d+(?!\s*(?:%|元|人|次|ms|秒|分钟|小时|天))/g)].map((match) => ({ start: match.index ?? 0, end: (match.index ?? 0) + match[0].length, text: match[0] }));
    if (rangeSpans.length > 0) {
      add('number', 'low', 0.76, '数字范围', '范围两端可能缺少单位', '范围表达如果只有一端带单位，读者容易不确定两边的量纲。', '让范围两端都带上单位，例如 67%～89%。', '阮一峰规范建议范围两端都标明单位或百分号。', rangeSpans);
    }
    const referenceSpans = matches(text, ['据', '来源', '引用', '研究', '官方']).filter((span) => span.start < text.length - 1);
    if (referenceSpans.length > 0 && !/https?:\/\/|\[[^\]]+\]\([^)]*\)|参考文献|脚注/.test(text)) {
      add('reference', 'medium', 0.68, '引用缺口', '提到了来源，但没有留下可追溯链接', '这段借用了研究、报告或官方信息，却没有给读者一个可以回看的出处。', '补一个链接、文献名或明确的来源说明。', '技术文档规范要求第三方内容标明出处，引用应当能被读者追溯。', referenceSpans);
    }
  }

  const claimTokens = meaningfulTokens(firstSentence).slice(0, 8);
  if (claimTokens.length >= 3 && hasClaim) {
    const previous = previousClaims.find((candidate) => overlap(candidate.tokens, claimTokens) >= 0.72);
    if (previous) {
      add('duplicate', 'low', 0.71, '结论重复', '前面已经说过相近的结论', `这段的开头和第 ${previous.blockIndex + 1} 段使用了相近的关键词，但没有明显增加新的依据。`, '保留一次结论，把新增信息改成证据、限制或下一步。', '重复结论会占用读者注意力，也会让证据与结论的对应关系变得模糊。', matches(text, claimTokens.slice(0, 3)));
    } else {
      previousClaims.push({ blockIndex: block.index, tokens: claimTokens });
    }
  }
}

export function analyze(value: string, profile: Profile = 'balanced'): Analysis {
  const blocks = parseBlocks(value);
  const issues: Issue[] = [];
  const previousClaims: Array<{ blockIndex: number; tokens: string[] }> = [];
  blocks.forEach((block) => analyzeBlock(block, profile, issues, previousClaims));

  const paragraphs = blocks.filter((block) => block.kind === 'paragraph' || block.kind === 'quote' || block.kind === 'list');
  const metrics: AnalysisMetrics = {
    blocks: blocks.length,
    paragraphs: paragraphs.length,
    headings: blocks.filter((block) => block.kind === 'heading').length,
    lists: blocks.filter((block) => block.kind === 'list').length,
    claims: paragraphs.filter((block) => ['claim', 'bridge', 'mixed'].includes(block.role)).length,
    evidence: paragraphs.filter((block) => ['evidence', 'mixed'].includes(block.role)).length,
    bridges: paragraphs.filter((block) => hasAny(block.text, BRIDGE_WORDS)).length,
    cited: paragraphs.filter((block) => /https?:\/\/|\[[^\]]+\]\([^)]*\)|来源|引用|参考文献/.test(block.text)).length,
    words: meaningfulTokens(value).length,
  };
  const penalty = issues.reduce((sum, issue) => sum + (issue.severity === 'high' ? 13 : issue.severity === 'medium' ? 8 : 4) * issue.confidence, 0);
  const score = blocks.length === 0 ? 0 : Math.max(35, Math.min(98, Math.round(100 - penalty)));
  return { version: '0.2', profile, score, paragraphs, blocks, issues, metrics };
}
