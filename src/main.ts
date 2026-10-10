import { createIcons, FileText, Github, Play, RotateCcw, Sparkles, Target, Trash2, WandSparkles } from 'lucide';
import './styles.css';

type Severity = 'high' | 'medium' | 'low';
type IssueKind = 'evidence' | 'causal' | 'drift' | 'vague' | 'pronoun' | 'duplicate';

interface Issue {
  id: string;
  paragraphIndex: number;
  kind: IssueKind;
  severity: Severity;
  label: string;
  title: string;
  detail: string;
  suggestion: string;
}

interface ParagraphResult {
  index: number;
  text: string;
  sentences: string[];
  role: 'claim' | 'evidence' | 'bridge' | 'mixed';
  issues: Issue[];
}

interface Analysis {
  paragraphs: ParagraphResult[];
  issues: Issue[];
  score: number;
  claims: number;
  evidence: number;
  bridges: number;
}

interface Example {
  title: string;
  eyebrow: string;
  text: string;
}

const examples: Example[] = [
  {
    title: 'Agent 方案',
    eyebrow: '故意留有逻辑缺口',
    text: `我们计划上线一个多智能体客服系统。这个方案能够显著提升效率，帮助团队实现降本增效，因此值得马上推广。

系统会把问题分给多个 Agent，再由主 Agent 汇总答案。由于使用了先进的模型，用户体验会明显变好，整个流程也会更加智能。

我们已经验证了这个方向是可行的。测试结果很好，说明产品具备大规模上线的条件。不过目前没有记录具体的测试样本、失败案例和人工复核标准。

另外，客服团队需要先学习新的工作方式。这意味着项目上线后大家会更高效。它可以解决历史遗留问题，也能进一步赋能业务增长。`,
  },
  {
    title: '产品复盘',
    eyebrow: '适合检查复盘结论',
    text: `本次活动整体表现不错，用户反馈也比较积极。我们因此认为新的推荐策略是有效的。

活动期间新增注册用户 12,400 人，较上期增长 18%。转化率从 3.1% 升到 3.8%，但样本只覆盖周末两天，且没有拆分自然流量与投放流量。

下一步应该继续扩大投放规模。这个结论还需要补充成本、留存和不同渠道的对照数据，否则很难判断增长来自策略还是流量结构变化。`,
  },
  {
    title: '技术文档',
    eyebrow: '适合检查步骤与因果',
    text: `为了让服务更稳定，我们将缓存时间调整为五分钟。部署完成后错误率下降了，因此这个改动解决了稳定性问题。

当缓存失效时，请求会直接访问数据库。这里需要注意，数据库连接池必须保持在合理范围内，否则会出现新的瓶颈。

如果发现接口变慢，可以适当增加缓存。这样能够保证系统始终稳定，并且可以全面提升所有用户的访问体验。`,
  },
];

const STOP_WORDS = new Set('我们 你们 他们 这个 那个 以及 但是 因为 所以 如果 可以 需要 进行 实现 通过 对于 其中 相关 一个 一种 已经 将会 目前 项目 系统 用户 产品 方案'.split(' '));
const VAGUE_WORDS = ['显著', '明显', '积极', '先进', '智能', '高效', '全面', '充分', '极大', '持续', '进一步', '赋能', '降本增效', '比较不错', '大规模', '体验变好', '始终稳定'];
const CLAIM_WORDS = ['能够', '可以', '值得', '证明', '说明', '表明', '有效', '可行', '解决', '提升', '改善', '保证', '意味着', '因此', '所以', '导致', '结论'];
const EVIDENCE_WORDS = ['测试', '结果', '数据', '样本', '日志', '指标', '用户', '反馈', '实验', '对照', '记录', '覆盖', '%', '人', '次', 'ms', '秒'];
const BRIDGE_WORDS = ['因为', '由于', '因此', '所以', '从而', '导致', '说明', '表明', '意味着', '换言之', '也就是说'];
const PRONOUN_WORDS = ['这', '它', '其', '该', '上述', '这一'];

