// PlanetPulse — Target status and nudge tests

import { describe, it, expect } from 'vitest';
import { calculateTargetStatus } from '../../src/domain/target.js';

describe('calculateTargetStatus', () => {
  // ─── No target set ───

  it('returns null progress when no target is set', () => {
    const status = calculateTargetStatus(25, null);
    expect(status.progressPercent).toBeNull();
    expect(status.exceeded).toBe(false);
    expect(status.nudgeMessage).toBeNull();
  });

  // ─── Under target ───

  it('calculates progress under target', () => {
    const status = calculateTargetStatus(25, 50);
    expect(status.progressPercent).toBe(50);
    expect(status.exceeded).toBe(false);
    expect(status.nudgeMessage).toBeNull();
  });

  it('shows no nudge at 0 CO2', () => {
    const status = calculateTargetStatus(0, 50);
    expect(status.progressPercent).toBe(0);
    expect(status.exceeded).toBe(false);
    expect(status.nudgeMessage).toBeNull();
  });

  // ─── Approaching target (80%+) ───

  it('shows encouraging nudge at 80% progress', () => {
    const status = calculateTargetStatus(40, 50);
    expect(status.progressPercent).toBe(80);
    expect(status.exceeded).toBe(false);
    expect(status.nudgeMessage).toContain("You're at 80%");
  });

  it('shows encouraging nudge at 90% progress', () => {
    const status = calculateTargetStatus(45, 50);
    expect(status.progressPercent).toBe(90);
    expect(status.exceeded).toBe(false);
    expect(status.nudgeMessage).toBeDefined();
  });

  // ─── At exact target ───

  it('at exactly 100% is not exceeded', () => {
    const status = calculateTargetStatus(50, 50);
    expect(status.progressPercent).toBe(100);
    expect(status.exceeded).toBe(false);
    // At 100% the nudge triggers since >= 80%
    expect(status.nudgeMessage).toBeDefined();
  });

  // ─── Weekly target crossing (exceeded) ───

  it('marks exceeded when over target', () => {
    const status = calculateTargetStatus(55, 50);
    expect(status.exceeded).toBe(true);
    expect(status.progressPercent).toBe(110);
  });

  it('provides encouraging nudge message when exceeded', () => {
    const status = calculateTargetStatus(55, 50);
    expect(status.nudgeMessage).toBeDefined();
    expect(status.nudgeMessage).toContain('passed your 50 kg weekly target');
    expect(status.nudgeMessage).toContain('5 kg');
    // DP1: Should NOT contain shaming language
    expect(status.nudgeMessage).not.toMatch(/bad|shame|fail|punish/i);
  });

  it('nudge message is actionable', () => {
    const status = calculateTargetStatus(60, 50);
    expect(status.nudgeMessage).toBeDefined();
    // Should contain a practical tip
    expect(status.nudgeMessage!.length).toBeGreaterThan(30);
  });

  // ─── Large over-target ───

  it('handles significantly exceeded target', () => {
    const status = calculateTargetStatus(200, 50);
    expect(status.progressPercent).toBe(400);
    expect(status.exceeded).toBe(true);
    expect(status.nudgeMessage).toContain('150 kg');
  });
});
