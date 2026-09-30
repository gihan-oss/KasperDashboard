# Onboarding Tracker — Client-Facing View Mapping

**Purpose:** HubSpot holds the *admin* truth for onboarding (Onboardings custom object, `Standard Onboarding` pipeline). This document defines what the **client** sees at each pipeline stage, on which channel, and which HubSpot property drives it.

**Core principle:** the client tracker is not a mirror of HubSpot. HubSpot answers *"who is blocking this record?"*. The client only ever needs three answers per item:

1. Is it **done**?
2. Is it **waiting on me** — and exactly what do I hand over?
3. Is it **waiting on Kasper or a carrier** — and roughly how long?

Everything in HubSpot that does not serve one of those three answers stays admin-only.

---

## 1. Where the client is

The tracker is not the client's surface for the whole pipeline. The client is onboarded **onto the website after the intake form**, so the first stretch runs over email and a public form, and the portal only exists once the tenant does.

| Admin stage | Client channel |
|---|---|
| Deal Won | Email |
| Intake Form (short) | Public form — no login |
| Kasper Admin Setup | Email (credentials) |
| Core Setup → Closed | **The tracker** |

This is the EPIC 1 / EPIC 2 split from the process design:

- **EPIC 1 — up to tenant creation.** The short Getting Started form: office display name, first name, last name, email, mobile, desired URL. Just enough to build the tenant. Runs off-portal.
- **EPIC 2 — the onboarding tracker.** Everything after, including the **remaining intake form** (basic office info, point of contact, extra point of contact, phones/fax/hardware, business registration & compliance), which is completed *inside* the tracker as its first stage.

### 1.1 The client's own stage rail

The eight admin stages collapse to four stages in the tracker, plus a persistent meetings rail. The client should never see eight.

| Tracker stage | Covers admin stages | What it means to the client |
|---|---|---|
| **Getting Started** | Core Setup (entry) | Finish the remaining onboarding information Kasper needs to proceed. |
| **Compliance & Communication** | Core Setup | Compliance chain, phone, fax, hardware, forms. |
| **Live With Kasper** | Ready to Schedule → Post Installation | The office is actively using Kasper; some services may still be finishing. Skippable. |
| **Onboarding Complete** | Final Readiness → Closed | Everything done. |

**Meetings rail** — Installation → Setup Call → Training. Visible from *Compliance & Communication* onward as a persistent strip, not a stage of its own, because scheduling overlaps the compliance work rather than following it.

---

## 2. The translation layer

### 2.1 Status vocabulary

Admin has ~6 states. The client gets 4, and only 4, everywhere in the product.

| HubSpot `Current State` / item status | Client chip | Client colour | Client meaning |
|---|---|---|---|
| `Pending Office` | **Action needed** | Amber | "We need something from you." Always paired with a concrete CTA. |
| `Pending Kasper` | **In progress** | Blue | "Kasper is working on it." Show an ETA. |
| `Pending Third Party` | **Under review** | Blue | "With your carrier / the registry." Show an ETA + why it's out of our hands. |
| `Blocked` | **Needs attention** | Amber | Never surface the word "blocked". Show "We've hit a snag — your specialist is reaching out." |
| `Not Started` | **Up next** | Grey | Locked, with the unlock condition stated. |
| `In Progress` / `Complete` | **In progress** / **Complete** | Blue / Green | — |

### 2.2 Never shown to the client

| Admin field | Why it stays internal |
|---|---|
| `Current State` raw values | "Pending Office" reads as blame; the client sees the action, not the label. |
| `Next Action` (e.g. `website url & cust profile`) | Internal shorthand for the specialist. |
| `Active Workstream` chips | Internal routing. The client sees the cards themselves. |
| `Time in current stage` | Surfaces our SLA misses without context. |
| `Twilio Configuration` (`Non Config`) | Pure provisioning plumbing. |
| `A2P Campaign = Rejected` | Show "Registration returned for more detail — resubmitted" plus the *one* thing to fix. Never the word "rejected". |
| `Compliance Progress` flags | Admin triage buckets; each maps to a client CTA instead (see §5.6). |
| Record owner, pipeline names, HubSpot IDs | — |

### 2.3 Rules that apply everywhere