const sample = examples[0];

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="./" aria-label="LogicLint 首页">
        <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
        <span>LOGIC<span class="brand-accent">LINT</span></span>
      </a>
      <div class="topbar-meta">
        <span class="release-tag">v0.1 playground</span>
        <span class="topbar-divider" aria-hidden="true"></span>
        <a href="https://github.com/LKRCharon/logiclint" target="_blank" rel="noreferrer" class="icon-link" aria-label="在 GitHub 查看 LogicLint" data-tooltip="GitHub"><i data-lucide="github"></i></a>
      </div>
    </header>

    <main>
      <section class="intro-band" aria-labelledby="page-title">
        <div class="intro-copy">
          <div class="kicker"><span class="status-dot"></span> BROWSER-ONLY · NO API KEY</div>
          <h1 id="page-title">给 AI 输出<br /><em>跑一次逻辑单测。</em></h1>
          <p>LogicLint 把段落、观点、依据和推理桥接拆开检查。先找出哪里没说清楚，再决定怎么改。</p>
        </div>
        <div class="intro-note">
          <span class="note-label">本次检查</span>
          <strong>启发式提示</strong>
          <span>结果用于定位风险，不能替代人工判断。</span>
        </div>
      </section>

      <section class="workbench" aria-label="LogicLint 工作台">
        <section class="panel editor-panel" aria-labelledby="editor-title">
          <div class="panel-head">
            <div>
              <div class="eyebrow">01 / INPUT</div>
              <h2 id="editor-title">放入一段文字</h2>
            </div>
            <div class="editor-actions">
              <label class="select-wrap" for="example-select">
                <span class="sr-only">选择示例</span>
                <select id="example-select" aria-label="选择示例"></select>
              </label>
              <button class="text-button" id="clear-button" type="button"><i data-lucide="trash-2"></i> 清空</button>
            </div>
          </div>
          <div class="editor-frame">
            <div class="editor-gutter" id="editor-gutter" aria-hidden="true"></div>
            <textarea id="text-input" spellcheck="false" aria-label="待检查的文本"></textarea>
          </div>
          <div class="editor-foot">
            <span id="char-count">0 字</span>
            <span class="keyboard-hint"><kbd>⌘</kbd><span>↵</span> 检查</span>
          </div>
          <button class="run-button" id="run-button" type="button"><i data-lucide="play"></i><span>检查逻辑</span><kbd>⌘ ↵</kbd></button>
          <div class="sample-strip">
            <i data-lucide="sparkles"></i>
            <span>不知道从哪里开始？载入一个带问题的示例，看看它是怎么被拆开的。</span>
          </div>
        </section>

        <section class="panel results-panel" aria-labelledby="results-title">
          <div class="panel-head results-head">
            <div>
              <div class="eyebrow">02 / REPORT</div>
              <h2 id="results-title">逻辑报告</h2>
            </div>
            <span class="run-state" id="run-state"><span class="state-dot"></span> 已检查</span>
          </div>
          <div class="score-row">
            <div class="score-number"><span id="score-value">--</span><small>/ 100</small></div>
            <div class="score-copy"><strong id="score-label">等待文本</strong><span id="score-description">载入一段文字后开始检查</span></div>
          </div>
          <div class="score-track" aria-hidden="true"><span id="score-track-fill"></span></div>
          <div class="metric-grid" aria-label="检查指标">
            <div class="metric"><span>段落</span><strong id="paragraph-count">0</strong></div>
            <div class="metric"><span>观点</span><strong id="claim-count">0</strong></div>
            <div class="metric"><span>依据</span><strong id="evidence-count">0</strong></div>
            <div class="metric"><span>桥接词</span><strong id="bridge-count">0</strong></div>
          </div>
          <div class="section-rule"></div>
          <div class="issues-heading"><h3>需要回看的地方</h3><span id="issue-count">0 个提示</span></div>
          <div class="issues-list" id="issues-list" aria-live="polite"></div>
          <div class="empty-results" id="empty-results" hidden>
            <i data-lucide="target"></i>
            <strong>还没有检查结果</strong>
            <span>把文本放进左侧，报告会在这里出现。</span>
          </div>
        </section>
      </section>

      <section class="lower-grid">
        <section class="panel source-panel" aria-labelledby="source-title">
          <div class="panel-head compact-head">
            <div><div class="eyebrow">03 / TRACE</div><h2 id="source-title">逐段定位</h2></div>
            <span class="panel-meta">点击提示可跳到这里</span>
          </div>
          <div class="source-preview" id="source-preview"></div>
        </section>
        <section class="panel map-panel" aria-labelledby="map-title">
          <div class="panel-head compact-head">
            <div><div class="eyebrow">04 / MAP</div><h2 id="map-title">论证关系</h2></div>
            <span class="panel-meta">claim → evidence → bridge</span>
          </div>
          <div class="argument-map" id="argument-map"></div>
          <div class="map-legend"><span><i class="legend-dot claim-dot"></i>观点</span><span><i class="legend-dot evidence-dot"></i>依据</span><span><i class="legend-dot bridge-dot"></i>桥接</span></div>
        </section>
      </section>
    </main>

    <footer class="footer">
      <span>LogicLint 是一个公开的早期实验项目。</span>
      <a href="https://github.com/LKRCharon/logiclint" target="_blank" rel="noreferrer">在 GitHub 参与迭代 <i data-lucide="github"></i></a>
    </footer>
  </div>
