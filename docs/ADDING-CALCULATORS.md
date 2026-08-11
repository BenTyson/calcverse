# Adding New Calculators

Use the `/add-calculator` skill. It covers the full workflow: requirements gathering, all 9 files to create/update, chart selection, content guidelines, cross-linking, and doc updates.

The skill lives at `.claude/commands/add-calculator.md`.

## If your calculator touches tax figures

Read the **Tax Data** section of `CLAUDE.md` first. Short version:

- Import every IRS/SSA figure from `src/lib/calculators/shared/` — never inline it.
- Add a `SourcesBlock` driven by `TAX_YEAR` / `TAX_DATA_LAST_VERIFIED`, never literals.
- Cite only primary-source URLs you actually fetched.
- `npm run check:tax-data` must pass alongside `npm run build`.