- **One consolidated to-do at the top.** Every item currently `Pending Office`, across every card, rolls into a single "Needs you" list at the top of the tracker. The client must never hunt across five cards to find their two tasks.
- **Every card answers four questions:** what is this, who is it waiting on, what do I do, when will it be done.
- **Progress never goes backwards.** An A2P resubmission does not reset the bar.
- **Locked items state their unlock condition** — "Starts once your Customer Profile is approved" — so silence never looks like neglect.
- **Notify on transition only:** email/SMS when an item flips to *Action needed*, and when a milestone completes. Not on internal state churn.
- **Email carries what the portal can't reach.** Until first login, and for anything urgent after it, email is the channel. The tracker is where state lives; email is how the client is pulled back to it.

### 2.4 Who actually does the work

A lot of onboarding is done entirely on the Kasper side — Twilio configuration is the clearest case: we do all of it, the client does nothing and has nothing to hand over. Every item therefore has one of three owners, and the owner decides how it renders.

| Owner | Client action | How it renders |
|---|---|---|
| **Client** | Yes | Card with a concrete CTA, and it rolls into the top "needs you" list. |
| **Kasper** | None | Visible **without** a CTA *only if* it explains why the client is waiting. Pure plumbing is hidden. |
| **Third party** | None | Always visible, with an ETA and a named party — otherwise the wait reads as Kasper being slow. |

**The rule for Kasper-owned work:** show it when the client is waiting on it, hide it when they aren't. Twilio provisioning and the tenant build are invisible plumbing — surfacing them only invites questions the client can't act on. Customer Profile and Compliance Registration are the opposite: the client can't do anything about either, but they are the reason step 5 hasn't started, so they stay visible with no button.

**The failure mode to avoid:** hiding *all* Kasper-side work makes the tracker look stalled during the exact stretches when we're busiest. If a client-facing stage has nothing client-owned in flight, one "Kasper is working on X" line must still be showing. A tracker with nothing on it reads as neglect.

| Item | Owner | In the tracker? |
|---|---|---|
| Remaining intake sections | Client | Yes, with CTA |
| Website URL | Client | Yes, with CTA |
| Website Compliance (privacy policy, consent language) | Client | Yes, with CTA — or hand to Kasper |
| LOA signature | Client | Yes, with CTA |
| Billing statement upload | Client | Yes, with CTA |
| Booking the three meetings | Client | Yes, with CTA |
| Forms review & approval | Client | Yes, with CTA |
| Final readiness confirmation | Client | Yes, with CTA |
| Tenant build | Kasper | No — covered by the holding email |
| Customer Profile submission | Kasper | Yes, no CTA |
| Compliance Registration (EKM, A2P brand, voice integrity) | Kasper | Yes, no CTA |
| `Twilio Configuration` | Kasper | **No** — pure plumbing |
| New number provisioning (phone, fax) | Kasper | Only as the resulting number, once it exists |
| Hardware configuration | Kasper | Yes, as order status |
| A2P campaign review | Third party | Yes, with ETA |
| Phone port | Third party | Yes, with port date |
| Fax port | Third party | Yes, with port date |
| Hardware shipping | Third party | Yes, with tracking |

---

## 3. Card inventory by stage

The list of blocks and what sits under each. The first three stages have no cards — the client is not on the website yet.

### Stage 1 · Deal Won — *email, no cards*
- **Welcome email** — next steps and timeline · specialist contact · "what we'll need from you" (website URL, EIN, signed LOA, recent carrier bill) · one button to the Getting Started form

### Stage 2 · Intake Form — *public form, no login*
- **Getting Started form** — office display name · first and last name · email · mobile · desired URL (with an "I don't have a website yet" branch) · confirmation screen stating when their login arrives

### Stage 3 · Kasper Admin Setup — *email → first login*
- **Holding email** — "nothing needed from you right now", 1–2 business days
- **Credentials email** — their login, one button into the tracker
- **First login screen** — stage rail with Getting Started active, short orientation, remaining intake form as the immediate task

