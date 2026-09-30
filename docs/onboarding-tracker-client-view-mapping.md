# Onboarding Tracker — Client-Facing View Mapping

**Purpose:** HubSpot holds the *admin* truth for onboarding (Onboardings custom object, `Standard Onboarding` pipeline). This document defines what the **client** sees, on which channel, in which stage, and which HubSpot property drives it.

**Core principle:** the client tracker is not a mirror of HubSpot. HubSpot answers *"who is blocking this record?"*. The client only ever needs three answers per item:

1. Is it **done**?
2. Is it **waiting on me** — and exactly what do I hand over?
3. Is it **waiting on Kasper or a carrier** — and roughly how long?

Everything in HubSpot that does not serve one of those three answers stays admin-only.

---

## 1. The shape of it

### 1.1 Where the client is

The client is onboarded **onto the website after the intake form**, so the first stretch runs over email and a public form. The portal only exists once the tenant does.

| HubSpot stage | Client channel |
|---|---|
| Deal Won | Email |
| Intake Form (short) | Public form — no login |
| Kasper Admin Setup | Email (credentials) → first login |
| Core Setup → Closed | **The tracker** |

This is the EPIC 1 / EPIC 2 split:

- **EPIC 1 — up to tenant creation.** The short Getting Started form: office display name, first name, last name, email, mobile, desired URL. Runs off-portal.
- **EPIC 2 — the tracker.** Everything after, including the **remaining intake form**, completed inside the tracker as its first stage.

### 1.2 The client's stepper

Eight HubSpot stages, four client stages. Stage 2 is subdivided.

| Client stage | HubSpot stages | Sub-stages |
|---|---|---|
| **1 · Getting Started** | Core Setup (entry) | — |
| **2 · Products & Services** | Core Setup | 2.1 Messaging · 2.2 Hardware Phones · 2.3 Porting / Provisioning · 2.4 Patient Forms |
| **3 · Live with Kasper** | Ready to Schedule → Post Installation | — |
| **4 · Onboarding Complete** | Final Readiness → Closed | — |

Three things span the whole of stage 2 rather than sitting in a sub-stage: the consolidated **Needs you** list, the **schedule** rail, and **progress**.

---

## 2. The translation layer

### 2.1 Status vocabulary

| HubSpot value | Client chip | Colour | Client meaning |
|---|---|---|---|
| `Pending Office`, `Blocked` | **Action needed** | Amber | We need something from you. Always a button, always in the top list. Never surface the word *blocked*. |
| `Pending Kasper` | **In progress** | Blue | Kasper is working on it. No button. Shows an estimate. |
| `Pending Third Party` | **Under review** | Blue | With your carrier or the registry. Names the party and the wait. |
| `Port Requested` | **Port requested** | Blue | With Twilio, waiting on the losing carrier to return a date. |
| `Not Started`, `Ready to Start` | **Up next** | Grey | Locked or not yet begun, with the unlock condition stated. |
| `Complete` | **Complete** | Green | Done, and it stays visible as a record. |

### 2.2 What never gets a card

| Admin field | Why it stays internal |
|---|---|
| `Current State` | "Pending Office" reads as blame; the chip says the action instead. |
| `Next Action` | Specialist shorthand — "website url & cust profile" is a note to a colleague. |
| `Active Workstream` | Internal routing. The 2.1–2.4 sub-stages do this job client-side. |
| `Compliance Progress` | Triage buckets. `No Website Domain` becomes a button; `Open Soon` is not shown. |
| `Twilio Configuration` | Provisioning plumbing with no client meaning. |
| A2P rejection | Show "returned for more detail — resubmitted" plus the one field to correct. |
| Time in current stage | Surfaces our SLA misses without context. |
| Tenant build | Covered by the holding email; nothing to act on. |
| Record owner, pipeline names, IDs | Internal structure. |

### 2.3 Who does the work

A lot of onboarding is entirely ours — Twilio configuration is the clearest case: we do all of it, the client does nothing and has nothing to hand over. The owner decides how an item renders.

| Owner | Client action | How it renders |
|---|---|---|
| **Client** | Yes | Card with a button, and it rolls into the top "needs you" list. |
| **Kasper** | None | Visible *without* a button only if it explains why the client is waiting. Pure plumbing is hidden. |
| **Third party** | None | Always visible, with an ETA and a named party — otherwise the wait reads as Kasper being slow. |

**The rule for our own work:** show it when the client is waiting on it, hide it when they aren't. Twilio provisioning and the tenant build are invisible plumbing. Customer Profile and Compliance Registration are the opposite: the client can't act on either, but they are the reason A2P hasn't started, so they stay visible with no button.

**The failure mode:** hiding *all* our work makes the tracker look stalled during the stretches when we are busiest. If a stage has nothing client-owned in flight, one "Kasper is working on X" line must still be showing.

### 2.4 Rules that apply everywhere

