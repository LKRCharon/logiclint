---
name: logiclint
description: Run LogicLint's local, explainable rules against AI-generated plans, technical documents, and long-form drafts when a reviewer needs claim, evidence, reasoning, paragraph, or technical-format prompts.
---

# LogicLint

Use LogicLint when a draft reads smoothly but its claims, evidence, causal steps, paragraph topics, or technical references need a second look. It is a deterministic heuristic review pass, not an AI detector and not a proof that a document is logically correct.

## Run it

From the repository root:

```bash
npm run --silent logiclint -- --json path/to/draft.md
npm run --silent logiclint -- --profile technical path/to/design.md
cat draft.md | npm run --silent logiclint -- --json --profile logic -
```

The command accepts one file or stdin. It never edits the input. Use `--json` when an Agent needs to consume the result; omit it for a compact terminal summary.

## Interpret the report

Read `analysis.issues` in the JSON report. Each issue includes:

- `kind`, `severity`, and `confidence`: the rule category and how strongly the heuristic matched;
- `blockIndex` and `spans`: where to look in the source;
- `detail`, `suggestion`, and `why`: the review prompt and its reasoning;
- `source`: the writing guidance or LogicLint rule family behind the prompt.

Prioritize `high` severity items, then inspect the surrounding paragraph. A missing keyword is not proof of a missing fact, and a flagged phrase is not proof of bad writing. Preserve domain facts and ask the author before changing the source.

## Suggested Agent workflow

1. Run the appropriate profile and keep the JSON report.
2. Group prompts by paragraph and separate high-confidence structural gaps from low-confidence expression signals.
3. Explain the smallest useful revision: add a measurement, name the object, state the missing condition, split a paragraph, or attach a traceable reference.
4. Show the proposed change to the user for review. Do not silently rewrite or overwrite the input.

## Profiles

- `balanced`: logic, paragraph structure, and cautious expression signals.
- `logic`: claim, evidence, causal bridge, topic drift, pronoun, and duplicate-claim checks.
- `technical`: balanced checks plus number formatting, range units, and traceable references.

The report contract is documented in [`report.schema.json`](../../report.schema.json). The browser playground uses the same report shape when downloading JSON.