### Stage 4 · Core Setup (entry) → tracker stage **Getting Started**
- **Remaining intake form** — basic office info · point of contact · extra point of contact · phones, fax & hardware · business registration & compliance (legal name, EIN, address, opening date)
- **Your progress** — the four-stage rail, "3 of 5 sections complete"
- **Your specialist** — persistent from here on
- **What happens next** — preview of the three stages ahead
- **Compliance & Communication** — locked, "unlocks when your information is complete"

### Stage 5 · Core Setup → tracker stage **Compliance & Communication**
- **Needs you** — the consolidated to-do, pulling every `Pending Office` item from every card below
- **SMS & Messaging** — the sequential five-step chain: website URL → customer profile → compliance registration → website compliance → A2P campaign
- **Phone Setup** — porting or new · sign LOA · upload carrier bill · numbers listed · port date · don't-cancel warning
- **Fax Setup** — same pattern; collapses to one line when a new number is provided
- **Hardware Phones** — models, quantity, order status, tracking, arrival before installation
- **Forms** — list, status, preview, approve
- **Your meetings** — the rail: installation · setup call · training

### Stage 6 · Ready to Schedule → Post Installation → tracker stage **Live With Kasper**
- **You're live** — banner with go-live date
- **Finishing touches** — only what's still open: SMS pending A2P · porting in flight · forms · training
- **Your numbers** — phone, fax, URL, now shown as a record
- **Your meetings** — what's left of the rail, plus recordings
- **First-week resources** — quick-start videos, help centre, support line
- **Something isn't working** — opens a ticket

### Stage 7 · Final Readiness — tracker stage **Final Review**
- **Confirm everything works** — six-line checklist with a *report a problem* link per line
- **Meet your Customer Success Manager** — name, contact, first check-in date
- **Anything still open** — carried forward so nothing closes silently

### Stage 8 · Closed — tracker stage **Onboarding Complete**
- **Your setup summary** — go-live date · numbers · URL · modules, users, hardware
- **Training recordings**
- **Support** — CSM, help centre, support line
- **How did we do?** — one feedback prompt

---

## 4. Before the portal

### Stage 1 — Deal Won · channel: **email**

| | |
|---|---|
| **HubSpot** | Deal `Closed Won` → Onboarding record created. `Welcome Email = Sent`, `Intake = Not Started`. |

**The welcome email contains**
- What the next steps are and a realistic timeline.
- Their onboarding specialist: name, email, direct line, booking link.
- A **"what we'll need from you"** preview — website URL, EIN, a signed LOA, a recent carrier bill. This belongs here, not in the tracker, because the client will not see the tracker for days and these are the items with lead time.
- One button: **Start your Getting Started form.**

**Exits when:** the form is opened.

---

### Stage 2 — Intake Form (short) · channel: **public form, no login**

| | |
|---|---|
| **HubSpot** | Office display name, first name, last name, email, mobile, desired URL. Sets `Intake = Complete`. |
| **Scope** | Only what tenant creation needs. Six fields, one screen. |

**Client sees**
- A short single-screen form. Resist adding to it — every field here delays tenant creation, and everything else can be collected in the tracker where the client has context and can save progress.
- On submit: a confirmation screen and email stating what happens next and when their login arrives.

**Design note — `Desired URL` is load-bearing.** It is the first step of the compliance chain later. Ask for it here, with an explicit "I don't have a website yet" branch that flags the Kasper-hosted compliance page path. That single field is the source of the `No Website Domain` flag sitting on records today.

**Exits when:** `Intake = Complete` → tenant build starts.

---

### Stage 3 — Kasper Admin Setup · channel: **email → first login**

| | |
|---|---|
| **HubSpot** | Kasper team builds the tenant. No client-editable properties. |

**Client sees**
- A holding email: "We're building your account — nothing needed from you right now," with an honest ETA ("usually 1–2 business days"). This email exists purely to prevent the "has anyone forgotten about us?" call during the one stretch where the client has no surface to look at.
- Then the **credentials email**: their login, and one button into the tracker.

**First login — design this moment deliberately.** The client arrives at a tracker that must not read as empty or as starting from zero:
- The stage rail shows **Getting Started** active, with the welcome and short form already behind them.
- A short orientation: what this page is, that it is the single place to track everything, and that they'll be emailed whenever something needs them.
- The **remaining intake form** as the immediate task.

**Exits when:** the client logs in.