- **One consolidated to-do.** Every `Pending Office` item, from every card, rolls into a single list at the top of the stage.
- **Every card answers four questions:** what is this, who is it waiting on, what do I do, when will it be done.
- **Progress never goes backwards.** An A2P resubmission does not reset the bar.
- **Locked items state their unlock condition.**
- **Notify on transition only** — when an item flips to *Action needed*, and when a milestone completes.
- **Design for a manual sync, at first.** HubSpot and the website sync manually in the first build, with the Twilio API automated later. A chip can be stale by hours, and the client cannot tell "nothing has happened" from "nothing has synced". Until the sync is automatic: show when each card last updated, and treat any date the client plans around — above all the port cutover — as something to confirm against the record.
- **Email carries what the portal can't reach.** Until first login, and for anything urgent after it, email is the channel.
- **Mobile mirrors the website.** The app follows the same getting-started flow, so the batch structure has to work at phone width first.

---

## 3. Card inventory

### Before the tracker — *no cards*

**Deal Won · welcome email**
- Next steps and an honest timeline
- Their specialist — name, email, direct line, booking link
- What we'll need: website URL, EIN, three documents to sign, a recent carrier bill
- "Find your last phone bill now" — porting is the longest part and cannot start without it
- Button → Getting Started form

**Intake Form · Getting Started form** *(public, no login)*
- Office display name · first name · last name · email · mobile · desired URL
- Confirmation stating what happens next and when their login arrives
- Six fields only. Every field added here delays the tenant build.

**Kasper Admin Setup · two emails, then first login**
- **Holding email** — "nothing needed from you right now", 1–2 business days
- **Credentials email** — login and one button into the tracker
- **First login screen** — stepper shows Getting Started active with the welcome and form already behind them; short orientation; remaining intake as the immediate task

---

### Stage 1 · Getting Started

Two jobs: collect the rest of the information, and start everything with a long lead time.

**Your information**
- **Remaining intake form** — a **Start** button, then structured batches with a live checklist, save and resume:
  1. Basic office info
  2. Point of contact
  3. Extra point of contact
  4. Phones, fax & hardware
  5. Business registration & compliance — legal name, EIN, address, opening date

**Start now — longest lead time, and the wait isn't ours**
- **Start your porting** → feeds 2.3
  1. Which numbers are you bringing over? — or take a new Kasper number instead
  2. Sign your three documents — Letter of Agency, Business Associate Agreement, billing statement. Sent by **automated email** and signed **on a Kasper page, not DocuSign**, so the email and the card are two doors into the same place and must show the same state
  3. Upload a recent carrier bill — name and address must match the LOA, the most common reason a port is rejected
  - Same for fax.
- **Confirm your hardware** → feeds 2.2 — handset count, models, shipping address

**Context**
- **Your progress** — stepper, "Stage 1 of 4", percentage
- **Your specialist** — persistent from here on
- **What happens next** — preview of the three stages ahead
- **Products & Services** — locked, "unlocks when your information is complete"

---

### Stage 2 · Products & Services

#### Spans all four sub-stages

- **Needs you** — every `Pending Office` item from all four sub-stages, in one list at the top
- **Your schedule** — two kinds of date:
  - *Dates you book*: installation · setup call · training. Each cycles *Book a time* → date, join link, add to calendar → complete + recording.
  - *Dates the carrier gives us*: phone and fax port cutover. **Not bookable**, so never a *Book a time* button. Written on the moment Twilio returns the losing carrier's schedule, with the day-of warnings, and shown against the installation date.
- **Your progress** — "Stage 2 of 4 · 42%" and the 2.1–2.4 stepper

#### 2.1 Messaging

Almost none of this is the client's — they supplied the URL at intake, the rest is ours or the carrier's. A progress view, not a task list.

- **Messaging compliance chain** — five sequential steps, each locked until the one before clears:
  1. **Website URL** — the office's own site, supplied at intake. A task only if missing
  2. **Customer Profile** — Kasper submits it
  3. **Compliance Registration** — Kasper: EKM, A2P brand, voice integrity
  4. **Website Compliance** — Kasper puts the privacy policy and SMS consent language on their site
  5. **A2P Campaign** — with the carrier, 2–5 business days

The card most at risk of reading as stalled: every step needs a real estimate, not a spinner. A `Pending Office` on Website Compliance cascades from a missing URL — it is not compliance work we are asking the office to do.

#### 2.2 Hardware Phones

Confirmed back in Getting Started; this is where it is tracked to the door.

- **Your handsets** — models and quantity
- **Order & delivery** — ordered → shipped with tracking → delivered, shown against the installation date
- **Configuration** — Kasper configures them. Visible, no button.

#### 2.3 Porting / Provisioning

Two different things under one number. Porting brings existing numbers over and waits on the losing carrier; provisioning is a new Kasper number and is near-instant.

- **Porting — phone** — started in Getting Started, tracked here:
  - Numbers being ported, listed
  - Any document still outstanding — LOA, BAA, billing statement — chased from here
  - Submitted to Twilio → cutover date returned by the losing carrier → complete
  - Standing warning: don't cancel your current service until it completes
