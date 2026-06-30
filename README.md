# Ship It Studio — agency site

A single-file, no-build website that showcases your work with live links and captures leads. Open `index.html` to view it. Deploys to Vercel in one click, same as your other sites.

## ✅ Three things to switch on (5 minutes)

All edits are in **`index.html`**, near the bottom in the `<script>` block.

### 1. Your WhatsApp number
Find this line and replace the number (international format, no `+`, no spaces):
```js
const WHATSAPP = "447399479952"; // TODO: replace with YOUR WhatsApp number
```

### 2. Activate the contact form (Web3Forms — free)
1. Go to https://web3forms.com and enter `triggsoliver@gmail.com`.
2. Copy the Access Key they email you.
3. In `index.html` find `REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY` and paste your key between the quotes.

Until you do this, the form shows a friendly "not yet activated" notice instead of sending. Email link and WhatsApp already work.

### 3. Confirm the live project links
The work grid is driven by the `PROJECTS` array (top of the `<script>`). Each project has a `url`. I filled in the ones I could infer from your repos — **please confirm or correct these**, and add the missing ones:

| Project | Current link | Action |
|---|---|---|
| Car Events Near Me | `careventsnearme.uk` | confirm it's live |
| Prime Origins Atlas | `atlas.primeorigins.org` | confirm it's live |
| Bromspec Motorworks | `bromspec.co.uk` | confirm it's live |
| GenoVaq | _(hidden — marked private)_ | add a URL + set `private:false` if you want it public |
| Prime Origins Global | _(blank — "coming soon")_ | add live URL |
| AJS Vehicle Services | _(blank)_ | add live URL |
| Man With A Whistle | _(blank)_ | add live URL |
| Veles Capital | _(blank)_ | add live URL |

To add a link, just fill the `url:""` for that project, e.g. `url:"https://ajsvehicleservices.co.uk"`. Blank = shows "Live link coming soon". `private:true` = shows "Private — demo on request".

## 🚀 Deploy

1. Create a new GitHub repo (e.g. `ship-it-studio`) and push this folder:
   ```bash
   cd "ship-it-studio"
   git init && git add . && git commit -m "Ship It Studio site"
   git branch -M main
   git remote add origin https://github.com/triggsoliver-ship-it/ship-it-studio.git
   git push -u origin main
   ```
2. Go to https://vercel.com/new → import the repo → Framework: **Other** → **Deploy**.
3. Add a custom domain under **Settings → Domains** when ready (e.g. `shipitstudio.co.uk`).

Every push to `main` auto-deploys.

## Editing copy
All text is plain HTML in `index.html`. Pricing is in the `#pricing` section; services in `#services`. Brand colour is `--accent` in the `:root` CSS at the top — change it once to re-tint the whole site.
