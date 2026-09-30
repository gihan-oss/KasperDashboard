import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { SUB_STEPS, subStepsForStage } from '../src/onboardingCatalogue.js';
import {
  ACTOR,
  STATUS,
  calculateProgress,
  canSetStatus,
  currentStage,
  nextActionsForOffice,
  pipelineColumn,
  stageSummaries,
  validateStatusChange,
} from '../src/onboardingProgress.js';

/** Build a steps map setting every listed id to a status. */
const withStatus = (status, ...ids) =>
  Object.fromEntries(ids.map((id) => [id, { status }]));

const allVerified = () =>
  Object.fromEntries(SUB_STEPS.map((s) => [s.id, { status: STATUS.VERIFIED }]));

test('catalogue holds the 26 sub-steps from the ticket', () => {
  assert.equal(SUB_STEPS.length, 26);
  assert.equal(subStepsForStage(1).length, 4);
  assert.equal(subStepsForStage(2).length, 6);
  assert.equal(subStepsForStage(3).length, 6);
  assert.equal(subStepsForStage(4).length, 5);
  assert.equal(subStepsForStage(5).length, 5);
  assert.equal(subStepsForStage(6).length, 0, 'stage 6 Live carries no sub-steps');
});

test('sub-step ids are unique', () => {
  const ids = SUB_STEPS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('office may only move an item to Submitted', () => {
  assert.equal(canSetStatus(ACTOR.OFFICE, STATUS.SUBMITTED), true);
  assert.equal(canSetStatus(ACTOR.OFFICE, STATUS.VERIFIED), false);
  assert.equal(canSetStatus(ACTOR.OFFICE, STATUS.NOT_APPLICABLE), false);
  assert.equal(canSetStatus(ACTOR.OFFICE, STATUS.BLOCKED), false);
});

test('Kasper may set every status in the closed set', () => {
  for (const status of Object.values(STATUS)) {
    assert.equal(canSetStatus(ACTOR.KASPER, status), true, status);
  }
});

test('Needs correction and Blocked require a note', () => {
  assert.match(
    validateStatusChange({ actor: ACTOR.KASPER, status: STATUS.NEEDS_CORRECTION }),
    /requires a note/,
  );
  assert.equal(
    validateStatusChange({ actor: ACTOR.KASPER, status: STATUS.NEEDS_CORRECTION, note: 'Wrong version' }),
    null,
  );
  assert.match(
    validateStatusChange({ actor: ACTOR.KASPER, status: STATUS.BLOCKED, note: '  ' }),
    /requires a note/,
  );
});

test('unknown statuses are rejected', () => {
  assert.match(validateStatusChange({ actor: ACTOR.KASPER, status: 'Done' }), /Unknown status/);
});

test('progress is verified over countable', () => {
  const steps = withStatus(STATUS.VERIFIED, '1.1', '1.2', '1.3');
  const { percent, verified, countable } = calculateProgress(steps);

  assert.equal(verified, 3);
  assert.equal(countable, 26);
  assert.equal(percent, Math.round((3 / 26) * 100));
});

test('Not applicable leaves the denominator', () => {
  const steps = {
    ...withStatus(STATUS.VERIFIED, '1.1', '1.2'),
    ...withStatus(STATUS.NOT_APPLICABLE, '3.6'),
  };
  const { verified, countable } = calculateProgress(steps);

  assert.equal(verified, 2);
  assert.equal(countable, 25, 'the NA sub-step is removed, not counted as progress');
});

test('an all-NA catalogue reports 0% rather than dividing by zero', () => {
  const steps = Object.fromEntries(
    SUB_STEPS.map((s) => [s.id, { status: STATUS.NOT_APPLICABLE }]),
  );
  assert.deepEqual(calculateProgress(steps), { percent: 0, verified: 0, countable: 0 });
});

test('a fresh office is 0% and sits in stage 1', () => {
  assert.equal(calculateProgress({}).percent, 0);
  assert.equal(currentStage({}), 1);
});

test('current stage is the first stage holding a non-verified sub-step', () => {
  const steps = Object.fromEntries(
    subStepsForStage(1).map((s) => [s.id, { status: STATUS.VERIFIED }]),
  );
  assert.equal(currentStage(steps), 2);

  steps['2.3'] = { status: STATUS.SUBMITTED };
  assert.equal(currentStage(steps), 2, 'Submitted is not Verified');
});

test('a fully verified office is Live at 100%', () => {
  const steps = allVerified();
  assert.equal(calculateProgress(steps).percent, 100);
  assert.equal(currentStage(steps), 6);
  assert.equal(pipelineColumn(steps), 'Live');
});

test('pipeline column comes from the first unfinished sub-step', () => {
  assert.equal(pipelineColumn({}), 'Data collection');

  const throughStageOne = Object.fromEntries(
    subStepsForStage(1).map((s) => [s.id, { status: STATUS.VERIFIED }]),
  );
  throughStageOne['2.1'] = { status: STATUS.VERIFIED };
  assert.equal(pipelineColumn(throughStageOne), 'Verification', '2.2 is the first unfinished');
});

test('Not applicable does not hold the pipeline column back', () => {
  const steps = {
    ...Object.fromEntries(subStepsForStage(1).map((s) => [s.id, { status: STATUS.VERIFIED }])),
    '2.1': { status: STATUS.NOT_APPLICABLE },
  };
  assert.equal(pipelineColumn(steps), 'Verification');
});

test('stage summaries mark done, current and locked', () => {
  const steps = Object.fromEntries(
    subStepsForStage(1).map((s) => [s.id, { status: STATUS.VERIFIED }]),
  );
  const summaries = stageSummaries(steps);

  assert.equal(summaries.find((s) => s.stage === 1).state, 'done');
  assert.equal(summaries.find((s) => s.stage === 2).state, 'current');
  assert.equal(summaries.find((s) => s.stage === 3).state, 'locked');
  assert.equal(summaries.find((s) => s.stage === 1).verified, 4);
});

test('next actions put Needs correction first and carry its note', () => {
  const steps = {
    '1.1': { status: STATUS.REQUESTED },
    '2.3': { status: STATUS.NEEDS_CORRECTION, note: 'Server name does not resolve' },
    '4.3': { status: STATUS.NEEDED },
  };
  const actions = nextActionsForOffice(steps);

  assert.equal(actions[0].step.id, '2.3');
  assert.equal(actions[0].note, 'Server name does not resolve');
  assert.ok(
    !actions.some(({ step }) => step.id === '4.3'),
    '4.3 Installation is owned by Kasper, not the office',
  );
});
