# Deployment Guide

## Current Status

- **Build:** Ready (`npm run build` succeeds)
- **Deployment:** Not yet deployed
- **Domain:** Not yet purchased

---

## Deploy to Cloudflare Pages

### Option 1: Git Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - Phase 1 complete"
   git push origin main
   ```

2. **Connect in Cloudflare Dashboard**
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project" → "Connect to Git"
   - Select your repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
     - **Node.js version:** 20

3. **Environment Variables**
   ```
   NODE_VERSION=20
   ```

4. **Deploy**
   - Click "Save and Deploy"
   - Initial deploy takes 1-2 minutes

### Option 2: Direct Upload

```bash
npm run build
npx wrangler pages deploy dist --project-name=calcverse
```

---

## Custom Domain Setup

1. **Purchase domain** (e.g., calcverse.com)
   - Namecheap, Cloudflare Registrar, or similar

2. **Add to Cloudflare Pages**
   - Pages project → Custom domains
   - Add your domain
   - Follow DNS configuration instructions

3. **Update astro.config.mjs**
   ```javascript
   export default defineConfig({
     site: 'https://calcverse.com',  // Update this
     // ...
   });
   ```

4. **Rebuild and redeploy**

---

## Post-Deployment Checklist

### Immediate (Day 1)

- [ ] Verify all pages load correctly
- [ ] Test all 3 calculators
- [ ] Test URL sharing (copy URL with results, open in new tab)
- [ ] Test embed codes
- [ ] Check mobile responsiveness
- [ ] Verify sitemap at `/sitemap-index.xml`

### SEO Setup (Day 1-2)

- [ ] Add site to Google Search Console
- [ ] Submit sitemap
- [ ] Add site to Bing Webmaster Tools
- [ ] Verify robots.txt allows crawling

### Analytics (When Ready)

- [ ] Sign up for Plausible Analytics
- [ ] Add tracking script to BaseLayout.astro:
  ```html
  <script defer data-domain="calcverse.com"
          src="https://plausible.io/js/script.js"></script>
  ```
- [ ] Verify events are tracking

### Monitoring

- [ ] Set up Cloudflare Analytics (free, automatic)
- [ ] Check Core Web Vitals in Search Console
- [ ] Monitor for crawl errors

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
- Deployed to Cloudflare Pages
- Automatic HTTPS
- Global CDN

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules .astro dist
npm install
npm run build
```

### Deploy Fails

1. Check Cloudflare Pages build logs
2. Verify Node.js version is 20
3. Ensure all dependencies are in package.json

### Pages Not Updating

- Cloudflare caches aggressively
- Wait 1-2 minutes after deploy
- Hard refresh browser (Cmd+Shift+R)
- Check Cloudflare dashboard for deploy status

### Sitemap Issues

- Sitemap is at `/sitemap-index.xml` (not `/sitemap.xml`)
- Embed pages are excluded by design
- Verify in Google Search Console

---

## Continuous Deployment

Once Git integration is set up:

1. Push to `main` branch
2. Cloudflare automatically builds and deploys
3. Preview deployments created for pull requests

No manual deployment needed after initial setup.
