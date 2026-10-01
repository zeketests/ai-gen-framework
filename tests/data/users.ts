/** Shared password for every SauceDemo seeded account. */
export const PASSWORD = 'secret_sauce';

/** SauceDemo seeded accounts. Each non-standard user exhibits a deliberate defect. */
export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

export type Username = (typeof USERS)[keyof typeof USERS];

/** Users that can log in successfully. */
export const LOGIN_ENABLED_USERS: Username[] = [
  USERS.standard,
  USERS.problem,
  USERS.performanceGlitch,
  USERS.error,
  USERS.visual,
];
