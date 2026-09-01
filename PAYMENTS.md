# Payments

How money is taken on shipitstudio.co.uk, and what every checkout config key
must be set to.

**Ship It Studio is a trading name of Keelson Holdings Ltd (company 17359226),
which is not VAT registered.** Every price below is the whole price. Nothing on
the site adds VAT, quotes a price "+ VAT", or implies a price is exclusive of
anything. When you create each Payment Link in Stripe, set the amount to exactly
the figure in the table — do not enable Stripe Tax, and do not add a VAT line.

---

## The config

One object, in `assets/js/main.js`:

```js
const STRIPE_PAYMENT_LINKS = {
  starter_build: "",
  ...
};
```

Paste the live Payment Link URL from the Stripe dashboard against the matching
key. That is the only edit needed. There is no build step and no dependency to
install.

**Never put a Stripe API key (`sk_live_…`, `sk_test_…`, `rk_…`) in this repo.**
Payment Links are public URLs and are safe to commit. API keys are secrets, and
this is a public static site.

---

## Key → price map

Every Payment Link must charge exactly this, in GBP.

| Config key | Charge | Type | Button appears on | Button label |
|---|---|---|---|---|
| `starter_build` | **£399** | one-off | `/pricing` — Build your site, Starter card | Get started — £399 |
| `business_build` | **£799** | one-off | `/pricing` — Build your site, Business card | Get started — £799 |
| `care_basic` | **£39** | recurring, monthly | `/pricing` — Care plans, Basic card | Choose Basic — £39/mo |
| `care_pro` | **£79** | recurring, monthly | `/pricing` — Care plans, Pro card | Choose Pro — £79/mo |
| `care_growth` | **£129** | recurring, monthly | `/pricing` — Care plans, Growth card | Choose Growth — £129/mo |
| `addon_copywriting` | **£150** | one-off | `/addons` — One-off add-ons | Buy — £150 |
| `addon_logo` | **£250** | one-off | `/addons` — One-off add-ons | Buy — £250 |
| `addon_gbp` | **£299** | one-off | `/addons` — One-off add-ons | Buy — £299 |
| `addon_booking` | **£200** | one-off | `/addons` — One-off add-ons | Buy — £200 |
| `addon_shop` | **£500** | one-off | `/addons` — One-off add-ons | Buy — £500 |
| `addon_refresh` | **£600** | one-off | `/addons` — One-off add-ons | Buy — £600 |
| `addon_seo` | **£150** | recurring, monthly | `/addons` — Monthly add-ons | Subscribe — £150/mo |
| `addon_reviews` | **£29** | recurring, monthly | `/addons` — Monthly add-ons | Subscribe — £29/mo |

Thirteen keys, thirteen buttons, one button per key. The price is printed in
every button label on purpose: if a link is pasted against the wrong key, the
mismatch between the label and the Stripe page is visible immediately rather
than only at the moment someone is charged.

### Link status — 1 September 2026

Five links are live. Eight keys are **deliberately** still empty strings.

| Config key | Status | Configured value |
|---|---|---|
| `starter_build` | **LIVE** | `https://buy.stripe.com/fZuaEWeSx4xp9XB2wkeIw0h` |
| `business_build` | **LIVE** | `https://buy.stripe.com/bJe28qbGl0h94Dh3AoeIw0i` |
| `care_basic` | **LIVE** | `https://buy.stripe.com/6oUbJ06m1e7ZfhVdaYeIw0l` |
| `care_pro` | **LIVE** | `https://buy.stripe.com/3cI00i4dTbZR9XB3AoeIw0j` |
| `care_growth` | **LIVE** | `https://buy.stripe.com/bJe9AS6m18NFedR6MAeIw0k` |
| `addon_copywriting` | empty — no Stripe product exists yet | `""` → `/contact.html` |
| `addon_logo` | empty — no Stripe product exists yet | `""` → `/contact.html` |
| `addon_gbp` | empty — no Stripe product exists yet | `""` → `/contact.html` |
| `addon_booking` | empty — no Stripe product exists yet | `""` → `/contact.html` |
| `addon_shop` | empty — no Stripe product exists yet | `""` → `/contact.html` |
| `addon_refresh` | empty — no Stripe product exists yet | `""` → `/contact.html` |
| `addon_seo` | empty — no Stripe product exists yet | `""` → `/contact.html` |
| `addon_reviews` | empty — no Stripe product exists yet | `""` → `/contact.html` |

The eight `addon_*` keys are not an oversight. No Payment Link has been created
for any of the add-ons, so every `/addons` buy button still falls back to
`/contact.html` exactly as described below. **Leave them as `""`.**

So `document.querySelectorAll('[data-buy-live]').length` should currently
report **5** on `/pricing` across the whole site, and **0** on `/addons`.

> **Still to verify in Stripe.** The checklist below asks that every configured
> link opens a Stripe page showing the same amount as the button label. That
> cannot be confirmed from this repository — what a Payment Link charges, its
> currency, its interval and whether Stripe Tax is off are only visible in the
> dashboard. The five URLs above were supplied as already-created links. Open
> each one and check it against the price map before sending customers to
> `/pricing`.

### Not wired, on purpose

