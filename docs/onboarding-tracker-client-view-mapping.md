# Onboarding Tracker — Client-Facing View Mapping

**Purpose:** HubSpot holds the *admin* truth for onboarding (Onboardings custom object, `Standard Onboarding` pipeline). This document defines what the **client** sees at each pipeline stage, and which HubSpot property drives it.

**Core principle:** the client tracker is not a mirror of HubSpot. HubSpot answers *"who is blocking this record?"*. The client only ever needs three answers per item:

1. Is it **done**?
2. Is it **waiting on me** — and exactly what do I hand over?
3. Is it **waiting on Kasper or a carrier** — and roughly how long?

Everything in HubSpot that does not serve one of those three answers stays admin-only.

---

## 1. The translation layer

### 1.1 Status vocabulary

Admin has ~6 states. The client gets 4, and only 4, everywhere in the product.

| HubSpot `Current State` / item status | Client chip | Client colour | Client meaning |
|---|---|---|---|
| `Pending Office` | **Action needed** | Amber | "We need something from you." Always paired with a concrete CTA. |
| `Pending Kasper` | **In progress** | Blue | "Kasper is working on it." Show an ETA. |
| `Pending Third Party` | **Under review** | Blue | "With your carrier / the registry." Show an ETA + why it's out of our hands. |
| `Blocked` | **Needs attention** | Amber | Never surface the word "blocked". Show "We've hit a snag — your specialist is reaching out." |
| `Not Started` | **Up next** | Grey | Locked, with the unlock condition stated. |
| `In Progress` / `Complete` | **In progress** / **Complete** | Blue / Green | — |

### 1.2 Never shown to the client

| Admin field | Why it stays internal |
|---|---|
| `Current State` raw values | "Pending Office" reads as blame; the client sees the action, not the label. |
| `Next Action` (e.g. `website url & cust profile`) | Internal shorthand for the specialist. |
| `Active Workstream` chips | Internal routing. The client sees the cards themselves. |
| `Time in current stage` | Surfaces our SLA misses without context. |
| `Twilio Configuration` (`Non Config`) | Pure provisioning plumbing. |
| `A2P Campaign = Rejected` | Show "Registration returned for more detail — resubmitted" plus the *one* thing to fix. Never the word "rejected". |
| `Compliance Progress` flags | These are admin triage buckets; each maps to a client CTA instead (see §2.4). |
| Record owner, pipeline names, HubSpot IDs | — |

### 1.3 Rules that apply to every stage

- **One consolidated to-do at the top.** Every item currently `Pending Office`, across every card, rolls into a single "Needs you" list at the top of the tracker. The client must never hunt across five cards to find their two tasks.
- **Every card answers four questions:** what is this, who is it waiting on, what do I do, when will it be done.
- **Progress never goes backwards.** Stage progress = weighted completion of that stage's items. An A2P resubmission does not reset the bar.
- **Locked items state their unlock condition** — "Starts once your Customer Profile is approved" — so silence never looks like neglect.
- **Notify on transition only:** email/SMS when an item flips to *Action needed*, and when a milestone completes. Not on internal state churn.

---

## 2. Stage-by-stage

### Stage 1 — Deal Won → client: **"Welcome to Kasper"**

| | |
|---|---|
| **HubSpot** | Deal `Closed Won` → Onboarding record created. `Welcome Email = Sent`, `Intake = Not Started`. |
| **Client headline** | "Welcome aboard — let's get your office set up." |
| **Progress** | 0% |

**Client sees**
- Welcome panel: what the next 3 steps are and the realistic timeline.
- Their onboarding specialist: name, photo, email, direct line, booking link.
- A "what we'll need from you" preview — website URL, EIN, a signed LOA, a recent carrier bill — so nothing is a surprise later.
- All other modules rendered **locked**, labelled "Unlocks after your intake form".

**Client does:** one CTA only — *Start your intake form*.

**Exits when:** intake form is opened.

---

### Stage 2 — Intake Form → client: **"Getting Started"**

| | |
|---|---|
| **HubSpot** | Feeds Office Display Name, contact names/email/mobile, Desired URL, basic office info, point of contact + extra contact, phone/fax/hardware counts, business registration (EIN, legal name, address), opening date. Sets `Intake = Complete`. |
| **Client headline** | "Waiting on you — 4 of 6 sections complete." |
| **Progress** | % of required fields completed. |

**Client sees**
- The intake form split into named sections with a live checklist:
  - Office & display name
  - Point of contact (+ secondary contact)
  - Phones, fax & hardware counts
  - Business registration & compliance (legal name, EIN, address)
  - Website / desired URL
  - Opening date
- Save-and-resume; the client will not finish this in one sitting.
- Per-field "why we need this" microcopy on the sensitive asks (EIN, LOA, billing statement) — this is where drop-off happens.

