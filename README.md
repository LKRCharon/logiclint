<div align="center">

# LogicLint

### Give AI output a logic unit test.

**Find the gaps between a claim, its evidence, and the reasoning that connects them.**

[Try the live playground](https://lkrcharon.github.io/logiclint/) · [Report an issue](https://github.com/LKRCharon/logiclint/issues) · [Roadmap](#roadmap)

LogicLint is an early browser playground and local CLI for reviewing AI-generated plans, technical docs, and long-form text. It turns structural writing advice into visible, clickable prompts and a machine-readable report.

</div>

---

## Why LogicLint?

AI writing often reads smoothly while leaving important steps unstated: a conclusion appears without evidence, a causal word skips the mechanism, or a paragraph quietly changes topic. Style guides help writers organize prose; LogicLint focuses on the relationship between **claims, evidence, and reasoning bridges**.

It is not an AI detector and does not try to disguise AI-generated text. It helps a writer decide what needs another look.

## Try it

Open the [LogicLint playground](https://lkrcharon.github.io/logiclint/). The page starts with a sample plan containing intentional gaps.

1. Pick a sample or paste your own text.
2. Select **Check logic** (or press `⌘ Enter` / `Ctrl Enter`).
3. Review the prompts and click **Locate source** to jump to a paragraph.
4. Inspect the claim, evidence, and bridge map. Click a node to locate its paragraph.

The demo runs entirely in your browser. Text is not uploaded to a server.

## What v0.2 checks

- A conclusion or claim with no recognizable evidence nearby.
- Causal and conclusion words without an explicit supporting step.
- Broad phrases that need a scope, measure, or concrete action.
- Ambiguous pronouns at the beginning of a passage.
- Possible topic drift within a long paragraph.
- Repeated claims that add no new evidence.
- Markdown headings, lists, quotes, and code blocks, so checks do not treat every line as a paragraph.
- Highlighted source spans, confidence levels, a short explanation, and the rule source for every prompt.
- Three profiles: balanced logic and expression checks, logic-only checks, and technical-document checks.
- Technical-document details such as unformatted large numbers, incomplete ranges, and references without a traceable link.

These are heuristic prompts, not proofs of a logical fallacy. The current Chinese-first rules use keyword and structure matching. They can miss real issues, flag valid writing, and do not understand domain context. Treat every result as a question for a human reviewer.

## How this fits with other tools

| Tool or guidance | Main focus | How LogicLint differs |
| --- | --- | --- |
| [阮一峰：中文技术文档的写作规范](https://github.com/ruanyf/document-style-guide) | Clear sentences, paragraphs, and technical document structure | LogicLint turns a few structural concerns into clickable checks and traces claims to supporting material |
| [Google Technical Writing One: Paragraphs](https://developers.google.com/tech-writing/one/paragraphs) | Topic sentences and one logical topic per paragraph | LogicLint flags possible topic drift and missing reasoning steps in a draft |
| [Humanizer](https://github.com/blader/humanizer) | Common AI-style wording and sentence patterns | LogicLint looks at argument structure, not whether text sounds human |
| Traditional linters | Deterministic syntax and style rules | LogicLint surfaces uncertain, reviewable reasoning risks rather than pass/fail correctness |

## Run locally

Requirements: Node.js 22 or newer.

```bash
npm install
npm run dev
```

Create the production build with:

```bash
npm run build
npm run preview
```

GitHub Pages serves the `main` branch's `/docs` folder. `npm run build` writes the publishable site there; include the updated `docs/` output when you commit a release.

### Agent interface

The v0.3 CLI reads one file or stdin and keeps the same report shape as the browser's JSON download:

```bash
npm run --silent logiclint -- --json README.md
cat docs/design.md | npm run --silent logiclint -- --json --profile technical -
```

The contract is in [`report.schema.json`](report.schema.json), and [`skills/logiclint/SKILL.md`](skills/logiclint/SKILL.md) describes a conservative Agent workflow. The CLI only reports prompts; it never rewrites the input.

## Roadmap

- **v0.1 · Playground:** Local heuristic checks, three sample texts, issue-to-source navigation, and an argument map.
- **v0.2 · Explainable rules:** Markdown-aware parsing, evidence and claim spans, confidence, rule explanations, configurable profiles, and JSON export.
- **v0.3 · Agent interface:** A versioned JSON report contract, stdin/file CLI, and an Agent Skill integration.
- **v0.4 · Evaluation set:** Human-reviewed examples for checking rule usefulness and false-positive patterns.

The roadmap is directional. Model-based review, accuracy claims, and team or server features are not part of the current releases.

## Contribute

Useful contributions include minimal examples where a rule is helpful or wrong, a focused rule with a clear explanation, accessibility improvements, and translations. Please include the input passage, the expected prompt (or no prompt), and why.

For substantial changes, open an issue before starting implementation. Keep rules explainable and avoid presenting heuristic output as a verdict.

## Share

> AI 生成的方案读起来很顺，但“为什么”常常少了一步。LogicLint 把观点、依据和推理桥接拆开检查：给 AI 输出跑一次逻辑单测。现在可以直接在浏览器里玩，不用 API Key。

Live demo: https://lkrcharon.github.io/logiclint/

## License

MIT

---

## 中文

### 给 AI 输出跑一次逻辑单测。

LogicLint 是一个早期的浏览器工作台和本地 CLI，用于回看 AI 生成的方案、技术文档和长文本。它把观点、依据与推理桥接之间的缺口变成可点击、可定位的提示，也能输出机器可读报告。

### 为什么做

AI 文本经常读起来很顺，却省略关键步骤：结论先于依据、因果词代替了机制，或者一段话悄悄换了主题。写作规范帮助组织句子和段落；LogicLint 主要看**观点、依据和连接它们的推理**是否说清楚。

它不是 AI 检测器，也不以伪装 AI 文本为目标。它帮助作者判断哪些地方值得再看一遍。

### 在线体验

打开 [LogicLint 网页](https://lkrcharon.github.io/logiclint/)，页面会自动载入一段故意留有逻辑缺口的 Agent 方案。

1. 选择示例，或粘贴自己的文本。
2. 点击“检查逻辑”，也可以按 `⌘ Enter` / `Ctrl Enter`。
3. 查看提示，点击“定位原文”跳到对应段落。
4. 查看观点、依据、桥接关系图，点击节点定位原文。

首版在浏览器本地运行，不会把文本上传到服务器。

### v0.2 检查什么

- 观点或结论附近缺少可识别的依据。
- 出现因果词或结论词，但没有写出支持它的步骤。
- “显著、全面、赋能”等宽泛说法缺少范围、指标或具体动作。
- 段首代词可能没有明确指向。
- 长段落中可能混入多个主题。
- 相近结论重复出现，但没有增加依据。
- Markdown 标题、列表、引用和代码块，避免把所有内容都当成普通段落。
- 命中原文片段、置信度、提示原因和规则来源，方便人工复核。
- 三种检查模式：逻辑 + 表达、只看逻辑、技术文档。
- 技术文档中的大数字格式、范围单位和缺少可追溯链接的引用。

这些都是启发式提示，不是逻辑谬误的证明。当前中文优先规则基于关键词和文本结构，可能漏掉实际问题，也可能误报，且不理解领域上下文。请把每条结果当作人工复核的问题。

### 和已有工具的区别

- [阮一峰：中文技术文档的写作规范](https://github.com/ruanyf/document-style-guide)关注句子、段落和技术文档组织；LogicLint 把部分结构问题变成可点击检查，并尝试把观点与支持材料关联起来。
- [Google Technical Writing One: Paragraphs](https://developers.google.com/tech-writing/one/paragraphs)强调段落主题句和主题统一；LogicLint 提示可能的主题漂移和推理缺步。
- [Humanizer](https://github.com/blader/humanizer)关注 AI 常见措辞和句式；LogicLint 检查论证结构，不判断文字是否“像人”。
- 传统 Linter 检查确定性的语法和风格规则；LogicLint 暴露不确定、可供人复核的推理风险，不给出正确与否的判决。

### 本地运行

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
npm run preview
```

GitHub Pages 从 `main` 分支的 `/docs` 目录提供网页。`npm run build` 会把可发布站点生成到该目录；发布新版本时一并提交更新后的 `docs/`。

### Agent 接口

v0.3 的 CLI 支持文件和 stdin，网页下载的 JSON 与命令行报告使用同一份结构：

```bash
npm run --silent logiclint -- --json README.md
cat docs/design.md | npm run --silent logiclint -- --json --profile technical -
```

报告协议见 [`report.schema.json`](report.schema.json)，Agent 使用方式见 [`skills/logiclint/SKILL.md`](skills/logiclint/SKILL.md)。CLI 只提供待复核提示，不会改写输入文件。

### 路线图

- **v0.1 · 在线工作台：** 本地启发式检查、三段示例、问题定位和论证关系图。
- **v0.2 · 可解释规则：** Markdown 解析、观点与依据文本标记、置信度、规则解释、可配置模式和 JSON 导出。
- **v0.3 · Agent 接口：** 有版本的 JSON 报告协议、支持 stdin/文件的 CLI，以及 Agent Skill 集成。
- **v0.4 · 评测样本：** 人工审核的案例，用于观察规则是否有用及其误报情况。

路线图用于说明方向。模型审稿、准确率承诺、团队或服务端功能不属于当前版本。

### 参与贡献

欢迎提交最小案例，说明某条规则何时有用或误报；也欢迎新增解释清楚的检查项、无障碍改进和翻译。请附上输入文本、期望提示（或不应提示）以及理由。

较大的改动请先开 Issue 讨论。检查结果应当便于解释，不能包装成最终判决。

### 分享文案

> AI 生成的方案读起来很顺，但“为什么”常常少了一步。LogicLint 把观点、依据和推理桥接拆开检查：给 AI 输出跑一次逻辑单测。现在可以直接在浏览器里玩，不用 API Key。

在线体验：https://lkrcharon.github.io/logiclint/
