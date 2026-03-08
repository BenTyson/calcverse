Update project documentation after completing a roadmap phase.

## Instructions

You just completed work on CalcFalcon. Update the docs to reflect the current state. Follow these steps:

### 1. Gather current state

Run these commands to understand what changed:
- `npm run build` — get page count from output
- `grep -r "client:load\|client:visible" src/pages/ --include="*.astro" | grep -v embed | head -5` — verify hydration strategy
- `ls src/components/calculators/*.tsx | wc -l` — calculator count
- `ls src/pages/*/index.astro` — active categories
- `grep -r "Calcverse\|calcverse" src/ public/ --include="*.{astro,tsx,ts,svg,txt,json,mjs,css}"` — check for stale branding

### 2. Update `docs/STATUS.md`

This is the single source of truth. Update:
- Calculator count and list (if calculators were added/removed)
- Page count (from build output)
- "What's Done" section — move completed items from roadmap
- "What's NOT Done" section — remove items that are now done
- "Last Updated" date
- Any new known issues discovered during work

### 3. Update `docs/ROADMAP.md`

- Mark completed phases as DONE in the summary table
- Update the "NEXT" marker to the correct phase
- Remove detailed task lists for completed phases (keep one-line summary)
- If new work was planned during the session, add it to the appropriate phase

### 4. Update `CLAUDE.md` (root)

Only if structural changes were made:
- New key files added (layouts, shared components)
- New rules or conventions established
- Architecture changes (new layers, new patterns)
- Design system changes (new colors, new components)

Do NOT update CLAUDE.md for routine calculator additions or content changes.

### 5. Update `docs/ARCHITECTURE.md`

Only if:
- New component types were created (e.g., chart components)
- Directory structure changed
- New integration patterns were added
- Build configuration changed

### 6. Update `docs/ADDING-CALCULATORS.md`

Only if:
- The calculator creation process changed
- New required steps were added
- New shared components were created that calculators should use

### 7. Update `docs/DECISIONS.md`

Only if new decisions were made during the session that future agents should respect.

### 8. Archive stale content

If any doc section is no longer relevant:
- Move historical/completed content to `docs/archive/`
- Keep docs focused on current state and forward-looking plans

### 9. Update auto-memory

Update `/Users/bentyson/.claude/projects/-Users-bentyson-calcverse/memory/MEMORY.md` with:
- Any new gotchas or patterns discovered
- Updated counts and status
- Remove outdated entries

### Rules

- Be concise. Docs are for agents, not humans reading prose.
- Tables over paragraphs. Lists over sentences.
- Never duplicate information across docs. Each fact lives in one place.
- `STATUS.md` = what IS. `ROADMAP.md` = what's NEXT. `DECISIONS.md` = what's SETTLED.
- Don't add session logs or timestamps beyond "Last Updated" in STATUS.md.
- Run `npm run build` to verify the build still passes after any changes.