**Design note — kill two recurring blockers here.** `No Website Domain` and `Opening Date Missing` are two of the most common `Compliance Progress` flags on the board today. Make **website URL** and **opening date** required fields in intake (with an explicit "I don't have a website yet" branch that triggers the Kasper-hosted compliance page), and both flags largely stop occurring downstream.

**Exits when:** `Intake = Complete`.

---

### Stage 3 — Kasper Admin Setup (tenant creation) → client: **"Building Your Account"**

This is an internal stage. The client-facing job here is purely to prevent "has anyone forgotten about us?" support calls.

| | |
|---|---|
| **HubSpot** | Kasper team works in admin. No client-editable properties. |
| **Client headline** | "We're building your Kasper account — nothing needed from you right now." |

**Client sees**
- A single card with a generic 4-step checklist that ticks over as the team works: Account created → Modules enabled → Users provisioned → Data migration (if applicable).
- An honest ETA: "Usually 1–2 business days."
- Everything else still locked, with unlock conditions shown.

**Client does:** nothing. Say so explicitly and prominently.

**Exits when:** tenant is created → Core Setup modules unlock.

---

### Stage 4 — Core Setup → client: **"Compliance & Communication"**

The heavy stage — this is where most records sit (The Tooth Workshop is here today). All modules unlock. Stage headline is the consolidated to-do: **"3 things need your attention."**

#### 4.1 Card — SMS & Messaging (the compliance chain)

Render this as a visibly **sequential 5-step chain**, not five independent tiles. It is sequential, and showing that is what stops "why has nothing moved in a week?".

| Step | HubSpot property | Client state & action |
|---|---|---|
| 1. Website URL | `Website` | Empty → **Action needed**: "Add your website URL." Offer the no-website branch: Kasper hosts a compliance page for you. |
| 2. Customer Profile | `Customer Profile` (`Not Set Up` / In review / Approved) | Needs legal business name, EIN, address. → "Submitted for review." |
| 3. Compliance Registration | `Compliance Registration` | **In progress**: "Kasper is registering your business with the messaging registry." |
| 4. Website Compliance | `Website Compliance` (`Pending Office`) | **Action needed**: "Your site needs a privacy policy and SMS consent language." Give copy-paste snippets + two buttons: *Mark as added* / *Have Kasper host it*. |
| 5. A2P Campaign | `A2P Campaign` | **Under review**: "With the carrier — typically 2–5 business days." If returned, show only the item to correct. |

Steps 2–5 render locked until their predecessor clears, each stating why.

#### 4.2 Card — Phone Setup

| Client element | HubSpot source |
|---|---|
| Two sub-tracks: *Porting an existing number* or *New number* | `Phone` |
| Documents to provide: **Sign LOA** (e-sign link) and **Upload recent carrier bill** | `Required Documents` = `LOA Pending`, `Billing Statement Pending`; `Required Documents Status` |
| Numbers being ported, listed | `Office Number`, `Extra Phone Numbers` |
| Port date: *Requested* → *Confirmed for [date]* → *Complete* | `Phone Port Date` |
| Standing warning: **"Do not cancel your current phone service until porting completes."** | — |
| *(hidden)* | `Twilio Configuration` |

The two documents are the highest-value actionable items in the whole tracker — put them in the top-level to-do list, not buried in the card.

#### 4.3 Card — Fax Setup

Same pattern as phone. When `Fax = New Provided`, collapse it to a single done-state line: *"Your new Kasper fax number: 804-804-9846 — active."* Driven by `Fax`, `Fax Port Date`, `Office Fax Number`.

#### 4.4 Card — Hardware Phones

From `Hardware Phones`. Client sees: models and quantity, order status, tracking number, and "arriving before your installation date" — tied to `Installation Date` so the two stay visibly linked.

#### 4.5 Card — Forms

Digital forms to select, review and approve. Client sees the list with per-form status and a preview.

#### 4.6 Compliance Progress flags → client CTAs

| Admin flag | What the client actually sees |
|---|---|
| `No Website Domain` | Step 1 of the SMS chain is *Action needed*, with the no-website branch offered. |
| `Opening Date Missing` | "Confirm your opening date" in the to-do list. |
| `A2P Rejected` | "Registration returned for more detail — we've resubmitted" + the single field to correct. |
| `Open Office` / `Open Soon` | Not shown. Internal prioritisation only. |

**Exits when:** compliance chain approved, documents received, ports submitted.

---

### Stage 5 — Ready to Schedule → client: **"Schedule Your Installation"**

| | |
|---|---|
| **HubSpot** | `Installation` / `Installation Date`, `Set up Call` / `Set up Date`, training meeting. |
| **Client headline** | "Book your three onboarding sessions." |

**Client sees** three meeting cards in order, each with embedded booking:

1. **Installation Meeting** — "We install Kasper on your main server." Prep checklist: server access, admin credentials, IT contact available, ~2-hour window.
2. **Setup Call** — "We configure the office, verify settings, and make sure the system is ready to use."
3. **Training Meeting** — "We train your team." Who should attend, how many seats.

Each card cycles: *Not scheduled* → CTA **Book a time** · *Scheduled* → date, time, join link, add-to-calendar, reschedule · *Complete* → checkmark + recap/recording.

**Also on this stage:** a persistent "still running in the background" strip for anything from Core Setup that overlaps — A2P still under review, port date pending. These genuinely run in parallel; hiding them makes clients think something was dropped.

**Exits when:** installation is booked and completed.

---

### Stage 6 — Post Installation → client: **"You're Live with Kasper"**

Per the process design, this stage can be skipped — the office is actively using Kasper while some services finish.

**Client sees**
- A "You're live" banner with the go-live date.
- **Finishing touches** — only the items still open, each with owner and ETA:
  - SMS may still be pending (A2P approval)
  - Phone or fax porting may still be pending
  - Forms may still be in progress
  - Training may still be upcoming
- First-week resources: quick-start videos, help centre, support number, adoption tips.
- A **"Something isn't working"** button that opens a ticket — not a mailto.

**Exits when:** all workstreams closed.

---

### Stage 7 — Final Readiness (Quality Check) → client: **"Final Review"**

This is where the client signs off, not just where we QA internally.

**Client sees** a confirmation checklist they tick themselves, each line with a *Report a problem* link:

- Phones ring and route correctly
- Fax sends and receives
- Text messaging works
- Forms submit correctly
- Hardware phones working
- Team has been trained

Plus the handoff notice: *"Your account moves to your Customer Success Manager — meet [name]"* with their contact details and first check-in date.

**Client does:** press **Confirm everything works**, or flag specific lines (which reopens the matching card and pushes the record back to the owning workstream in HubSpot).

**Exits when:** client confirms **and** internal QA passes.

---

### Stage 8 — Closed → client: **"Onboarding Complete"**

**Client sees**
- Completion moment, then a permanent **summary card** they will come back to:
  - Go-live date
  - Their phone number(s), fax number, website URL
  - What's configured (modules, users, hardware)
  - Training recordings
- Support routes: CSM, help centre, support line.
- A short feedback / NPS prompt.
- The tracker becomes read-only archive ("View onboarding summary"); primary navigation switches from tracker to support.

---

## 3. Quick reference — property → client surface

| HubSpot property | Stage | Client surface |
|---|---|---|
| `Intake` | 2 | Getting Started progress |
| `Welcome Email` | 1 | *(not shown)* |
| `Website` | 4 | SMS chain step 1 |
| `Customer Profile` | 4 | SMS chain step 2 |
| `Compliance Registration` | 4 | SMS chain step 3 |
| `Website Compliance` | 4 | SMS chain step 4 |
| `A2P Campaign` | 4 | SMS chain step 5 |
| `Hardware Phones` | 4 | Hardware Phones card |
| `Required Documents` / `…Status` | 4 | LOA + billing statement to-dos |
| `Phone`, `Phone Port Date` | 4 | Phone Setup card |
| `Fax`, `Fax Port Date` | 4 | Fax Setup card |
| `Office Number`, `Office Fax Number`, `Extra Phone Numbers` | 4 / 8 | Your numbers (card + final summary) |
| `Twilio Configuration` | — | *(never shown)* |
| `Installation`, `Installation Date` | 5 | Installation meeting card |
| `Set up Call`, `Set up Date` | 5 | Setup call card |
| `Current State`, `Compliance Progress`, `Next Action`, `Active Workstream` | all | *(never shown — drive chips and CTAs instead)* |

---

## 4. Worked example — The Tooth Workshop, today

Admin record: stage `Core Setup`, `Current State = Pending Office`, `Compliance Progress = No Website Domain`, `Next Action = website url & cust profile`, `Website Compliance = Pending Office`, `Required Documents = LOA Pending, Billing Statement Pending`, `Hardware Phones = Configured`, `Fax = New Provided`.

What the client would see:

> **Compliance & Communication** — Step 4 of 7
>
> **3 things need you:**
> 1. Add your website URL → *SMS & Messaging*
> 2. Sign your Letter of Authorization → *Phone Setup*
> 3. Upload a recent phone bill → *Phone Setup*
>
> **In progress by Kasper:** Customer Profile — starts as soon as your website URL is in.
> **Done:** Hardware phones configured · Your new fax number 804-804-9846 is active.

One screen, three tasks, no jargon, and the causal link ("Customer Profile is waiting on your URL") made explicit — which is exactly the link the admin `Next Action` field currently encodes for staff only.