---

## 5. Inside the tracker

### Tracker stage A — **Getting Started** (admin: Core Setup, entry)

The remaining intake form, completed in-portal. Per the process design this can be one page split into sections rather than a module.

**Sections**
- Basic office info
- Point of contact
- Extra point of contact
- Phones, fax & hardware
- Business registration & compliance (legal name, EIN, address, opening date)

**Client sees**
- A live section checklist and a headline that reads *"Waiting on you — 3 of 5 sections complete."*
- **Save and resume.** Nobody completes this in one sitting, and unlike the short form, this one is long enough that losing progress loses the client.
- "Why we need this" microcopy on every sensitive ask — EIN, LOA, billing statement. This is where drop-off happens.
- Make **opening date** required here; it is the source of the `Opening Date Missing` flag.

**Exits when:** all sections complete → Compliance & Communication unlocks.

---

### Tracker stage B — **Compliance & Communication** (admin: Core Setup)

The heavy stage — where most records sit. Stage headline is the consolidated to-do: **"3 things need your attention."**

#### 5.1 Card — SMS & Messaging (the compliance chain)

Render this as a visibly **sequential 5-step chain**, not five independent tiles. It is sequential, and showing that is what stops "why has nothing moved in a week?".

| Step | HubSpot property | Client state & action |
|---|---|---|
| 1. Website URL | `Website` | Carried in from the short form. Empty → **Action needed**: "Add your website URL", with the Kasper-hosted page branch. |
| 2. Customer Profile | `Customer Profile` | Built from the business registration section. → "Submitted for review." |
| 3. Compliance Registration | `Compliance Registration` | **In progress**: "Kasper is registering your business" (EKM, A2P brand, voice integrity). |
| 4. Website Compliance | `Website Compliance` | **Action needed**: "Your site needs a privacy policy and SMS consent language." Copy-paste snippets + *Mark as added* / *Have Kasper host it*. |
| 5. A2P Campaign | `A2P Campaign` | **Under review**: "With the carrier — typically 2–5 business days." If returned, show only the item to correct. |

Steps 2–5 render locked until their predecessor clears, each stating why.

#### 5.2 Card — Phone Setup

| Client element | HubSpot source |
|---|---|
| Two sub-tracks: *Porting an existing number* or *New number* | `Phone` |
| **Sign LOA** (e-sign link) and **Upload recent carrier bill** | `Required Documents` = `LOA Pending`, `Billing Statement Pending`; `Required Documents Status` |
| Numbers being ported, listed | `Office Number`, `Extra Phone Numbers` |
| Port date: *Requested* → *Confirmed for [date]* → *Complete* | `Phone Port Date` |
| Standing warning: **"Do not cancel your current phone service until porting completes."** | — |
| *(hidden)* | `Twilio Configuration` |

The two documents are the highest-value actionable items in the whole tracker — put them in the top-level to-do list, not buried in the card.

#### 5.3 Card — Fax Setup

Same pattern. When `Fax = New Provided`, collapse to a single done-state line: *"Your new Kasper fax number: 804-804-9846 — active."* Driven by `Fax`, `Fax Port Date`, `Office Fax Number`.

#### 5.4 Card — Hardware Phones

From `Hardware Phones`. Models and quantity, order status, tracking number, "arriving before your installation date" — tied to `Installation Date` so the two stay visibly linked.

#### 5.5 Card — Forms

Digital forms to select, review and approve, with per-form status and preview.

#### 5.6 Compliance Progress flags → client CTAs

| Admin flag | What the client actually sees |
|---|---|
| `No Website Domain` | Step 1 of the SMS chain is *Action needed*, with the no-website branch offered. |
| `Opening Date Missing` | "Confirm your opening date" in the to-do list. |
| `A2P Rejected` | "Registration returned for more detail — we've resubmitted" + the single field to correct. |
| `Open Office` / `Open Soon` | Not shown. Internal prioritisation only. |

#### 5.7 The meetings rail (admin: Ready to Schedule)

Appears from this stage onward as a persistent strip, because scheduling overlaps compliance rather than following it.

