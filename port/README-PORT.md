# Porting this work to AiroTax/Kasper-Dashboard

This session was attached to `gihan-oss/KasperDashboard`, not the real repo.
Everything built here is portable. Three pieces, in order of importance.

## 1. `action-layer.html` — the whole feature, self-contained

One `<style>` + `<script>` block. **Paste it immediately before `</body>`** in
the dashboard's HTML file. It needs no build step and no other file.

It is deliberately generic — it discovers pages, cards and lines at runtime by
scanning the DOM, so it works against whatever version of the dashboard the
AiroTax repo holds, not just the one in this session. It provides:

- **Lands on Company Overview.** Skips the splash gate; splash stays at `?cover=1`.
  Honours `/m/<page>` and `#/m/<page>` deep links.
- **Inline editing on every line.** Click a heading, paragraph, bullet, label or
  measure name and type. No edit mode.
- **An action button beside every line.** Hover any line for `+ Action`; the
  popover names that exact line. Actions carry an owner, a due date and a status
  cycling Not started → In progress → Blocked → Done.
- **Count badges** on lines that carry actions, coloured by worst open status,
  and per-page badges in the sidebar.
- **Persistence** to `localStorage`, plus JSON export/import.

**It expects two hooks that the dashboard already has:** a global `go(id)`
navigation function, and sections with `id="m-<page>"` and `class="mod"`. If the
AiroTax version names these differently, the two spots to change are the
`landing()` function and the `scan()` selector `.mod.on`.

**It also expects one new section to render the roll-up into.** Add both:

```html
<!-- beside the other <section class="mod" ...> elements -->
<section class="mod" id="m-actions" data-crumb="Actionable Items"></section>
```
```js
// as the second entry in MODULES, so it appears in the sidebar
['actions','Actionable Items','Company Strategy Report','Everything flagged as needing attention'],
```

## 2. `vercel.json` — fixes the 404s

The gihan-oss repo has no `index.html`, so on Vercel both `/` and `/m/overview`
returned 404. **Check whether the AiroTax repo has the same gap** — if it has an
`index.html`, you may only need the `/m/:page` rewrite. Change the destination
filename if the dashboard file is named differently there.

## 3. Patches — only if the repos share history

Regenerate them from this branch with:

```
git format-patch origin/main..HEAD -o port/
```

They carry the full diff, including the restore of the gutted dashboard and the
removal of the View/Edit mode toggle from the roadmap and department Gantts.
**They will not apply cleanly if the AiroTax file differs** — in that case use
`action-layer.html` and redo the Gantt change by hand: in `rmRenderCompany`,
`rmRenderDept` and `renderRoadmapV2`, drop the `.seg` View/Edit buttons and
render the timeline and the editable task table together.

## Verification done here

Driven in Chromium: all 16 pages render with no JS errors; actions and edits
survive reload; nothing leaks into saved text; `/`, `/m/overview`, `/m/finance`
and `/m/eng` each open the right page under the rewrite rules; no horizontal
overflow at 390px; dark mode clean.