- **Platform / shop — "Custom, quoted per project"** on `/pricing`. Has no key
  and no `data-buy`; its CTA still goes to the contact form for a quote. Leave
  it that way.
- **Extra page £150**, **Photography & imagery £120**, **Content & social
  £99/mo**, **Google Ads management £249/mo** on `/addons`. These four were not
  in the list of purchasable items, so they show an "Enquire — £X" link to the
  contact page instead. If they should be buyable, add a key here and in
  `STRIPE_PAYMENT_LINKS`, then put `data-buy="…"` on the anchor.

---

## How the fallback works

Every buy button ships in the HTML like this:

```html
<a class="btn btn-ghost" data-buy="starter_build" href="/contact.html">Get started — £399</a>
```

The `href` is the contact page — the behaviour the site had before checkout
existed. On `DOMContentLoaded`, `wireCheckout()` replaces that `href` **only**
when the configured value matches:

```
^https://(buy|checkout)\.stripe\.com/[^\s"'<>]+$
```

Everything else is ignored and the button keeps its contact-page link:

| Configured value | Result |
|---|---|
| `""` (unconfigured) | falls back to `/contact.html` |
| `"PASTE_LINK_HERE"` or any placeholder | falls back |
| `http://buy.stripe.com/…` (not https) | falls back |
| `https://buy.stripe.com/` (no payment path) | falls back |
| `https://buy.stripe.com.someone-else.tld/x` | falls back |
| `https://buy.stripe.com@someone-else.tld/x` | falls back |
| `https://evil.tld/buy.stripe.com/x` | falls back |
| a `data-buy` key not in the object | falls back |
| `https://buy.stripe.com/…` | upgraded to Stripe |
| `https://checkout.stripe.com/…` | upgraded to Stripe |

**So a half-configured deploy can never render a dead checkout button.** Configure
one key or thirteen; the rest keep taking enquiries. This is deliberate and
should not be "simplified" away.

Upgraded anchors get a `data-buy-live` attribute, which is a quick way to check
in devtools which buttons are actually live:

```js
document.querySelectorAll('[data-buy-live]').length
```

---

## Payment Links already live on this site

`start.html` (the `noindex` page used after someone has seen their demo) has
three hard-coded Payment Links that pre-date this config. They are **not** in
`STRIPE_PAYMENT_LINKS` and were left exactly as they were:

| Button | Link | What the page says it charges |
|---|---|---|
| Pay £250 and start (Starter site) | `buy.stripe.com/cNi14meSx8NF9XBgnaeIw03` | £250 deposit, £149 balance on go-live |
| Pay £250 and start (Business site) | `buy.stripe.com/9B6fZg4dTe7Z3zdb2QeIw00` | £250 deposit, £549 balance on go-live |
| Start care plan | `buy.stripe.com/cNi4gybGld3V9XBgnaeIw02` | £39 / month |

Two things to know:

1. **Do not reuse the two build links for `starter_build` or `business_build`.**
   Those take a **£250 deposit**, not the full £399 / £799. Pasting either into
   the config would undercharge every customer who buys from `/pricing`.
2. The `start.html` care plan link looks like the same product as `care_basic`
   (£39 a month), but it is **not** the link now configured. As of
   1 September 2026 `care_basic` points at a different, newly supplied Payment
   Link ending `eIw0l`. There are therefore now two Stripe links on this site
   that both appear to charge £39/month: the hard-coded one on `start.html`
   and the configured one behind `/pricing`. That may well be intentional —
   `start.html` is a separate post-demo flow — but **check in the Stripe
   dashboard whether they are the same product**, and retire one if they are
   accidental duplicates.

---

## Setting up a link

1. Stripe Dashboard → Product catalogue → add the product at the exact price in
   the table above. Currency GBP. Recurring monthly for the four subscription
   rows, one-off for the rest.
2. Payment Links → create a link for that product.
3. Copy the `https://buy.stripe.com/…` URL into the matching key in
   `assets/js/main.js`.
4. Commit and deploy.

## Before you call it done

- [ ] Every configured link opens a Stripe page showing **the same amount as the
      button label**, in GBP, with no tax line.
- [ ] Monthly items say "per month" on the Stripe page; one-off items do not.
- [ ] Buttons you have not configured still open `/contact.html`.
- [ ] `document.querySelectorAll('[data-buy-live]').length` matches the number
      of keys you filled in.
- [ ] No `sk_live`, `sk_test` or `rk_` string anywhere in the repo.

---

## Headers and hosting

`vercel.json` sets `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN` and
`Referrer-Policy` only.

- There is **no `Content-Security-Policy`**, so nothing needs adding to
  `form-action` or `connect-src` for checkout to work today.
- There is **no `Permissions-Policy`**, so nothing is blocking `payment`.
- Stripe Payment Links are plain top-level navigations from an `<a href>`. They
  do not use the Payment Request API and are not framed, so
  `X-Frame-Options: SAMEORIGIN` does not affect them.

**If a CSP is ever added to this site**, it must include
`https://buy.stripe.com` and `https://checkout.stripe.com` in `form-action` and
`connect-src`, or checkout will break silently.

`sw.js` ignores every request that is not same-origin, so the service worker
never caches a Stripe page and can never serve `/index.html` in place of a
checkout when the network is poor.
