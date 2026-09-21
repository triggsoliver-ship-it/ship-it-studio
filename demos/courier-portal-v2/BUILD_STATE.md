# Dayline courier portal: build state

Route: `/demos/courier-portal-v2` (preview). The live demo at `/demos/courier-portal` is untouched until this is approved.

## What this is

A single static page (`index.html`, no build step, no backend). All data is made-up fixtures held in the browser. Nothing is saved, and nothing is sent anywhere. The page says so on screen.

## Implemented in this version (21 Sep 2026)

- **Ready to invoice** (owner only): Northbank Bakery weekly batch. Each line is checked for rate version, PO, proof of delivery and approved extras. Proposed extras (congestion charge) stay separate until approved or rejected. A job without POD is held. The card-paid job (JB-2311) is excluded from account invoicing.
- **Duplicate protection**: "Check jobs again" re-runs the checks. Lines already on an invoice are never charged twice.
- **Simulated accounts adapter** (`ReceivablesAdapter.createInvoice`): turns approved lines into an invoice and returns an invoice number (INV-1043). No real accounting system is called.
- **Invoices & cash** (owner only): outstanding, overdue (excluding disputed amounts), promised, in dispute, and cash received (confirmed payments only). An action queue is ranked by plain facts: broken promise, overdue amount, dispute, reported payment awaiting confirmation, missing POD, extra awaiting approval. Invoice rows open a detail view with lines, VAT, confirmed payments, balance, private POD note and a timeline.
- **Demo story with a synthetic clock**: create invoice → overdue with an explained chase draft (approve = logged, not sent) → promise pauses chasing → £150 reported payment goes to checking → confirmed payment reduces the balance by exactly £150 → final payment closes it. Also shown: a Hallam invoice with £54.00 disputed (paused) while £775.20 undisputed stays collectible; a Meridian broken promise; a card-paid job outside collections.
- **Money & margin**: "Money made" relabelled **Contribution** (after direct costs only, not profit, not cash). A cash-side band shows outstanding, overdue, disputed and cash received from the same invoice data.
- **POD correction**: "No proof, no pay" removed. Missing POD is now a **POD exception, review required**, and the software never withholds earned pay on its own (employee, worker and subcontractor rules differ).
- **Tracking page note**: public tracking never shows prices, balances, signatures or driver pay.

Money is held in whole pence. VAT is 20% on the invoice net, rounded to the penny.

## Checks run

Headless Chromium, desktop 1440px and phone 390px:
- Draft for Northbank after approving the extra: net £293.00, VAT £58.60, total £351.60.
- Re-check after invoicing: 0 new, 6 already invoiced, 1 on hold. Create button disabled.
- Story: overdue 4 days with chase draft shown; promise hides the chase; reported £150 leaves the balance at £351.60; confirmation leaves £201.60; final payment leaves £0.00 and status Paid.
- Totals at 12 Oct: outstanding £2,924.40, overdue £2,870.40, disputed £54.00, cash received in 30 days £3,414.00 (each checked by hand against the fixtures).
- Starting statuses on 21 Sep: INV-1036 paid, INV-1029 broken promise, INV-1038 due 1 Oct with dispute, INV-1040 due 5 Oct, INV-1041 paid, CARD-2311 paid at booking.
- The published file was fetched back from GitHub and these checks were run on that exact copy.
- Office login cannot see the money screens. No script errors. No sideways scrolling on a phone.

## Not built (needed for a real version)

- A database and server so data persists, with company and role rules enforced on the server (the company switch here is only a demo, not security).
- A real accounts connection (Xero, one per company), signed webhooks, and an event log with IDs so the same event is never processed twice.
- Private file storage for POD photos and signatures, with access only for the right billing contact.
- Real email sending for approved chases, contact limits, and payment confirmation from the bank or accounts system.
- Effective-dated rate cards and each customer's own rules for cancellations and failed deliveries.
- A 13-week cash forecast. Needs opening cash and outgoings (pay, fuel, leases, insurance, tax) first.

## Next task

Oli to review the preview. If approved, copy this page over `/demos/courier-portal` so the link William already has shows the new version.
