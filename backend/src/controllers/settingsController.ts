// PlanetPulse — Settings controller

import type { Request, Response } from 'express';
import { setTarget } from '../services/settingsService.js';

/**
 * PUT /api/settings/target — Set weekly CO2 target.
 */
export function updateTarget(req: Request, res: Response): void {
  const { weeklyTargetKg } = req.body;

  const result = setTarget(weeklyTargetKg);

  if (result.errors) {
    res.status(400).json({ success: false, errors: result.errors });
    return;
  }

  res.status(200).json({ success: true, data: result.settings });
}
