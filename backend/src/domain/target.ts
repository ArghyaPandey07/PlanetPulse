// PlanetPulse — Weekly target status and nudge logic (pure function)
// DP1: Encourage and inform, never shame or block.

import type { TargetStatus } from '../types/index.js';

/**
 * Calculate weekly target status and generate an encouraging nudge message
 * when the target is exceeded.
 *
 * @param currentCo2Kg - Total CO2 for the current week
 * @param targetKg - User-defined weekly target (null if not set)
 * @returns Target status with progress percentage and optional nudge
 */
export function calculateTargetStatus(
  currentCo2Kg: number,
  targetKg: number | null,
): TargetStatus {
  // No target set — no progress to report
  if (targetKg === null) {
    return {
      progressPercent: null,
      exceeded: false,
      nudgeMessage: null,
    };
  }

  const progressPercent = Math.round((currentCo2Kg / targetKg) * 1000) / 10;
  const exceeded = currentCo2Kg > targetKg;

  let nudgeMessage: string | null = null;

  if (exceeded) {
    const overBy = Math.round((currentCo2Kg - targetKg) * 100) / 100;
    nudgeMessage = buildNudgeMessage(targetKg, overBy);
  } else if (progressPercent >= 80) {
    nudgeMessage = `You're at ${progressPercent}% of your ${targetKg} kg weekly target. You've got this — small choices make a big difference!`;
  }

  return { progressPercent, exceeded, nudgeMessage };
}

/**
 * Build an encouraging, actionable nudge message.
 * Never shaming, blocking, or punishing — always supportive.
 */
function buildNudgeMessage(targetKg: number, overByKg: number): string {
  const tips = [
    'Try a bus ride instead of driving tomorrow.',
    'A veg meal is a simple way to cut your footprint.',
    'Consider walking or cycling for short trips.',
    'Every small change adds up over time!',
  ];
  // Pick a tip deterministically based on overByKg to avoid randomness in tests
  const tip = tips[Math.floor(overByKg) % tips.length];
  return `You've passed your ${targetKg} kg weekly target by ${overByKg} kg. ${tip}`;
}
