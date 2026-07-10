# Owner Copilot

A private, **approval-based** business assistant. It analyzes and proposes; it never executes
outward-facing or financial actions on its own. Status: schema + AI service (`ownerBrief`) +
Approval Centre model implemented; assistant surfaces are scaffolded and tracked in the TODO.

## Principles
- **Every metric traceable to source data.** `ownerBrief` claims must derive from the metrics JSON
  it is given; the service prompt enforces this and output is schema-validated.
- **No auto-execution of high-risk actions.** Refunds, discounts, price changes, publications,
  reorders, compensation, campaign sends, stock adjustments, and AI-content publication all create
  an `ApprovalRequest` and require a human decision.
- **No fabricated numbers.** When cost/supplier inputs are absent, margin outputs return
  `insufficient_data` rather than invented figures.

## Daily brief (data sources)
Revenue/orders/AOV (Order), failed payments (IntegrationEvent/Order), delivery exceptions,
low-stock/stockout risk (Product.stock vs reorderPoint), slow movers, most-viewed vs inventory
(analytics events), frequently-searched-unavailable (search events), abandoned carts, support/return/
review themes (SupportConversation/Review), gross-margin warnings, recommended actions.

## Inventory assistant
Reorder recommendations (lead time from Supplier), demand signals (views/recommendation demand vs
stock), stockout prediction, dead-stock detection, sample allocation, supplier discrepancy flags —
presented with confidence + assumptions.

## Marketing assistant
Campaign briefs, email/WhatsApp drafts, launch plans, gift guides, journal outlines, SEO briefs,
segments, offers, post-campaign summaries. **Never sends** — drafts only (`draftMarketing`).

## Customer-insight + margin assistants
Aggregated cohort/return/support/repeat-purchase analysis; margin = revenue − COGS − payment fee −
delivery subsidy − discount − refund (only when inputs exist).

## Approval Centre (`ApprovalRequest`)
Fields: action, reason, dataSource, riskLevel, createdBy, requiredApprover, status, decidedBy,
decidedAt, executed, payload — with an `AuditLog` trail. High-risk actions never auto-execute.
