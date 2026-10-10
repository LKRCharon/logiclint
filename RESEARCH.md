# Research Notes

LogicLint turns a narrow set of writing and agent-tooling ideas into reviewable prompts. The project does not copy another tool's full scope, and none of the checks should be read as proof that an argument is correct or incorrect.

## Source projects and what we borrowed

| Source | Useful idea | LogicLint implementation | Boundary |
| --- | --- | --- | --- |
| [Ruanyifeng's Chinese technical writing guide](https://github.com/ruanyf/document-style-guide) | Keep paragraphs focused; make numbers, units, and references easy to inspect | Paragraph-topic prompts, large-number and range checks, traceable-reference prompts | The rules only spot textual signals. They do not decide whether a citation is authoritative or a paragraph is truly coherent. |
| [Google Technical Writing One: Paragraphs](https://developers.google.com/tech-writing/one/paragraphs) | Lead with the point and keep one main topic in a paragraph | The drift rule compares sentence vocabulary and asks for a human review | Chinese tokenization is intentionally lightweight; the result is a prompt, not a segmentation verdict. |
| [Humanizer](https://github.com/blader/humanizer) | Catalog recurring wording patterns and explain why a writer may want to revise them | Low-confidence wording signals for broad claims and stock transitions | We do not detect whether a person or model wrote the text, and we do not optimize for bypassing AI detectors. A single signal is not an error. |
| [SkillsBench](https://github.com/benchflow-ai/skillsbench) | Make evaluation tasks explicit and repeatable | Versioned fixtures with expected and forbidden issue categories | The current fixtures are hand-authored regression examples, not a representative benchmark or user study. |
| [NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) | Check an agent asset as a structured artifact and report concrete findings | A documented CLI, JSON Schema, and machine-readable evaluator summary | We have not implemented live agent trials, skill ranking, or similarity scoring. |
| [Agent Skills specification](https://github.com/agentskills/agentskills) | Small `SKILL.md` files with frontmatter and progressive, task-specific instructions | `skills/logiclint/SKILL.md` gives an agent invocation and conservative interpretation workflow | Skill support depends on the consuming agent recognizing the format and having Node.js 22.6+. |

## Design decisions

### Explain the prompt

Each issue carries a category, severity, heuristic confidence, source location, matched text, explanation, and suggested next step. Confidence describes the rule match; it is not the probability that a human reviewer will agree.

### Keep analysis local and deterministic

The browser demo runs in the page. The CLI reads a local file or stdin and requires Node.js 22.6 or newer. Neither path calls a model or uploads the source. Identical input, profile, and version produce the same rule output.

### Separate analyzer and report versions

`analysis.version` tracks rule behavior. `schemaVersion` tracks the JSON contract. This lets rules improve without silently changing the report shape. `blocks` contains every parsed block in source order; `paragraphs` is the prose-oriented subset (paragraphs, quotes, and list items). Use `blocks` when source offsets or headings/code matter and `paragraphs` for prose-level metrics.

### Treat expression patterns as weak evidence

Humanizer-inspired signals have low severity and are presented as optional review prompts. LogicLint does not infer authorship, score “human-likeness,” or rewrite text to evade detection systems.

## Evaluation

Run the seed regression set with:

```bash
npm run --silent evaluate
npm run --silent evaluate -- --json
```

Each case defines a profile, input, issue categories expected to appear, and optional categories that should not appear. The command exits nonzero when an expectation fails. This catches changes to deterministic rule behavior and prevents obvious regressions such as a clean example receiving a topic-drift warning.

The current cases were written by the project author and manually inspected. A passing run means only that the current rules match these examples. It does not measure precision, recall, logical validity, generalization to unseen writing, or agreement with professional editors. Before making quality claims, the project needs a broader corpus, independent annotators, disagreement handling, and a documented sampling method.

## Known limits and next research questions

- Rules use phrase lists and lightweight character n-grams, not linguistic parsing or domain knowledge.
- Evidence words and numbers can be present without actually supporting a claim; valid support can also be phrased without the recognized vocabulary.
- Paragraph drift detection remains language-sensitive and may flag a coherent paragraph or miss a subtle topic shift.
- The numeric score is a UI summary derived from configured penalties. It is not a calibrated quality score and should not be compared across versions.
- Future fixtures should include paired positive/negative examples for each rule and be reviewed by people who did not author the rule.
- Future Agent integrations should preserve the user's source and present proposed edits for review rather than applying them automatically.