1. **Installation Meeting** — "We install Kasper on your main server." Prep: server access, admin credentials, IT contact available, ~2-hour window. Driven by `Installation` / `Installation Date`.
2. **Setup Call** — "We configure the office, verify settings, and make sure the system is ready to use." Driven by `Set up Call` / `Set up Date`.
3. **Training Meeting** — "We train your team." Who attends, how many seats.

Each cycles: *Not scheduled* → **Book a time** · *Scheduled* → date, time, join link, add-to-calendar, reschedule · *Complete* → checkmark + recap/recording.

**Exits when:** compliance chain approved, documents received, ports submitted, installation completed.

---

### Tracker stage C — **Live With Kasper** (admin: Post Installation)

Per the process design: the office is actively using Kasper while some products or services finish setup. **This stage can be skipped.**

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

### Tracker stage D — **Onboarding Complete** (admin: Final Readiness → Closed)

#### Final readiness — the client's sign-off

Before the record closes, the client confirms. A checklist they tick themselves, each line with a *Report a problem* link:

- Phones ring and route correctly
- Fax sends and receives
- Text messaging works
- Forms submit correctly
- Hardware phones working
- Team has been trained

Flagging a line reopens the matching card and pushes the record back to the owning workstream in HubSpot. Plus the handoff: *"Your account moves to your Customer Success Manager — meet [name]"* with contact details and first check-in date.

#### Closed

- A permanent **summary card**: go-live date, phone and fax numbers, website URL, configured modules/users/hardware, training recordings.
- Support routes: CSM, help centre, support line.
- A short feedback / NPS prompt.
- The tracker becomes a read-only archive; primary navigation switches from tracker to support.

---

## 6. Quick reference — property → client surface

| HubSpot property | Channel / stage | Owner | Client surface |
|---|---|---|---|
| `Welcome Email` | Email | Kasper | The welcome itself; not shown in the tracker |
| `Intake` | Public form | Client | Short Getting Started form → triggers tenant build |
| `Website` | Form → tracker B | Client | SMS chain step 1 |
| `Customer Profile` | Tracker B | Kasper | SMS chain step 2 |
| `Compliance Registration` | Tracker B | Kasper | SMS chain step 3 |
| `Website Compliance` | Tracker B | Client | SMS chain step 4 |
| `A2P Campaign` | Tracker B | Third party | SMS chain step 5 |
| `Hardware Phones` | Tracker B | Kasper | Hardware Phones card |
| `Required Documents` / `…Status` | Tracker B | Client | LOA + billing statement to-dos |
| `Phone`, `Phone Port Date` | Tracker B | Third party | Phone Setup card |
| `Fax`, `Fax Port Date` | Tracker B | Third party | Fax Setup card |
| `Office Number`, `Office Fax Number`, `Extra Phone Numbers` | Tracker B / D | Kasper | Your numbers (card + final summary) |
| `Twilio Configuration` | — | Kasper | *(never shown)* |
| `Installation`, `Installation Date` | Meetings rail | Client | Installation meeting card |
| `Set up Call`, `Set up Date` | Meetings rail | Client | Setup call card |
| `Current State`, `Compliance Progress`, `Next Action`, `Active Workstream` | all | — | *(never shown — drive chips and CTAs instead)* |

---

## 7. Worked example — The Tooth Workshop, today

Admin record: stage `Core Setup`, `Current State = Pending Office`, `Compliance Progress = No Website Domain`, `Next Action = website url & cust profile`, `Website Compliance = Pending Office`, `Required Documents = LOA Pending, Billing Statement Pending`, `Hardware Phones = Configured`, `Fax = New Provided`.

The client is logged into the tracker, on stage B:

> **Compliance & Communication** — step 2 of 4
>
> **3 things need you:**
> 1. Add your website URL → *SMS & Messaging*
> 2. Sign your Letter of Authorization → *Phone Setup*
> 3. Upload a recent phone bill → *Phone Setup*
>
> **In progress by Kasper:** Customer Profile — starts as soon as your website URL is in.
> **Done:** Hardware phones configured · Your new fax number 804-804-9846 is active.
> **Your meetings:** Installation — not booked yet.

One screen, three tasks, no jargon, and the causal link ("Customer Profile is waiting on your URL") made explicit — which is exactly the link the admin `Next Action` field currently encodes for staff only.
