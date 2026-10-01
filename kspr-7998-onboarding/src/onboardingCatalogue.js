/**
 * KSPR-7998 — Onboarding Tracker step catalogue.
 *
 * Transcribed from the journey mapping table on the Jira ticket. The catalogue
 * is editable per the spec (title, owner, required, help text), so treat these
 * as seed values rather than constants baked into behaviour.
 */

/** Who performs the sub-step. */
export const OWNER = {
  OFFICE: 'office',
  KASPER: 'kasper',
};

/** Who is allowed to move the sub-step to Verified. */
export const VERIFIED_BY = {
  SELF: 'self',
  KASPER: 'kasper',
};

/** Admin pipeline columns, in journey order. Derived for display, never stored. */
export const PIPELINE_COLUMN = {
  DATA_COLLECTION: 'Data collection',
  VERIFICATION: 'Verification',
  SETUP: 'Setup',
  TRAINING: 'Training',
  LAUNCH: 'Launch',
  LIVE: 'Live',
};

export const PIPELINE_ORDER = [
  PIPELINE_COLUMN.DATA_COLLECTION,
  PIPELINE_COLUMN.VERIFICATION,
  PIPELINE_COLUMN.SETUP,
  PIPELINE_COLUMN.TRAINING,
  PIPELINE_COLUMN.LAUNCH,
  PIPELINE_COLUMN.LIVE,
];

/**
 * The six journey stages. Stage 6 carries no sub-steps: the manager stays two
 * weeks, then hands over to support.
 *
 * NOTE: stage titles below are provisional. The ticket names them only in the
 * "UPDATED JOURNEY STAGES / PROCESS" screenshot, which is an image attachment.
 * Confirm before shipping copy.
 */
export const STAGES = [
  { stage: 1, title: 'Get started' },
  { stage: 2, title: 'Your practice' },
  { stage: 3, title: 'Phones & web' },
  { stage: 4, title: 'Installation' },
  { stage: 5, title: 'Training & go-live' },
  { stage: 6, title: 'Live' },
];

/**
 * The 26 sub-steps. `id` matches the ticket's numbering so admin screens, the
 * office panel and the Jira table can be cross-referenced by eye.
 */
export const SUB_STEPS = [
  { id: '1.1', stage: 1, title: 'Create your office', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.SELF, pipelineColumn: PIPELINE_COLUMN.DATA_COLLECTION },
  { id: '1.2', stage: 1, title: 'Confirm your email address', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.DATA_COLLECTION },
  { id: '1.3', stage: 1, title: 'Office details (address, hours, primary contact)', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.SELF, pipelineColumn: PIPELINE_COLUMN.DATA_COLLECTION },
  { id: '1.4', stage: 1, title: 'First sign-in', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.DATA_COLLECTION },

  { id: '2.1', stage: 2, title: 'Add your team', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.SELF, pipelineColumn: PIPELINE_COLUMN.DATA_COLLECTION },
  { id: '2.2', stage: 2, title: 'Open Dental version', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.VERIFICATION },
  { id: '2.3', stage: 2, title: 'Server information', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.VERIFICATION },
  { id: '2.4', stage: 2, title: 'Database credentials', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.VERIFICATION },
  { id: '2.5', stage: 2, title: 'Remote access', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.VERIFICATION },
  { id: '2.6', stage: 2, title: 'Security verification (owner checklist)', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.SELF, pipelineColumn: PIPELINE_COLUMN.VERIFICATION },

  { id: '3.1', stage: 3, title: 'Phone numbers — new from Kasper or port existing', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.SETUP, leadTime: '7–10 business days' },
  { id: '3.2', stage: 3, title: 'Register for patient messaging (A2P)', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.VERIFICATION, leadTime: '3–5 business days' },
  { id: '3.3', stage: 3, title: 'Website updates (privacy, opt-in wording, Book Now, support number, hours)', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.SELF, pipelineColumn: PIPELINE_COLUMN.VERIFICATION },
  { id: '3.4', stage: 3, title: 'Phone greeting & IVR (hours, greeting, after-hours routing)', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.SETUP },
  { id: '3.5', stage: 3, title: 'Published URL review', owner: OWNER.KASPER, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.VERIFICATION },
  { id: '3.6', stage: 3, title: 'Patient campaigns', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.SELF, pipelineColumn: PIPELINE_COLUMN.SETUP, optional: true },

  { id: '4.1', stage: 4, title: 'Schedule installation meeting', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.SETUP },
  { id: '4.2', stage: 4, title: 'Prepare server for installation', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.SELF, pipelineColumn: PIPELINE_COLUMN.SETUP },
  { id: '4.3', stage: 4, title: 'Installation', owner: OWNER.KASPER, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.SETUP },
  { id: '4.4', stage: 4, title: 'Office data sync', owner: OWNER.KASPER, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.SETUP },
  { id: '4.5', stage: 4, title: 'Confirm first sync', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.SELF, pipelineColumn: PIPELINE_COLUMN.SETUP },

  { id: '5.1', stage: 5, title: 'Train your front desk', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.TRAINING },
  { id: '5.2', stage: 5, title: 'Live training session', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.TRAINING },
  { id: '5.3', stage: 5, title: 'Go-live date', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.SELF, pipelineColumn: PIPELINE_COLUMN.TRAINING },
  { id: '5.4', stage: 5, title: 'Owner signs the go-live checklist', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.KASPER, pipelineColumn: PIPELINE_COLUMN.LAUNCH },
  { id: '5.5', stage: 5, title: 'Support handover contact', owner: OWNER.OFFICE, verifiedBy: VERIFIED_BY.SELF, pipelineColumn: PIPELINE_COLUMN.LAUNCH },
];

/** Sub-steps belonging to a stage, in ticket order. */
export function subStepsForStage(stage, catalogue = SUB_STEPS) {
  return catalogue.filter((step) => step.stage === stage);
}
