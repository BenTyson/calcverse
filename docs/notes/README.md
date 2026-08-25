# Chip notes

One file per chip: `docs/notes/<CHIP-NAME>.md`.

**Chips write only their own file here. Nobody else writes to another chip's file.**

This directory exists so chips never touch shared docs. A chip that wants something in the changelog, the status doc, or the architecture reference writes a pre-drafted entry into its own notes file; the Integrator merges it after the wave closes, verifying against the repo first.

Template and requirements: `docs/CHIP-PROTOCOL.md` §9. The Reflections section is mandatory and opens with a findings table.

Naming: `CHIP-<AREA>-<SCOPE>.md`, e.g. `CHIP-CTR-CALC.md`, `CHIP-HUB-SPEC.md`. Chips never assign themselves a wave or version number — the Integrator does that.