`;

createIcons({ icons: { FileText, Github, Play, RotateCcw, Sparkles, Target, Trash2, WandSparkles } });

function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing UI element: ${selector}`);
  return element;
}

const input = getElement<HTMLTextAreaElement>('#text-input');
const exampleSelect = getElement<HTMLSelectElement>('#example-select');
const runButton = getElement<HTMLButtonElement>('#run-button');
const clearButton = getElement<HTMLButtonElement>('#clear-button');
const charCount = getElement<HTMLSpanElement>('#char-count');
const editorGutter = getElement<HTMLDivElement>('#editor-gutter');
const issuesList = getElement<HTMLDivElement>('#issues-list');
const emptyResults = getElement<HTMLDivElement>('#empty-results');
const sourcePreview = getElement<HTMLDivElement>('#source-preview');
const argumentMap = getElement<HTMLDivElement>('#argument-map');
const scoreValue = getElement<HTMLSpanElement>('#score-value');
const scoreLabel = getElement<HTMLElement>('#score-label');
const scoreDescription = getElement<HTMLSpanElement>('#score-description');
const scoreFill = getElement<HTMLSpanElement>('#score-track-fill');
const issueCount = getElement<HTMLSpanElement>('#issue-count');
const paragraphCount = getElement<HTMLSpanElement>('#paragraph-count');
const claimCount = getElement<HTMLSpanElement>('#claim-count');
const evidenceCount = getElement<HTMLSpanElement>('#evidence-count');
const bridgeCount = getElement<HTMLSpanElement>('#bridge-count');
const runState = getElement<HTMLSpanElement>('#run-state');