- **Porting — fax** — same pattern, same documents, its own cutover date
- **Provisioning — new numbers** — collapses to one line once live: *"Your new Kasper fax number: 804-804-9846 — active."* `Twilio Configuration` behind it is never shown.

#### 2.4 Patient Forms

The one sub-stage wholly owned by the client, and the one most likely to be left till last.

- **Your forms** — the set to choose from · preview each as a patient would see it · per-form status (not reviewed → in review → approved) · approve individually or all at once

---

### Stage 3 · Live with Kasper

The office is actively using Kasper while some services finish. **Skippable.**

- **You're live** — banner with the go-live date
- **Finishing touches** — only what is still open, each with an owner and an estimate: messaging pending A2P · porting still in flight with its cutover date · patient forms in progress · training upcoming
- **Your numbers** — phone, fax and website URL, now a record rather than a task
- **Your schedule** — what's left of the rail, usually training, plus any cutover ahead and recordings of what's done
- **First-week resources** — quick-start videos, help centre, support line, adoption tips
- **Something isn't working** — a button that opens a ticket, not a mailto

---

### Stage 4 · Onboarding Complete

Final Readiness is our internal QA stage; client-side it is their sign-off, which is the more useful framing — they are the ones who can tell whether the phones actually ring. It sits at the head of this stage.

**Sign-off**
- **Confirm everything works** — a checklist the client ticks, each line with a *report a problem* link that reopens the matching card and pushes the record back to the owning workstream:
  - Phones ring and route correctly
  - Fax sends and receives
  - Text messaging works
  - Patient forms submit correctly
  - Hardware phones working
  - Team has been trained
- **Meet your Customer Success Manager** — name, contact, first check-in date
- **Anything still open** — carried forward so nothing closes silently

**Then, permanently**
- **Your setup summary** — go-live date · phone and fax numbers · website URL · configured modules, users and hardware
- **Training recordings** — all three sessions, kept for new hires
- **Support** — CSM, help centre, support line
- **How did we do?** — one short feedback prompt

The tracker becomes a read-only archive; navigation switches from tracker to support.

---

## 4. Property → client surface

| HubSpot property | Where | Owner | Client surface |
|---|---|---|---|
| `Welcome Email` | Email | Kasper | The welcome itself; not in the tracker |
| `Intake` | Public form | Client | Short Getting Started form → triggers the tenant build |
| `Website` | Form → 2.1 | Client | Messaging chain, step 1 — supplied at intake |
| `Customer Profile` | 2.1 | Kasper | Messaging chain, step 2 |
| `Compliance Registration` | 2.1 | Kasper | Messaging chain, step 3 |
| `Website Compliance` | 2.1 | Kasper | Messaging chain, step 4 |
| `A2P Campaign` | 2.1 | Third party | Messaging chain, step 5 |
| `Hardware Phones` | Stage 1 → 2.2 | Kasper | Confirm your hardware, then order & delivery |
| `Required Documents` / `…Status` | Stage 1 → 2.3 | Client | The three documents; chased from 2.3 |
| `Phone`, `Phone Port Date` | Stage 1 → 2.3 | Third party | Porting — phone, and the cutover on the schedule rail |
| `Fax`, `Fax Port Date` | Stage 1 → 2.3 | Third party | Porting — fax, and the cutover on the schedule rail |
| `Office Number`, `Office Fax Number`, `Extra Phone Numbers` | 2.3 · stage 4 | Kasper | Provisioning, then the final summary |
| `Twilio Configuration` | — | Kasper | *(never shown)* |
| `Installation`, `Installation Date` | Schedule rail | Client | Installation meeting |
| `Set up Call`, `Set up Date` | Schedule rail | Client | Setup call |
| `Current State`, `Compliance Progress`, `Next Action`, `Active Workstream` | all | — | *(never shown — they drive the chips and the buttons)* |

---

## 5. Worked example

Admin record: stage `Core Setup`, `Current State = Pending Office`, `Compliance Progress = No Website Domain`, `Next Action = website url & cust profile`, `Website Compliance = Pending Office`, `Required Documents = LOA Pending, Billing Statement Pending`, `Hardware Phones = Configured`, `Fax = New Provided`.

The client is logged in, on stage 2:

> **Products & Services** — Stage 2 of 4 · 42%
>
> **3 things need you:**
> 1. Add your website URL → *2.1 Messaging*
> 2. Sign your three documents → *2.3 Porting / Provisioning*
> 3. Upload a recent phone bill → *2.3 Porting / Provisioning*
>
> **In progress by Kasper:** Customer Profile — starts as soon as your website URL is in.
> **Up next:** Website Compliance — ours to do, once we have the URL.
> **Done:** Hardware phones configured · your new fax number is active.
> **Your schedule:** installation not booked yet.

One screen, three tasks, no jargon, and the causal link made explicit — which is exactly what the admin `Next Action` field already encodes, today, for staff only.
