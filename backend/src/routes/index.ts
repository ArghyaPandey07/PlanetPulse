// PlanetPulse — API route definitions

import { Router } from 'express';
import { postActivity, listActivities } from '../controllers/activityController.js';
import { dashboard, weekly } from '../controllers/dashboardController.js';
import { updateTarget } from '../controllers/settingsController.js';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'PlanetPulse API' });
});

// Activities
router.post('/activities', postActivity);
router.get('/activities', listActivities);

// Dashboard
router.get('/dashboard', dashboard);

// Weekly
router.get('/weekly', weekly);

// Settings
router.put('/settings/target', updateTarget);

export default router;
