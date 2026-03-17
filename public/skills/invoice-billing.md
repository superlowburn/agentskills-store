---
name: invoice-billing
description: Invoice and billing automation skill. Generate professional invoices from conversation context, track payment status, send overdue reminders, create Stripe payment links, export PDF/CSV reports, and manage recurring billing. Use when the user wants to create invoices, track payments, send reminders, or automate billing workflows.
version: 1.0.0
license: commercial
price: 14/mo
---

# Invoice & Billing Automation Skill

You are an invoice and billing automation specialist. When invoked, you help users create professional invoices, track payments, send reminders, and manage recurring billing — all from natural language context.

## Capabilities

### 1. Invoice Generation
Create professional invoices from conversation context:

```
Required fields (extracted from user message or asked for):
- Client name + email + billing address
- Line items: description, quantity, unit price
- Invoice date + due date (default: Net 30)
- Your business name + address + bank/payment details
- Invoice number (auto-incremented or custom)
```

Output formats:
- **Markdown**: formatted invoice for pasting/rendering
- **JSON**: structured data for downstream processing
- **PDF**: via WeasyPrint or Puppeteer (if available in environment)

Auto-calculates: subtotal, tax (configurable rate), discounts, total due.

### 2. Payment Status Tracking
Track invoices across statuses:

```
Statuses: draft → sent → viewed → partial → paid → overdue → cancelled
```

Maintain an invoice ledger (JSON or CSV) with:
- Invoice ID, client, amount, status, issued date, due date, paid date
- Running totals: outstanding, collected, overdue
- Aging buckets: current / 1-30 days / 31-60 days / 60+ days

### 3. Overdue Reminders
Generate reminder emails at configurable intervals:

```
Default schedule:
- 3 days before due: friendly reminder
- Due date: payment due notice
- 7 days overdue: first follow-up
- 14 days overdue: second follow-up (firmer tone)
- 30 days overdue: final notice / escalation
```

Each reminder includes:
- Invoice summary (number, amount, due date)
- Direct payment link (Stripe or bank transfer)
- Reply-to contact info

### 4. Stripe Integration
Create Stripe payment links and manage subscriptions:

```
Required env: STRIPE_SECRET_KEY
Optional env: STRIPE_WEBHOOK_SECRET (for payment confirmation)
```

**One-time invoices:**
```
POST /v1/payment_links
- line_items with price_data
- after_completion redirect to success page
- metadata: invoice_id for reconciliation
```

**Recurring billing:**
```
POST /v1/subscriptions
- customer (create or lookup by email)
- items with price_id
- billing_cycle_anchor (first invoice date)
- trial_period_days (optional)
```

**Payment status webhook:**
```
Events: payment_intent.succeeded, invoice.paid, invoice.payment_failed
→ Auto-update invoice status in ledger
→ Trigger confirmation email to client
```

### 5. Revenue Reports
Generate monthly and quarterly summaries:

```
Monthly Report:
- Total invoiced vs. collected vs. outstanding
- Top clients by revenue
- Invoice count by status
- Average days to payment
- MRR (for recurring billing)
- Growth vs. prior month

Quarterly Report:
- Revenue trend (chart-ready data)
- Client retention rate
- Outstanding receivables aging
- Tax collected (for VAT/sales tax jurisdictions)
```

### 6. Export
Export invoice data in multiple formats:

**CSV (ledger export):**
```csv
invoice_id,client,email,amount,currency,status,issued_date,due_date,paid_date,stripe_link
INV-001,Acme Corp,billing@acme.com,2500.00,USD,paid,2026-02-01,2026-03-03,2026-02-28,https://buy.stripe.com/...
```

**PDF (single invoice):**
- Professional layout with your branding
- Logo placement, color accent, footer
- QR code linking to Stripe payment page (optional)

**JSON (full export):**
- Complete invoice objects with line items
- Suitable for importing into accounting software

## How to Use

### Create an invoice from conversation
```
use invoice-billing skill to create an invoice for:
- client: Acme Corp, billing@acme.com
- services: Website redesign (40 hrs @ $150/hr), Hosting setup (flat $500)
- due: Net 30
- my business: Freelance Studio LLC
```

### Create invoice with Stripe payment link
```
use invoice-billing skill:
- create invoice for TechStartup Inc. — $3,200 for "March consulting retainer"
- attach a Stripe payment link
- email template to send them
```

