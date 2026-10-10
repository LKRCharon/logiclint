import { Copy, createIcons, Download, Github, Play, Sparkles, Target, Trash2 } from 'lucide';
import { analyze, createReport, hasBridgeSignal, hasClaimSignal, hasEvidenceSignal, PROFILE_OPTIONS, type Analysis, type DocumentBlock, type Issue, type Profile, type TextSpan } from './engine';
import './styles.css';

interface Example { title: string; eyebrow: string; text: string; }

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
  {
    title: 'Markdown 方案',
    eyebrow: '展示标题与列表解析',
    text: `# Agent 迁移计划

我们建议在本季度完成迁移，因为新架构更稳定、更易维护。

## 迁移步骤

- 先导出历史任务
- 再切换流量
- 最后观察线上指标

据内部报告，迁移后错误率会下降 30～50。这个范围还没有标明单位和可追溯链接。`,
  },
];

const sample = examples[0];
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="./" aria-label="LogicLint 首页"><span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span><span>LOGIC<span class="brand-accent">LINT</span></span></a>
      <div class="topbar-meta"><span class="release-tag">v0.4 evaluated</span><span class="topbar-divider" aria-hidden="true"></span><a href="https://github.com/LKRCharon/logiclint" target="_blank" rel="noreferrer" class="icon-link" aria-label="在 GitHub 查看 LogicLint" data-tooltip="GitHub"><i data-lucide="github"></i></a></div>
    </header>

    <main>
      <section class="intro-band" aria-labelledby="page-title"><div class="intro-copy"><div class="kicker"><span class="status-dot"></span> LOCAL · EXPLAINABLE · EXPORTABLE</div><h1 id="page-title">给 AI 输出<br /><em>跑一次逻辑单测。</em></h1><p>LogicLint 把段落、观点、依据和推理桥接拆开检查。先找出哪里没说清楚，再决定怎么改。</p></div><div class="intro-note"><span class="note-label">本次检查</span><strong>启发式提示</strong><span>结果用于定位风险，不能替代人工判断。</span></div></section>

      <section class="workbench" aria-label="LogicLint 工作台">
        <section class="panel editor-panel" aria-labelledby="editor-title"><div class="panel-head"><div><div class="eyebrow">01 / INPUT</div><h2 id="editor-title">放入一段文字</h2></div><div class="editor-actions"><label class="select-wrap" for="example-select"><span class="sr-only">选择示例</span><select id="example-select" aria-label="选择示例"></select></label><button class="text-button" id="clear-button" type="button"><i data-lucide="trash-2"></i> 清空</button></div></div><div class="editor-frame"><div class="editor-gutter" id="editor-gutter" aria-hidden="true"></div><textarea id="text-input" spellcheck="false" aria-label="待检查的文本"></textarea></div><div class="editor-foot"><span id="char-count">0 字</span><span class="keyboard-hint"><kbd>⌘</kbd><span>↵</span> 检查</span></div><div class="run-controls"><button class="run-button" id="run-button" type="button"><i data-lucide="play"></i><span>检查逻辑</span><kbd>⌘ ↵</kbd></button><label class="profile-wrap" for="profile-select"><span>检查模式</span><select id="profile-select" aria-label="检查模式"></select></label></div><div class="sample-strip"><i data-lucide="sparkles"></i><span>示例会故意保留缺口。换成自己的文字后，结果只在当前浏览器计算。</span></div></section>

        <section class="panel results-panel" aria-labelledby="results-title"><div class="panel-head results-head"><div><div class="eyebrow">02 / REPORT</div><h2 id="results-title">逻辑报告</h2></div><div class="report-actions"><span class="run-state" id="run-state"><span class="state-dot"></span> 已检查</span><button class="icon-button" id="copy-button" type="button" aria-label="复制报告摘要" data-tooltip="复制摘要"><i data-lucide="copy"></i></button><button class="icon-button" id="export-button" type="button" aria-label="下载 JSON 报告" data-tooltip="下载 JSON"><i data-lucide="download"></i></button></div></div><div class="score-row"><div class="score-number"><span id="score-value">--</span><small>/ 100</small></div><div class="score-copy"><strong id="score-label">等待文本</strong><span id="score-description">载入一段文字后开始检查</span></div></div><div class="score-track" aria-hidden="true"><span id="score-track-fill"></span></div><div class="metric-grid" aria-label="检查指标"><div class="metric"><span>段落</span><strong id="paragraph-count">0</strong></div><div class="metric"><span>观点</span><strong id="claim-count">0</strong></div><div class="metric"><span>依据</span><strong id="evidence-count">0</strong></div><div class="metric"><span>桥接词</span><strong id="bridge-count">0</strong></div><div class="metric"><span>标题</span><strong id="heading-count">0</strong></div><div class="metric"><span>字词</span><strong id="word-count">0</strong></div></div><div class="section-rule"></div><div class="issues-heading"><h3>需要回看的地方</h3><span id="issue-count">0 个提示</span></div><div class="issues-list" id="issues-list" aria-live="polite"></div><div class="empty-results" id="empty-results" hidden><i data-lucide="target"></i><strong>还没有检查结果</strong><span>把文本放进左侧，报告会在这里出现。</span></div></section>
      </section>

      <section class="lower-grid"><section class="panel source-panel" aria-labelledby="source-title"><div class="panel-head compact-head"><div><div class="eyebrow">03 / TRACE</div><h2 id="source-title">逐段定位</h2></div><span class="panel-meta">命中片段会被标记</span></div><div class="source-preview" id="source-preview"></div></section><section class="panel map-panel" aria-labelledby="map-title"><div class="panel-head compact-head"><div><div class="eyebrow">04 / MAP</div><h2 id="map-title">论证关系</h2></div><span class="panel-meta">claim → evidence → bridge</span></div><div class="argument-map" id="argument-map"></div><div class="map-legend"><span><i class="legend-dot claim-dot"></i>观点</span><span><i class="legend-dot evidence-dot"></i>依据</span><span><i class="legend-dot bridge-dot"></i>桥接</span></div></section></section>

      <section class="agent-strip" aria-label="Agent 集成入口"><div><span class="eyebrow">FOR AGENTS</span><strong>同一份报告，也能交给 Agent 继续处理。</strong><span>下载 JSON，或运行 <code>npm run --silent logiclint -- --json</code>。</span></div><a href="https://github.com/LKRCharon/logiclint/tree/main/skills/logiclint" target="_blank" rel="noreferrer">查看 SKILL.md <span aria-hidden="true">↗</span></a></section>
    </main>
    <footer class="footer"><span>LogicLint 是一个公开的早期实验项目。</span><a href="https://github.com/LKRCharon/logiclint" target="_blank" rel="noreferrer">在 GitHub 参与迭代 <i data-lucide="github"></i></a></footer>
  </div>
