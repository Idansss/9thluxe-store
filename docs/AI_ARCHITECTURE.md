# AI Architecture

## Provider independence
`integrations/ai/types.ts` defines `AiProvider` (low-level) and `AiServices` (high-level tasks).
`integrations/ai/index.ts` wraps a selected provider (`mock` default, `anthropic`, `openai`) with
resilience and exposes `aiServices`. Selection is env-driven (`AI_PROVIDER` + key presence).

## Resilience (every call)
- **PII redaction** (`scrubPrompt`): emails, phones, 16-digit PANs masked; hard 6k input ceiling.
  Addresses, payment data, and private conversations are **never** sent to a provider.
- **Timeout** (`withTimeout`), **retry** (primary twice), **fallback** to the deterministic mock.
- **Circuit breaker** per provider (opens after 4 failures for 30s).
- **Structured output validation**: every task parses model output as JSON and validates it with a
  Zod schema; invalid output → retry → mock → `AI_OUTPUT_INVALID`. Never returns unvalidated text.
- **Logging**: provider, model, task, prompt version, latency, token usage. No prompt/PII payloads.

## Services (`AiServices`)
`classifyIntent`, `explainRecommendation`, `answerSupport` (sets `escalate`), `summarizeReviews`
(reports count, `isAiSummary: true`), `draftMarketing` (draft only, never auto-sent), `ownerBrief`
(claims traceable to metrics JSON).

## Scent Concierge grounding
Pipeline: intent → hard constraints → retrieve (search provider) → **validate budget/stock/exclusions/
required attributes** → score (`scoring.ts`) → business safeguards → concise explanation →
**revalidate stock/price/link** → typed results → optional feedback. Requests outside the catalogue
get a clarification/refusal (`AI_REQUEST_UNSUPPORTED`). No medical/allergy/health guarantees.

## Safety
- Catalogue text, reviews, and user messages are **untrusted input** (prompt-injection surface):
  they are redacted, length-bounded, and never granted tool authority. AI tools (when added) use
  explicit allowlists and bounded permissions.
- Hidden prompts and internal reasoning are never exposed to customers.

## Prompt/version discipline
Each task carries a `promptVersion` (currently `v1`) logged with every call so outputs are traceable
and evaluable. See `docs/AI_EVALUATION.md`.
