/**
 * KSPR-7998 — status rules, progress and derived position.
 *
 * The ticket states one progress rule that must hold everywhere: the admin
 * dashboard row, the office workspace, the office pill and every stage view all
 * show the same number. Keep this module the single source of that arithmetic.
 */

import { PIPELINE_COLUMN, PIPELINE_ORDER, STAGES, SUB_STEPS } from './onboardingCatalogue.js';

/** The closed set of statuses. No others are valid. */
export const STATUS = {
  NEEDED: 'Needed',
  REQUESTED: 'Requested',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under review',
  VERIFIED: 'Verified',
  NEEDS_CORRECTION: 'Needs correction',
  BLOCKED: 'Blocked',
  NOT_APPLICABLE: 'Not applicable',
};

export const ALL_STATUSES = Object.values(STATUS);

/** Statuses only a Kasper admin may set. */
export const KASPER_ONLY_STATUSES = [
  STATUS.VERIFIED,
  STATUS.NEEDS_CORRECTION,
  STATUS.BLOCKED,
  STATUS.NOT_APPLICABLE,
];

/** Statuses that require an accompanying note, which the office can see. */
export const NOTE_REQUIRED_STATUSES = [STATUS.NEEDS_CORRECTION, STATUS.BLOCKED];

/** Actor roles that can drive a status change. */
export const ACTOR = {
  OFFICE: 'office',
  KASPER: 'kasper',
};

/**
 * Whether `actor` may move a sub-step to `status`.
 *
 * An office user can only move an item to Submitted — everything else in the
 * closed set is either a Kasper-only outcome or an admin-driven request state.
 */
export function canSetStatus(actor, status) {
  if (!ALL_STATUSES.includes(status)) return false;
  if (actor === ACTOR.KASPER) return true;
  if (actor === ACTOR.OFFICE) return status === STATUS.SUBMITTED;
  return false;
}

/**
 * Validate a proposed status change, returning null when allowed or a reason
 * string when not. Callers should surface the reason rather than silently drop
 * the change.
 */
export function validateStatusChange({ actor, status, note }) {
  if (!ALL_STATUSES.includes(status)) {
    return `Unknown status: ${status}`;
  }
  if (!canSetStatus(actor, status)) {
    return `${actor} may not set status ${status}`;
  }
  if (NOTE_REQUIRED_STATUSES.includes(status) && !note?.trim()) {
    return `${status} requires a note`;
  }
  return null;
}

/**
 * Not applicable leaves the denominator, so it is neither progress nor
 * outstanding work — it is removed from the calculation entirely.
 */
function isCountable(status) {
  return status !== STATUS.NOT_APPLICABLE;
}

/**
 * A sub-step is settled when no further action will be taken on it: verified,
 * or ruled not applicable.
 *
 * NOTE: the ticket says the pipeline column comes from "the first unfinished
 * sub-step" without defining finished. Treating Not applicable as finished
 * follows from it leaving the denominator; confirm with the ticket author.
 */
function isSettled(status) {
  return status === STATUS.VERIFIED || status === STATUS.NOT_APPLICABLE;
}

function statusOf(steps, id) {
  return steps?.[id]?.status ?? STATUS.NEEDED;
}

/**
 * progress % = Verified sub-steps / countable sub-steps.
 *
 * Stage position is not weighted: every countable sub-step contributes equally.
 * Returns whole-number percent plus the raw counts, so callers can render
 * "7 of 24" alongside the bar without recomputing.
 */
export function calculateProgress(steps, catalogue = SUB_STEPS) {
  const countable = catalogue.filter((step) => isCountable(statusOf(steps, step.id)));
  const verified = countable.filter((step) => statusOf(steps, step.id) === STATUS.VERIFIED);

  const denominator = countable.length;
  const percent = denominator === 0 ? 0 : Math.round((verified.length / denominator) * 100);

  return { percent, verified: verified.length, countable: denominator };
}

/**
 * The office's current stage is the first stage holding a non-verified
 * sub-step. Once every sub-step is verified the office is Live (stage 6, which
 * carries no sub-steps of its own).
 */
export function currentStage(steps, catalogue = SUB_STEPS) {
  const ordered = [...STAGES].sort((a, b) => a.stage - b.stage);

  for (const { stage } of ordered) {
    const stageSteps = catalogue.filter((step) => step.stage === stage);
    if (stageSteps.length === 0) continue;
    if (stageSteps.some((step) => statusOf(steps, step.id) !== STATUS.VERIFIED)) {
      return stage;
    }
  }

  return ordered[ordered.length - 1].stage;
}

/**
 * Admin pipeline column, derived from the first unfinished sub-step. Never
 * stored — recompute it wherever it is shown.
 */
export function pipelineColumn(steps, catalogue = SUB_STEPS) {
  const firstUnfinished = catalogue.find((step) => !isSettled(statusOf(steps, step.id)));
  return firstUnfinished ? firstUnfinished.pipelineColumn : PIPELINE_COLUMN.LIVE;
}

/** Pipeline columns in journey order, for column layout on the admin board. */
export function pipelineColumnIndex(column) {
  return PIPELINE_ORDER.indexOf(column);
}

/**
 * Per-stage rollup for the office panel: each stage renders as done, current or
 * locked, with its own verified/countable counts.
 */
export function stageSummaries(steps, catalogue = SUB_STEPS) {
  const current = currentStage(steps, catalogue);

  return STAGES.map(({ stage, title }) => {
    const stageSteps = catalogue.filter((step) => step.stage === stage);
    const countable = stageSteps.filter((step) => isCountable(statusOf(steps, step.id)));
    const verified = countable.filter((step) => statusOf(steps, step.id) === STATUS.VERIFIED);

    let state = 'locked';
    if (stage < current) state = 'done';
    else if (stage === current) state = 'current';

    return {
      stage,
      title,
      state,
      verified: verified.length,
      countable: countable.length,
    };
  });
}

/**
 * The office's next actions: sub-steps they own that are waiting on them.
 * Needs correction sorts first — the ticket calls for the correction, with its
 * note, to be the first thing the office sees.
 */
export function nextActionsForOffice(steps, catalogue = SUB_STEPS) {
  const waiting = [STATUS.NEEDS_CORRECTION, STATUS.REQUESTED, STATUS.NEEDED];

  return catalogue
    .filter((step) => step.owner === 'office')
    .map((step) => ({ step, status: statusOf(steps, step.id), note: steps?.[step.id]?.note }))
    .filter(({ status }) => waiting.includes(status))
    .sort((a, b) => waiting.indexOf(a.status) - waiting.indexOf(b.status));
}
