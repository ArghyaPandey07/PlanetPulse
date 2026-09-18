// PlanetPulse — Activity controller (thin HTTP handler)

import type { Request, Response } from 'express';
import type { ActivityType } from '../types/index.js';
import { logActivity, getActivities } from '../services/activityService.js';
import { VALID_ACTIVITY_TYPES } from '../constants/index.js';

/**
 * POST /api/activities — Log a new activity.
 */
export function postActivity(req: Request, res: Response): void {
  const { type, quantity, date } = req.body;

  const result = logActivity({ type, quantity, date });

  if (result.errors) {
    res.status(400).json({ success: false, errors: result.errors });
    return;
  }

  res.status(201).json({ success: true, data: result.activity });
}

/**
 * GET /api/activities — List activities with optional filters.
 * Query params: ?type=car&startDate=2026-09-14&endDate=2026-09-20
 */
export function listActivities(req: Request, res: Response): void {
  const filters: { type?: ActivityType; startDate?: string; endDate?: string } = {};

  if (req.query.type) {
    const typeStr = String(req.query.type);
    if (VALID_ACTIVITY_TYPES.includes(typeStr)) {
      filters.type = typeStr as ActivityType;
    } else {
      res.status(400).json({
        success: false,
        errors: [{ field: 'type', message: `Invalid activity type "${typeStr}". Valid types: ${VALID_ACTIVITY_TYPES.join(', ')}.` }],
      });
      return;
    }
  }

  if (req.query.startDate) {
    filters.startDate = String(req.query.startDate);
  }
  if (req.query.endDate) {
    filters.endDate = String(req.query.endDate);
  }

  const activities = getActivities(filters);
  res.status(200).json({ success: true, data: activities });
}