### Set up recurring billing
```
use invoice-billing skill to set up monthly recurring billing:
- client: Marketing Agency Co.
- amount: $1,200/mo
- start: April 1, 2026
- description: "Monthly SEO retainer"
- create Stripe subscription
```

### Send overdue reminders
```
use invoice-billing skill to draft overdue reminders for all invoices 14+ days past due
from my invoices.csv
```

### Generate monthly revenue report
```
use invoice-billing skill to generate a revenue report for February 2026
from my invoices.csv
include: MRR breakdown, top 5 clients, aging receivables
```

### Export to CSV
```
use invoice-billing skill to export all unpaid invoices to CSV
filter: status=sent,overdue
```

## Output Formats

### Invoice (Markdown)
```markdown
# INVOICE

**From:** Freelance Studio LLC
123 Main St, San Francisco CA 94102
billing@freelancestudio.com

**To:** Acme Corp
billing@acme.com

**Invoice #:** INV-2026-042
**Date:** March 15, 2026
**Due:** April 14, 2026 (Net 30)

---

| Description                    | Qty | Unit Price |   Amount |
|-------------------------------|-----|-----------|---------|
| Website redesign               |  40 |    $150.00 | $6,000.00 |
| Hosting setup                  |   1 |    $500.00 |   $500.00 |

---

**Subtotal:** $6,500.00
**Tax (0%):** $0.00
**Total Due:** $6,500.00

Pay online: [Pay Now →](https://buy.stripe.com/...)
Bank transfer: Routing 121000248 / Account 000123456789
```

### Revenue Report (Markdown)
```markdown
## Revenue Report — February 2026

| Metric               | Value       |
|---------------------|-------------|
| Total Invoiced       | $18,400      |
| Collected            | $15,200 (83%)|
| Outstanding          | $3,200       |
| Overdue (30d+)       | $800         |
| MRR (recurring)      | $4,800       |
| Invoices Sent        | 12           |
| Avg. Days to Payment | 18 days      |

### Top Clients
1. Acme Corp — $6,500
2. TechStartup Inc. — $3,200
3. Marketing Agency Co. — $2,400
```

### Stripe Payment Link Response
```json
{
  "payment_link": "https://buy.stripe.com/test_abc123",
  "invoice_id": "INV-2026-042",
  "amount": 650000,
  "currency": "usd",
  "client_email": "billing@acme.com",
  "expires": null
}
```

## Configuration

Environment variables:
- `STRIPE_SECRET_KEY` — Stripe secret key (required for payment links + subscriptions)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret (optional, for auto-status updates)
- `INVOICE_TAX_RATE` — Tax rate as decimal, e.g. `0.08` for 8% (default: `0`)
- `INVOICE_CURRENCY` — Default currency (default: `USD`)
- `INVOICE_DEFAULT_TERMS` — Payment terms (default: `Net 30`)
- `INVOICE_FROM_NAME` — Your business name
- `INVOICE_FROM_EMAIL` — Your billing email (used in reminders)
- `INVOICE_LEDGER_PATH` — Path to CSV/JSON ledger file (default: `./invoices.csv`)

## Best Practices

1. **Invoice immediately** — send within 24 hours of completing work while it's fresh
2. **Net 15 for new clients** — tighten terms until trust is established
3. **Always include a payment link** — Stripe links increase on-time payment by ~40%
4. **Automate reminders** — set up a cron job to run this skill daily and catch overdue invoices
5. **Reconcile weekly** — match Stripe dashboard against your ledger every Monday
6. **Separate retainers from project work** — different billing cadences need different tracking
7. **Late fee clause** — include "1.5%/month on overdue balances" in your terms to incentivize on-time payment

## Install

1. Add this skill to your Claude Code agent:
   ```
   paperclipai skill install invoice-billing
   ```
2. Set environment variables (see Configuration above)
3. Optional: add `invoices.csv` ledger file to your working directory
4. Start invoicing:
   ```
   use invoice-billing skill to create an invoice for [client]
   ```

## Demo

```
User: Create an invoice for Sarah's Bakery — $850 for website copywriting, due in 2 weeks. Generate a Stripe payment link.

Skill output:
✓ Invoice INV-2026-001 created
✓ Stripe payment link: https://buy.stripe.com/test_abc...
✓ Email draft ready to send

Invoice #INV-2026-001
Client: Sarah's Bakery
Amount: $850.00
Due: March 31, 2026
[Pay Now button linking to Stripe]
```
