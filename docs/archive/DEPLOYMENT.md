# Deployment Guide

## Current Status

- **Build:** Passing (`npm run build` succeeds)
- **Deployment:** **LIVE** on Railway
- **URL:** `https://calcverse-production.up.railway.app`
- **Domain:** Using Railway subdomain (custom domain pending)

---

## Railway Deployment (Current Setup)

### How It Works

1. **GitHub Integration**: Railway auto-deploys when you push to `main`
2. **Build Process**: Railway runs `npm run build` via Nixpacks
3. **Static Serving**: Uses `serve` package to serve the `dist/` folder
4. **Configuration**: `railway.json` defines the start command

### railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npx serve dist -l 3000",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  }
}
```

### To Redeploy

Just push to main:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Railway automatically rebuilds and deploys within 1-2 minutes.

### View Deployment Status

1. Go to [railway.app](https://railway.app)
2. Open your project
3. Click on the service to see build logs

---

## Custom Domain Setup (Future)

When ready for a custom domain:

1. **Purchase domain** (e.g., calcverse.com from Namecheap, Cloudflare, etc.)

2. **Add to Railway:**
   - Project Settings → Domains → Add Custom Domain
   - Follow DNS configuration instructions

3. **Update astro.config.mjs:**
   ```javascript
   export default defineConfig({
     site: 'https://calcverse.com',  // Update this
     // ...
   });
   ```

4. **Push changes** - Railway will redeploy automatically

---

## Post-Deployment Checklist

### Already Done
- [x] All pages load correctly
- [x] All 16 calculators working
- [x] URL sharing functional
- [x] Embed codes working
- [x] Mobile responsive
- [x] Sitemap at `/sitemap-index.xml`
- [x] Privacy Policy and Terms of Service pages
- [x] Production URL in astro.config.mjs

### SEO Setup (TODO - Manual Steps)
- [ ] Add site to Google Search Console
- [ ] Verify ownership (HTML meta tag or DNS)
- [ ] Submit sitemap: `https://calcverse-production.up.railway.app/sitemap-index.xml`
- [ ] Add site to Bing Webmaster Tools (optional)

### When Traffic Exists
- [ ] Add Plausible Analytics script to BaseLayout.astro:
  ```html
  <script defer data-domain="calcverse-production.up.railway.app"
          src="https://plausible.io/js/script.js"></script>
  ```
- [ ] Apply for Google AdSense (when >1000 visits/month)
- [ ] Check Core Web Vitals in Search Console

---

## Environment Configuration

### Development
```bash
npm run dev
# Runs on http://localhost:4321
```

### Production Preview
```bash
npm run build && npm run preview
# Runs on http://localhost:4321
```

### Production
- Deployed to Railway
- Automatic HTTPS
- Global deployment

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild locally
rm -rf node_modules .astro dist
npm install
npm run build
```

### Deploy Fails on Railway

1. Check Railway build logs in dashboard
2. Ensure `serve` package is in dependencies
3. Verify `railway.json` is in repo root
4. Check that `npm run build` works locally

### Pages Not Updating

- Railway deploys take 1-2 minutes
- Hard refresh browser (Cmd+Shift+R)
- Check Railway dashboard for deploy status

### Sitemap Issues

- Sitemap is at `/sitemap-index.xml` (not `/sitemap.xml`)
- Embed pages are excluded by design
- Privacy and Terms pages are included

---

## Monitoring

### Free Monitoring Options

1. **Railway Metrics**: Built-in CPU/memory/requests dashboard
2. **Google Search Console**: SEO performance, indexing, errors
3. **Plausible Analytics**: Traffic stats (add when traffic exists)

### What to Watch

- Crawl errors in Search Console
- Indexing progress for calculator pages
- Which calculators get impressions/clicks first
- Core Web Vitals scores

---

## Costs

### Current (Free Tier)

Railway offers a free tier with:
- 500 hours of usage per month
- 512 MB RAM
- 1 GB disk

This is sufficient for a static site.

### If You Exceed Free Tier

Railway pricing is usage-based:
- ~$5/month for low-traffic static sites
- Scales with actual usage

### Alternative (If Needed)

If costs become an issue, the site could be migrated to:
- Cloudflare Pages (fully free for static sites)
- Vercel (generous free tier)
- Netlify (generous free tier)

All would work with the current Astro setup.
