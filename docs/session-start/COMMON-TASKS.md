# Common Tasks Reference

Quick reference for frequent operations.

---

## Development

### Start Dev Server
```bash
npm run dev
# http://localhost:4321
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Adding a New Calculator

See `ADDING-CALCULATORS.md` for full guide.

Quick checklist:
1. Create `src/lib/calculators/[name].ts`
2. Create `src/components/calculators/[Name]Calc.tsx`
3. Create `src/pages/[category]/[name]-calculator.astro`
4. Update `src/pages/embed/[...slug].astro`
5. Update category index page
6. Add to related calculators where relevant

---

## Modifying Existing Calculator

### Change Calculation Logic
Edit `src/lib/calculators/[name].ts`
- Keep functions pure (no side effects)
- Update interfaces if inputs/outputs change

### Change UI
Edit `src/components/calculators/[Name]Calc.tsx`
- Add/remove input components
- Modify result display

### Change SEO Content
Edit `src/pages/[category]/[name]-calculator.astro`
- Update title, description
- Add/modify FAQs
- Change related calculators

---

## Adding a New Category

1. Create category folder:
   ```bash
   mkdir -p src/pages/[category]
   ```

2. Create category index page:
   ```astro
   // src/pages/[category]/index.astro
   ---
   import BaseLayout from '@layouts/BaseLayout.astro';
   // ... (see existing category pages for template)
   ---
   ```

3. Update `src/components/layout/Header.astro`:
   ```astro
   const categories = [
     // ... existing
     { name: 'New Category', href: '/new-category' },
   ];
   ```

4. Update `src/components/layout/Footer.astro` similarly

5. Update homepage category grid in `src/pages/index.astro`

---

## Adding Input Components

### New Input Type

1. Create component in `src/components/ui/inputs/`:
   ```tsx
   interface NewInputProps {
     id: string;
     label: string;
     value: /* type */;
     onChange: (value: /* type */) => void;
     helpText?: string;
   }

   export function NewInput({ id, label, value, onChange, helpText }: NewInputProps) {
     return (
       <div className="space-y-1">
         <label htmlFor={id} className="block text-sm font-medium text-gray-700">
           {label}
         </label>
         {/* Input element */}
         {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
       </div>
     );
   }
   ```

2. Use consistent styling with existing inputs

---

## Modifying SEO

### Update Schema.org Markup
Edit `src/lib/seo/schema.ts` for new schema types

### Add New Meta Tags
Edit `src/layouts/BaseLayout.astro` head section

### Change Sitemap Behavior
Edit `astro.config.mjs`:
```javascript
sitemap({
  filter: (page) => !page.includes('/exclude-this/'),
})
```

---

## Styling

### Add New Brand Colors
Edit `src/styles/global.css`:
```css
@theme {
  --color-newcolor-500: #hexvalue;
}
```

### Override Tailwind
Add to `src/styles/global.css` after `@import "tailwindcss";`

---

## Testing

### Manual Testing Checklist
- [ ] Calculator produces correct results
- [ ] All inputs work (type, change, edge cases)
- [ ] Results update in real-time
- [ ] URL updates when inputs change
- [ ] Shared URL restores state correctly
- [ ] Mobile layout works
- [ ] Embed version works
- [ ] No console errors

### Test URL Sharing
1. Set some inputs
2. Copy URL from browser
3. Open in new incognito window
4. Verify inputs are restored

### Test Embed
1. Build project: `npm run build`
2. Preview: `npm run preview`
3. Create test HTML:
   ```html
   <iframe src="http://localhost:4321/embed/[category]/[calc]"
           width="100%" height="500" frameborder="0"></iframe>
   ```
4. Open in browser

---

## Debugging

### Check Build Output
```bash
npm run build
ls -la dist/
```

### Check Bundle Size
Build output shows bundle sizes:
```
dist/_astro/client.xxxxx.js    186.62 kB │ gzip: 58.54 kB
```

### View Generated HTML
```bash
cat dist/freelance/hourly-rate-calculator/index.html
```

### Check Sitemap
```bash
cat dist/sitemap-0.xml
```

---

## Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm install package@latest

# Rebuild after updates
npm run build
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b add-calculator-name

# Make changes...

# Commit
git add .
git commit -m "Add [calculator name] calculator"

# Push
git push origin add-calculator-name

# Create PR or merge to main
```
