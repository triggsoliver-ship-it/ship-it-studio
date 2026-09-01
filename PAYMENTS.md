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
| `addon_copywriting` | **£150** | one-off | `/addons` — One-off add-ons **and** `/pricing` — Add-ons | Buy once — £150 |
| `addon_logo` | **£250** | one-off | `/addons` — One-off add-ons **and** `/pricing` — Add-ons | Buy once — £250 |
| `addon_gbp` | **£299** | one-off | `/addons` — One-off add-ons **and** `/pricing` — Add-ons | Buy once — £299 |
| `addon_booking` | **£200** | one-off | `/addons` — One-off add-ons **and** `/pricing` — Add-ons | Buy once — £200 |
| `addon_shop` | **£500** | one-off | `/addons` — One-off add-ons **and** `/pricing` — Add-ons | Buy once — £500 |
| `addon_refresh` | **£600** | one-off | `/addons` — One-off add-ons **and** `/pricing` — Add-ons | Buy once — £600 |
| `addon_seo` | **£150** | **recurring, monthly** | `/addons` — Monthly add-ons **and** `/pricing` — Add-ons | Subscribe — £150 a month, recurring |
| `addon_reviews` | **£29** | **recurring, monthly** | `/addons` — Monthly add-ons **and** `/pricing` — Add-ons | Subscribe — £29 a month, recurring |

Thirteen keys, twenty-one buttons. The five build/care keys have one button
each on `/pricing`; each of the eight `addon_*` keys has **two** buttons — one
on `/addons` and one on `/pricing` — pointing at the same Payment Link with the
same label. The price is printed in every button label on purpose: if a link is
pasted against the wrong key, the mismatch between the label and the Stripe page
is visible immediately rather than only at the moment someone is charged.

### Recurring vs one-off — read this before editing any label

Five of the thirteen are **subscriptions**, not single payments:

| Key | Charge | |
|---|---|---|
| `care_basic` | £39 | every month until cancelled |
| `care_pro` | £79 | every month until cancelled |
| `care_growth` | £129 | every month until cancelled |
| `addon_seo` | **£150** | **every month until cancelled** |
| `addon_reviews` | **£29** | **every month until cancelled** |

The two `addon_*` subscriptions are the easiest on the site to misread, because
they sit in the same add-ons grid as six one-off items and `addon_seo` charges
£150 a month while `addon_copywriting` charges £150 once. So:

- one-off add-on buttons read **"Buy once — £X"**;
- the two monthly add-on buttons read **"Subscribe — £X a month, recurring"**;
- the card body and the section intro on both `/addons` and `/pricing` also say
  in words that the charge repeats every month until cancelled.

Do not shorten those labels back to "Buy — £X" / "Subscribe — £X/mo". A customer
who expects one charge and gets a subscription will raise a chargeback.

### Link status — 1 September 2026

**All thirteen keys are configured and live.** No key is an empty string.

| Config key | Price | Type | Status | Configured value |
|---|---|---|---|---|
| `starter_build` | £399 | one-off | **LIVE** | `https://buy.stripe.com/fZuaEWeSx4xp9XB2wkeIw0h` |
| `business_build` | £799 | one-off | **LIVE** | `https://buy.stripe.com/bJe28qbGl0h94Dh3AoeIw0i` |
| `care_basic` | £39 | **monthly** | **LIVE** | `https://buy.stripe.com/6oUbJ06m1e7ZfhVdaYeIw0l` |
| `care_pro` | £79 | **monthly** | **LIVE** | `https://buy.stripe.com/3cI00i4dTbZR9XB3AoeIw0j` |
| `care_growth` | £129 | **monthly** | **LIVE** | `https://buy.stripe.com/bJe9AS6m18NFedR6MAeIw0k` |
| `addon_copywriting` | £150 | one-off | **LIVE** | `https://buy.stripe.com/14A7sKh0F8NF9XBef2eIw0u` |
| `addon_logo` | £250 | one-off | **LIVE** | `https://buy.stripe.com/3cI00ifWB8NFfhVc6UeIw0v` |
| `addon_gbp` | £299 | one-off | **LIVE** | `https://buy.stripe.com/dRmdR85hXbZRedR9YMeIw0w` |
| `addon_booking` | £200 | one-off | **LIVE** | `https://buy.stripe.com/bJe8wOeSx7JB5Hlb2QeIw0x` |
| `addon_shop` | £500 | one-off | **LIVE** | `https://buy.stripe.com/28EdR8dOt7JB8Txb2QeIw0y` |
| `addon_refresh` | £600 | one-off | **LIVE** | `https://buy.stripe.com/4gMaEWcKpbZRedRef2eIw0z` |
| `addon_seo` | £150 | **monthly, recurring** | **LIVE** | `https://buy.stripe.com/28E6oGfWBgg75Hl1sgeIw0A` |
| `addon_reviews` | £29 | **monthly, recurring** | **LIVE** | `https://buy.stripe.com/14AdR8h0F8NF3zd3AoeIw0B` |

Every one of the thirteen URLs is 46 characters, is unique, and matches
`STRIPE_LINK_RE`, so `wireCheckout()` upgrades all thirteen.

So `document.querySelectorAll('[data-buy-live]').length` should now report
**13** on `/pricing` (5 build/care + 8 add-ons) and **8** on `/addons`.

> **Still to verify in Stripe — all thirteen.** The checklist below asks that
> every configured link opens a Stripe page showing the same amount as the
> button label. That cannot be confirmed from this repository — what a Payment
> Link charges, its currency, its **billing interval** and whether Stripe Tax is
> off are only visible in the dashboard. All thirteen URLs were supplied as
> already-created links and pasted in as given. Open each one and check it
> against the price map before sending customers to `/pricing` or `/addons`.
>
> The two that matter most are `addon_seo` and `addon_reviews`: the site now
> tells customers in three places that these bill **every month**. Confirm both
> Payment Links are attached to a *recurring monthly* GBP price, not a one-off
> one. If either is actually a one-off link the copy is wrong, and if a one-off
> item is secretly recurring the customer will dispute the second charge.

### Not wired, on purpose

- **Platform / shop — "Custom, quoted per project"** on `/pricing`. Has no key
  and no `data-buy`; its CTA still goes to the contact form for a quote. Leave
  it that way.
- **Extra page £150**, **Photography & imagery £120**, **Content & social
  £99/mo**, **Google Ads management £249/mo** on `/addons`. These four were not
  in the list of purchasable items, so they show an "Enquire — £X" link to the
  contact page instead. If they should be buyable, add a key here and in
  `STRIPE_PAYMENT_LINKS`, then put `data-buy="…"` on the anchor. They are
  deliberately absent from the `/pricing` add-ons grid, which lists only the
  eight purchasable add-ons.

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
   the table above. Currency GBP. Recurring monthly for the five subscription
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