`;

createIcons({ icons: { Copy, Download, Github, Play, Sparkles, Target, Trash2 } });

function getElement<T extends HTMLElement>(selector: string): T { const element = document.querySelector<T>(selector); if (!element) throw new Error(`Missing UI element: ${selector}`); return element; }

const input = getElement<HTMLTextAreaElement>('#text-input');
const exampleSelect = getElement<HTMLSelectElement>('#example-select');
const profileSelect = getElement<HTMLSelectElement>('#profile-select');
const runButton = getElement<HTMLButtonElement>('#run-button');
const clearButton = getElement<HTMLButtonElement>('#clear-button');
const copyButton = getElement<HTMLButtonElement>('#copy-button');
const exportButton = getElement<HTMLButtonElement>('#export-button');
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
const headingCount = getElement<HTMLSpanElement>('#heading-count');
const wordCount = getElement<HTMLSpanElement>('#word-count');
const runState = getElement<HTMLSpanElement>('#run-state');

examples.forEach((item, index) => { const option = document.createElement('option'); option.value = String(index); option.textContent = `${item.title} · ${item.eyebrow}`; exampleSelect.append(option); });
PROFILE_OPTIONS.forEach((profile) => { const option = document.createElement('option'); option.value = profile.id; option.textContent = profile.label; option.title = profile.description; profileSelect.append(option); });

let lastAnalysis: Analysis = analyze('', 'balanced');

function updateGutter(): void { const count = Math.max(1, input.value.split('\n').length); editorGutter.innerHTML = Array.from({ length: count }, (_, index) => `<span>${String(index + 1).padStart(2, '0')}</span>`).join(''); charCount.textContent = `${input.value.replace(/\s/g, '').length.toLocaleString('zh-CN')} 字`; }
function roleLabel(role: DocumentBlock['role']): string { return role === 'evidence' ? '依据' : role === 'bridge' ? '桥接' : role === 'mixed' ? '混合' : role === 'claim' ? '观点' : '文本'; }

function renderTextWithSpans(container: HTMLElement, text: string, spans: Array<{ span: TextSpan; severity: Issue['severity'] }>): void {
  const ranges = spans.slice().sort((left, right) => left.span.start - right.span.start || right.span.end - left.span.end); let cursor = 0;
  ranges.forEach(({ span, severity }) => { if (span.start < cursor || span.start >= text.length) return; if (span.start > cursor) container.append(document.createTextNode(text.slice(cursor, span.start))); const mark = document.createElement('mark'); mark.className = `hit-mark severity-${severity}`; mark.textContent = text.slice(span.start, span.end); container.append(mark); cursor = span.end; });
  if (cursor < text.length) container.append(document.createTextNode(text.slice(cursor)));
}

function renderIssues(analysis: Analysis): void {
  issuesList.innerHTML = ''; issueCount.textContent = `${analysis.issues.length} 个提示`; emptyResults.hidden = analysis.issues.length > 0;
  if (analysis.issues.length === 0) { const clear = document.createElement('div'); clear.className = 'all-clear'; clear.innerHTML = '<span class="all-clear-icon">✓</span><strong>暂时没有明显缺口</strong><span>仍建议人工通读，启发式检查只负责提醒。</span>'; issuesList.append(clear); return; }
  const priority: Record<Issue['severity'], number> = { high: 0, medium: 1, low: 2 };
  [...analysis.issues].sort((left, right) => priority[left.severity] - priority[right.severity] || right.confidence - left.confidence).forEach((issue) => {
    const item = document.createElement('article'); item.className = `issue-item severity-${issue.severity}`;
    item.innerHTML = `<div class="issue-topline"><span class="issue-label"><i class="issue-icon"></i>${issue.label}</span><span class="issue-confidence">${Math.round(issue.confidence * 100)}% · P${issue.blockIndex + 1}</span></div><h4>${issue.title}</h4><p>${issue.detail}</p><div class="issue-evidence"><span>命中</span><span class="evidence-quote"></span></div><div class="issue-suggestion"><span>建议</span>${issue.suggestion}</div><div class="issue-why"><strong>为什么提示</strong><span>${issue.why}</span></div><div class="issue-source">规则依据：${issue.source}</div><button class="locate-button" type="button">定位原文 <span aria-hidden="true">↗</span></button>`;
    const quote = item.querySelector<HTMLSpanElement>('.evidence-quote'); if (quote) quote.textContent = issue.spans.map((span) => span.text).join(' · ') || '结构信号';
    item.querySelector<HTMLButtonElement>('.locate-button')?.addEventListener('click', () => focusIssue(issue)); issuesList.append(item);
  });
}

function renderSource(analysis: Analysis): void {
  sourcePreview.innerHTML = ''; if (analysis.blocks.length === 0) { sourcePreview.innerHTML = '<div class="source-empty">检查结果会按段落显示在这里。</div>'; return; }
  analysis.blocks.forEach((block) => {
    const item = document.createElement('article'); item.className = `source-item ${block.issues.length > 0 ? 'has-issues' : ''}`; item.dataset.block = String(block.index);
    const issueSummary = block.issues.length > 0 ? `<span class="source-issues">${block.issues.length} 个提示</span>` : '<span class="source-ok">结构清楚</span>';
    item.innerHTML = `<div class="source-index">${block.kind === 'heading' ? 'H' : block.kind === 'list' ? 'L' : block.kind === 'code' ? 'C' : 'P'}${String(block.index + 1).padStart(2, '0')}</div><div class="source-body"><div class="source-meta"><span class="role-pill role-${block.role}">${roleLabel(block.role)}</span>${issueSummary}</div><div class="source-text"></div></div>`;
    const textContainer = item.querySelector<HTMLDivElement>('.source-text')!;
    if (block.kind === 'code') { const code = document.createElement('code'); code.textContent = block.text; textContainer.append(code); } else renderTextWithSpans(textContainer, block.text, block.issues.flatMap((issue) => issue.spans.map((span) => ({ span, severity: issue.severity }))));
    sourcePreview.append(item);
  });
}

function renderMap(analysis: Analysis): void {
  argumentMap.innerHTML = '';
  const firstClaim = analysis.paragraphs.find((block) => hasClaimSignal(block.text));
  const firstEvidence = analysis.paragraphs.find((block) => hasEvidenceSignal(block.text));
  const firstBridge = analysis.paragraphs.find((block) => hasBridgeSignal(block.text));
  const nodes = [{ type: 'claim', label: '观点', text: firstClaim ? `P${firstClaim.index + 1} · ${firstClaim.sentences[0]?.slice(0, 38) ?? ''}` : '等待观点', block: firstClaim }, { type: 'evidence', label: '依据', text: firstEvidence ? `P${firstEvidence.index + 1} · ${firstEvidence.sentences[0]?.slice(0, 38) ?? ''}` : '还没有具体依据', block: firstEvidence }, { type: 'bridge', label: '桥接', text: firstBridge ? `P${firstBridge.index + 1} · 发现因果或结论连接词` : '等待推理关系', block: firstBridge }];
  const map = document.createElement('div'); map.className = 'map-flow';
  nodes.forEach((node, index) => { const card = document.createElement('button'); card.className = `map-node map-${node.type}`; card.type = 'button'; card.innerHTML = `<span class="map-node-label">${node.label}</span><strong></strong>`; card.querySelector('strong')!.textContent = node.text; if (node.block) card.addEventListener('click', () => focusBlock(node.block!)); map.append(card); if (index < nodes.length - 1) { const arrow = document.createElement('span'); arrow.className = 'map-arrow'; arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '→'; map.append(arrow); } });
  argumentMap.append(map);
}

function renderAnalysis(analysis: Analysis): void {
  lastAnalysis = analysis; scoreValue.textContent = analysis.score === 0 ? '--' : String(analysis.score); scoreFill.style.width = `${analysis.score}%`; scoreFill.dataset.score = String(analysis.score); scoreLabel.textContent = analysis.score >= 85 ? '结构基本稳' : analysis.score >= 65 ? '有几处要补' : '建议重看推理'; scoreDescription.textContent = analysis.issues.length === 0 ? '没有发现明显的结构缺口' : `${analysis.issues.length} 个位置值得回看`;
  paragraphCount.textContent = String(analysis.metrics.paragraphs); claimCount.textContent = String(analysis.metrics.claims); evidenceCount.textContent = String(analysis.metrics.evidence); bridgeCount.textContent = String(analysis.metrics.bridges); headingCount.textContent = String(analysis.metrics.headings); wordCount.textContent = String(analysis.metrics.words); runState.innerHTML = '<span class="state-dot"></span> 已检查'; runState.classList.remove('stale'); renderIssues(analysis); renderSource(analysis); renderMap(analysis);
}

function focusBlock(block: DocumentBlock, span?: TextSpan): void { const target = document.querySelector<HTMLElement>(`.source-item[data-block="${block.index}"]`); target?.scrollIntoView({ behavior: 'smooth', block: 'center' }); target?.classList.remove('flash'); window.setTimeout(() => target?.classList.add('flash'), 20); input.focus(); input.setSelectionRange(block.start + (span?.start ?? 0), block.start + (span?.end ?? block.text.length)); }
function focusIssue(issue: Issue): void { const block = lastAnalysis.blocks.find((candidate) => candidate.index === issue.blockIndex); if (block) focusBlock(block, issue.spans[0]); }
function runCheck(): void { renderAnalysis(analyze(input.value, profileSelect.value as Profile)); }
function loadExample(index: number): void { input.value = examples[index]?.text ?? sample.text; exampleSelect.value = String(index); updateGutter(); runCheck(); }
function reportText(): string { const lines = [`LogicLint ${lastAnalysis.version} · ${lastAnalysis.score}/100`, `模式：${PROFILE_OPTIONS.find((profile) => profile.id === lastAnalysis.profile)?.label ?? lastAnalysis.profile}`, `提示：${lastAnalysis.issues.length} 条`]; lastAnalysis.issues.slice(0, 5).forEach((issue) => lines.push(`P${issue.blockIndex + 1} ${issue.label}：${issue.title}`)); return lines.join('\n'); }
async function copyReport(): Promise<void> { try { await navigator.clipboard.writeText(reportText()); copyButton.dataset.tooltip = '已复制'; window.setTimeout(() => { copyButton.dataset.tooltip = '复制摘要'; }, 1400); } catch { copyButton.dataset.tooltip = '复制失败'; } }
function exportReport(): void { const blob = new Blob([JSON.stringify(createReport(lastAnalysis, 'browser'), null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `logiclint-report-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url); }

input.addEventListener('input', () => { updateGutter(); runState.innerHTML = '<span class="state-dot"></span> 待检查'; runState.classList.add('stale'); });
input.addEventListener('scroll', () => { editorGutter.scrollTop = input.scrollTop; });
exampleSelect.addEventListener('change', () => loadExample(Number(exampleSelect.value)));
profileSelect.addEventListener('change', runCheck); runButton.addEventListener('click', runCheck); copyButton.addEventListener('click', () => { void copyReport(); }); exportButton.addEventListener('click', exportReport);
clearButton.addEventListener('click', () => { input.value = ''; updateGutter(); runCheck(); input.focus(); });
input.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); runCheck(); } });

profileSelect.value = 'balanced'; loadExample(0);