examples.forEach((item, index) => {
  const option = document.createElement('option');
  option.value = String(index);
  option.textContent = `${item.title} · ${item.eyebrow}`;
  exampleSelect.append(option);
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function meaningfulTokens(value: string): string[] {
  return (value.match(/[\u4e00-\u9fff]{2,}|[A-Za-z]{3,}|\d+(?:\.\d+)?%?/g) ?? [])
    .map((token) => token.toLowerCase())
    .filter((token) => !STOP_WORDS.has(token));
}

function hasAny(value: string, words: string[]): boolean {
  return words.some((word) => value.includes(word));
}

function splitParagraphs(value: string): string[] {
  return value
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function splitSentences(value: string): string[] {
  return value.split(/(?<=[。！？!?；;])/).map((sentence) => sentence.trim()).filter(Boolean);
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function analyze(value: string): Analysis {
  const texts = splitParagraphs(value);
  const issues: Issue[] = [];
  const paragraphs: ParagraphResult[] = [];
  const seenClaims = new Map<string, number>();

  texts.forEach((text, index) => {
    const sentences = splitSentences(text);
    const firstSentence = sentences[0] ?? text;
    const hasClaim = hasAny(text, CLAIM_WORDS) || /[。！？]$/.test(text);
    const hasEvidence = hasAny(text, EVIDENCE_WORDS) || /\d/.test(text);
    const hasBridge = hasAny(text, BRIDGE_WORDS);
    const hasConcreteSubject = meaningfulTokens(text).length >= 4;
    const role: ParagraphResult['role'] = hasEvidence && hasBridge ? 'mixed' : hasEvidence ? 'evidence' : hasClaim && hasBridge ? 'bridge' : 'claim';
    const paragraphIssues: Issue[] = [];

    const addIssue = (kind: IssueKind, severity: Severity, label: string, title: string, detail: string, suggestion: string) => {
      const issue: Issue = { id: `${kind}-${index}-${paragraphIssues.length}`, paragraphIndex: index, kind, severity, label, title, detail, suggestion };
      paragraphIssues.push(issue);
      issues.push(issue);
    };

    if (hasClaim && !hasEvidence && (sentences.length === 1 || hasAny(text, ['因此', '所以', '说明', '表明', '值得', '有效', '可行']))) {
      addIssue('evidence', 'high', '依据缺口', '结论先到了，依据还没出现', '这段用了“因此 / 有效 / 可行”一类结论词，但读者找不到可以核验的样本、指标或观察对象。', '补一个具体对象：测了什么、和谁比、结果是多少？');
    }

    if (hasBridge && !hasAny(text, ['因为', '由于', '基于', '根据', '实验', '数据', '结果', '样本', '日志', '对照'])) {
      addIssue('causal', 'high', '推理跳步', '桥接词把两件事直接连上了', '“因此 / 所以 / 说明”后面给出了结论，但中间少了能解释关系的事实或条件。', '把中间那一步写出来：这个事实为什么足以支持后面的判断？');
    }

    const vagueHits = unique(VAGUE_WORDS.filter((word) => text.includes(word)));
    if (vagueHits.length > 0) {
      addIssue('vague', 'medium', '空泛表达', `“${vagueHits.slice(0, 2).join('、')}”需要落地`, `这些词表达了方向，却没有说明范围、指标或限制条件。`, '替换成可观察的动作或数字，必要时补充边界。');
    }

    const pronounHits = unique(PRONOUN_WORDS.filter((word) => new RegExp(`(^|[。！？!?；;])\\s*${escapeRegExp(word)}`).test(text)));
    if (pronounHits.length > 0 && index === 0) {
      addIssue('pronoun', 'low', '指代不明', `“${pronounHits[0]}”没有明确指向`, '段首直接使用代词，读者还没有足够上下文判断它指的是哪个对象。', '把代词换成名词，或把它放到已经出现过的对象之后。');
    }

    if (sentences.length >= 3) {
      const firstTokens = new Set(meaningfulTokens(firstSentence));
      const overlaps = sentences.slice(1).map((sentence) => {
        const tokens = meaningfulTokens(sentence);
        return tokens.filter((token) => firstTokens.has(token)).length;
      });
      if (hasConcreteSubject && overlaps.filter((count) => count === 0).length >= 2) {
        addIssue('drift', 'medium', '主题漂移', '这段里混了两个以上的主题', '前后句没有共享足够的关键名词，读者需要自己猜它们为什么放在同一段。', '拆成两个段落，或在转折处补一句主题关系。');
      }
    }

    const claimTokens = meaningfulTokens(firstSentence).slice(0, 6).join('|');
    if (claimTokens.length > 8) {
      const previous = seenClaims.get(claimTokens);
      if (previous !== undefined) {
        addIssue('duplicate', 'low', '结论重复', '前面已经说过相近的结论', `这段的开头和第 ${previous + 1} 段使用了相近的关键词，但没有增加新的依据。`, '保留一次结论，把新增信息改成证据、限制或下一步。');
      } else {
        seenClaims.set(claimTokens, index);
      }
    }

    paragraphs.push({ index, text, sentences, role, issues: paragraphIssues });
  });

  const claims = paragraphs.filter((paragraph) => paragraph.role === 'claim' || paragraph.role === 'bridge' || paragraph.role === 'mixed').length;
  const evidence = paragraphs.filter((paragraph) => paragraph.role === 'evidence' || paragraph.role === 'mixed').length;
  const bridges = paragraphs.filter((paragraph) => paragraph.role === 'bridge' || paragraph.role === 'mixed' || hasAny(paragraph.text, BRIDGE_WORDS)).length;
  const penalty = issues.reduce((sum, issue) => sum + (issue.severity === 'high' ? 13 : issue.severity === 'medium' ? 8 : 4), 0);
  const score = texts.length === 0 ? 0 : Math.max(38, Math.min(98, 100 - penalty));

  return { paragraphs, issues, score, claims, evidence, bridges };
}

function updateGutter(): void {
  const count = Math.max(1, input.value.split('\n').length);
  editorGutter.innerHTML = Array.from({ length: count }, (_, index) => `<span>${String(index + 1).padStart(2, '0')}</span>`).join('');
  charCount.textContent = `${input.value.replace(/\s/g, '').length.toLocaleString('zh-CN')} 字`;
}

function roleLabel(role: ParagraphResult['role']): string {
  return role === 'evidence' ? '依据' : role === 'bridge' ? '桥接' : role === 'mixed' ? '混合' : '观点';
}

function renderIssues(analysis: Analysis): void {
  issuesList.innerHTML = '';
  issueCount.textContent = `${analysis.issues.length} 个提示`;
  emptyResults.hidden = analysis.issues.length > 0;
  if (analysis.issues.length === 0) {
    const clear = document.createElement('div');
    clear.className = 'all-clear';
    clear.innerHTML = '<span class="all-clear-icon">✓</span><strong>暂时没有明显缺口</strong><span>仍建议人工通读，启发式检查只负责提醒。</span>';
    issuesList.append(clear);
    return;
  }

  analysis.issues.forEach((issue) => {
    const item = document.createElement('article');
    item.className = `issue-item severity-${issue.severity}`;
    item.innerHTML = `<div class="issue-topline"><span class="issue-label"><i class="issue-icon"></i>${issue.label}</span><span class="issue-location">P${issue.paragraphIndex + 1}</span></div><h4>${issue.title}</h4><p>${issue.detail}</p><div class="issue-suggestion"><span>建议</span>${issue.suggestion}</div><button class="locate-button" type="button" data-paragraph="${issue.paragraphIndex}">定位原文 <span aria-hidden="true">↗</span></button>`;
    item.querySelector<HTMLButtonElement>('.locate-button')?.addEventListener('click', () => focusParagraph(issue.paragraphIndex));
    issuesList.append(item);
  });
}

function renderSource(analysis: Analysis): void {
  sourcePreview.innerHTML = '';
  if (analysis.paragraphs.length === 0) {
    sourcePreview.innerHTML = '<div class="source-empty">检查结果会按段落显示在这里。</div>';
    return;
  }
  analysis.paragraphs.forEach((paragraph) => {
    const item = document.createElement('article');
    item.className = `source-item ${paragraph.issues.length > 0 ? 'has-issues' : ''}`;
    item.id = `paragraph-${paragraph.index}`;
    const issueSummary = paragraph.issues.length > 0 ? `<span class="source-issues">${paragraph.issues.length} 个提示</span>` : '<span class="source-ok">结构清楚</span>';
    item.innerHTML = `<div class="source-index">P${String(paragraph.index + 1).padStart(2, '0')}</div><div class="source-body"><div class="source-meta"><span class="role-pill role-${paragraph.role}">${roleLabel(paragraph.role)}</span>${issueSummary}</div><p></p></div>`;
    item.querySelector('p')!.textContent = paragraph.text;
    sourcePreview.append(item);
  });
}

function renderMap(analysis: Analysis): void {
  argumentMap.innerHTML = '';
  const firstClaim = analysis.paragraphs.find((paragraph) => paragraph.role === 'claim' || paragraph.role === 'bridge' || paragraph.role === 'mixed');
  const firstEvidence = analysis.paragraphs.find((paragraph) => paragraph.role === 'evidence' || paragraph.role === 'mixed');
  const firstBridge = analysis.paragraphs.find((paragraph) => paragraph.role === 'bridge' || paragraph.role === 'mixed' || hasAny(paragraph.text, BRIDGE_WORDS));
  const nodes = [
    { type: 'claim', label: '观点', text: firstClaim ? `P${firstClaim.index + 1} · ${firstClaim.sentences[0]?.slice(0, 32) ?? ''}` : '等待观点' },
    { type: 'evidence', label: '依据', text: firstEvidence ? `P${firstEvidence.index + 1} · ${firstEvidence.sentences[0]?.slice(0, 32) ?? ''}` : '还没有具体依据' },
    { type: 'bridge', label: '桥接', text: firstBridge ? `P${firstBridge.index + 1} · ${hasAny(firstBridge.text, BRIDGE_WORDS) ? '发现因果或结论连接词' : '需要补充推理步骤'}` : '等待推理关系' },
  ];
  const map = document.createElement('div');
  map.className = 'map-flow';
  nodes.forEach((node, index) => {
    const card = document.createElement('button');
    card.className = `map-node map-${node.type}`;
    card.type = 'button';
    card.innerHTML = `<span class="map-node-label">${node.label}</span><strong></strong>`;
    card.querySelector('strong')!.textContent = node.text;
    const target = node.type === 'claim' ? firstClaim : node.type === 'evidence' ? firstEvidence : firstBridge;
    if (target) card.addEventListener('click', () => focusParagraph(target.index));
    map.append(card);
    if (index < nodes.length - 1) {
      const arrow = document.createElement('span');
      arrow.className = 'map-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      map.append(arrow);
    }
  });
  argumentMap.append(map);
}

function renderAnalysis(analysis: Analysis): void {
  scoreValue.textContent = analysis.score === 0 ? '--' : String(analysis.score);
  scoreFill.style.width = `${analysis.score}%`;
  scoreFill.dataset.score = String(analysis.score);
  scoreLabel.textContent = analysis.score >= 85 ? '结构基本稳' : analysis.score >= 65 ? '有几处要补' : '建议重看推理';
  scoreDescription.textContent = analysis.issues.length === 0 ? '没有发现明显的结构缺口' : `${analysis.issues.length} 个位置值得回看`;
  paragraphCount.textContent = String(analysis.paragraphs.length);
  claimCount.textContent = String(analysis.claims);
  evidenceCount.textContent = String(analysis.evidence);
  bridgeCount.textContent = String(analysis.bridges);
  runState.innerHTML = '<span class="state-dot"></span> 已检查';
  renderIssues(analysis);
  renderSource(analysis);
  renderMap(analysis);
}

function focusParagraph(index: number): void {
  const target = document.querySelector<HTMLElement>(`#paragraph-${index}`);
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  target?.classList.remove('flash');
  window.setTimeout(() => target?.classList.add('flash'), 20);
  const paragraphs = splitParagraphs(input.value);
  const start = paragraphs.slice(0, index).reduce((offset, paragraph) => offset + paragraph.length + 2, 0);
  input.focus();
  input.setSelectionRange(start, start + (paragraphs[index]?.length ?? 0));
}

function runCheck(): void {
  const analysis = analyze(input.value);
  renderAnalysis(analysis);
}

function loadExample(index: number): void {
  const next = examples[index] ?? sample;
  input.value = next.text;
  exampleSelect.value = String(index);
  updateGutter();
  runCheck();
}

input.addEventListener('input', updateGutter);
input.addEventListener('scroll', () => {
  editorGutter.scrollTop = input.scrollTop;
});
exampleSelect.addEventListener('change', () => loadExample(Number(exampleSelect.value)));
runButton.addEventListener('click', runCheck);
clearButton.addEventListener('click', () => {
  input.value = '';
  updateGutter();
  renderAnalysis(analyze(''));
  input.focus();
});
input.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    runCheck();
  }
});

loadExample(0);
