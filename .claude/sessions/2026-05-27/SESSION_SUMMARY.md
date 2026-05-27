# Session Summary — 2026-05-27

## Project
CDS Eval Lab (`/Users/dochobbs/Downloads/Consult/cds-eval-lab/`)
Public marketing site at https://dochobbs.github.io/cds-eval-lab/

## Branch
main

## Accomplishments
- Restructured the site from CDS-only single workstream to **three eval workstreams**: single-turn decision support, modular pediatric triage (Clara), multi-turn conversational health (RVO). Added workstreams overview section with three accent-colored cards as the new top-level structure.
- **Deepened Workstream 02 (Clara)** with the framework table (5 modular prompts, 4 specialized judges, 16 personas, P1–P7 prompt iterations, 379 scored conversations). Replaced surface-level findings with concrete numbers from the deeper Clara survey: 100% red-flag recognition, 33% variance rate from persona reruns, Gate 7 scope-boundary failures in 100% of variance cases.
- **Mined the Feb-May benchmarking journey field report** for new content. Added Apr 3 judge overhaul, Apr 5 physician 0/10 review, Mar–Apr 16-round prompt plateau as timeline phases.
- **Added Wren-inspired purple accent (#c77dff)** as second accent alongside cyan. Used on workstream-02 cards, alternating timeline dots, scope callout, second economics row.
- **Reworked Hero stat tiles** for breadth ("1,800+ scored conversations + queries," "330M eval tokens," "13 systems across 3 frameworks," "65 adversarial probes hand-curated").
- **Rewrote About in Hobbs's voice** — cut AI-spam phrases ("growing empirically," "the reason for it is simple"), led with "Practicing pediatrician. I evaluate clinical AI for clinicians."
- **Added 3 new methodology contributions** from workstreams 02/03 (modular composition + specialized judges, variance-as-signal, adversarial-archetype personas) — total now 7 patterns.
- **Replaced inline SVG favicon with ensō glitch PNG** at 32/192/512/1200 sizes.
- **Reverted an editorial monograph design experiment** and refined the bold-technical-brochure aesthetic instead per user preference.

## Commits Made
- 450078b CONTENT: Rewrite About in Michael's voice, update for three workstreams
- 58ecae5 CONTENT: Add three new methodology contributions from workstreams 02/03
- a386d54 DESIGN: Hero stat tiles reframed for breadth and energy
- cfa086b FEATURE: Deepen workstream 02 (Clara) with framework, scale, and variance findings
- 0227971 FEATURE: Restructure as three eval workstreams
- 11d4e47 DESIGN: Replace inline SVG favicon with ensō glitch PNG
- 66ff97f DESIGN+CONTENT: Review-pass edits across hero, scope, suites, queries, leaderboard, timeline
- e767038 FEATURE: Mine the benchmarking-journey field report for new content
- 04e275f FEATURE: Deeper data, hand-curated emphasis, ST/MT scope, Wren accent
- 68020be DESIGN: Revert editorial rewrite, keep bold technical brochure
- 4a18c15 DESIGN: Editorial monograph rewrite to reduce AI-template feel

## Decisions Made
- **Three-workstream framing wins** over single-CDS-focused or "other eval work" alternatives. Reframes the brand from "I do CDS evals" to "I evaluate clinical AI across three modalities."
- **Both Clara and RVO blinded** as "Parent-facing pediatric triage assistant" and "Adult chronic-disease conversational health agent" per existing blinding policy.
- **Bold technical brochure aesthetic retained** over editorial monograph alternative (which was too soft for the user's taste).
- **Wren palette inspired** the secondary accent (#c77dff purple) — kept primary cyan, layered purple as structural overlay.

## Next Steps
- Iterate site content as the eval program evolves
- Consider folding in v1.3 Elation prompt eval results if appropriate (currently in sister repo cds-eval)
