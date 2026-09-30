# KSPR-7998 — Onboarding Tracker (logic core)

Framework-agnostic core for the onboarding tracker described in
[KSPR-7998](https://kasperdental.atlassian.net/browse/KSPR-7998). Intended for
transplant into `bitbucket.org/kasperapp/kasper-apex-react`.

It lives in this repository only as a delivery channel — the cloud session that
wrote it had no credentials for the Bitbucket repo, so it could not be committed
to `feature/KSPR-7998-onboarding-tracker-core-experience` directly. Move these
files into the React app and delete this directory.

## What is here

| File | Contents |
| --- | --- |
| `src/onboardingCatalogue.js` | The 26 sub-steps, six stages, owners, verifiers, pipeline columns |
| `src/onboardingProgress.js` | Status set, permission rules, progress %, current stage, pipeline column |
| `test/onboarding.test.mjs` | 16 tests covering the rules above |

No dependencies, no framework. Plain ES modules.

```
npm test   # 16 passing
```

## Why this part first

The ticket's arithmetic is easy to get subtly wrong and is stated once, then
relied on in four places — the admin dashboard row, the office workspace, the
office pill and every stage view must show the same number. Pulling it into one
tested module means the UI layer cannot drift from it.

The rules implemented:

- **Progress** = Verified sub-steps ÷ countable sub-steps. Stage position is
  not weighted.
- **Not applicable leaves the denominator** — it is removed from the
  calculation, not counted as progress.
- **Current stage** = the first stage holding a non-verified sub-step.
- **Pipeline column** is derived from the first unfinished sub-step, never
  stored.
- **Status permissions** — the office can move an item to Submitted; only
  Kasper sets Verified, Needs correction, Blocked or Not applicable. Needs
  correction and Blocked carry a note the office sees.

## Open questions

Three things could not be resolved from the ticket text:

1. **Stage titles are provisional.** The ticket names the six stages only
   inside the "UPDATED JOURNEY STAGES / PROCESS" screenshot, which is an image.
   The placeholders in `STAGES` need replacing with the real copy.
2. **"Unfinished" is undefined.** The pipeline column comes from "the first
   unfinished sub-step". This treats Not applicable as finished, which follows
   from it leaving the denominator, but the ticket does not say so outright.
3. **Sub-step 3.6 is marked optional** in the ticket ("Patient campaigns
   (optional)") but optional is not one of the eight statuses. It is flagged
   with `optional: true` and still counts toward progress until someone marks
   it Not applicable. Confirm that is intended.

## Not yet built

Everything visual. The Web View V1 panel — persistent at the top of Apex while
an office is onboarding, expanded by default, collapsible, web and mobile
layouts, and the sidebar swap to Onboarding / Office Profile / Training /
Guides & Resources / Explore Kasper Products — needs the real component
conventions and theme tokens from `kasper-apex-react`, plus the mockup
screenshots on the ticket. Writing it without those would produce something
that does not match the Kasper theme, which the ticket calls out as important.
