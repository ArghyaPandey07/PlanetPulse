// PlanetPulse — Integration API tests

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { activityStore, settingsStore } from '../../src/data/store.js';
import { getCurrentWeekRange, formatUTCDate } from '../../src/domain/weekly.js';

// Reset stores before each test to avoid cross-test pollution
beforeEach(() => {
  activityStore.clear();
  settingsStore.clear();
});

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/activities', () => {
  const today = formatUTCDate(new Date());

  it('logs a valid activity and returns 201', async () => {
    const res = await request(app)
      .post('/api/activities')
      .send({ type: 'car', quantity: 10, date: today });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      type: 'car',
      quantity: 10,
      unit: 'km',
      co2Kg: 2.00,
      date: today,
    });
    expect(res.body.data.id).toBeDefined();
  });

  it('calculates CO2 server-side, ignoring client co2Kg', async () => {
    const res = await request(app)
      .post('/api/activities')
      .send({ type: 'bus', quantity: 10, date: today });

    expect(res.status).toBe(201);
    expect(res.body.data.co2Kg).toBe(0.80);
  });

  it('returns 400 for missing type', async () => {
    const res = await request(app)
      .post('/api/activities')
      .send({ quantity: 10, date: today });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 for invalid quantity', async () => {
    const res = await request(app)
      .post('/api/activities')
      .send({ type: 'car', quantity: -5, date: today });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('quantity');
  });

  it('returns 400 for absurd 500,000 km car trip', async () => {
    const res = await request(app)
      .post('/api/activities')
      .send({ type: 'car', quantity: 500_000, date: today });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].message).toContain('exceeds the maximum');
  });

  it('returns 400 for unknown activity type', async () => {
    const res = await request(app)
      .post('/api/activities')
      .send({ type: 'bicycle', quantity: 10, date: today });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].message).toContain('Unknown activity type');
  });

  it('returns 400 for invalid date', async () => {
    const res = await request(app)
      .post('/api/activities')
      .send({ type: 'car', quantity: 10, date: 'not-a-date' });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('date');
  });
});

describe('GET /api/activities', () => {
  const today = formatUTCDate(new Date());

  it('returns empty array when no activities', async () => {
    const res = await request(app).get('/api/activities');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('returns logged activities', async () => {
    await request(app).post('/api/activities').send({ type: 'car', quantity: 10, date: today });
    await request(app).post('/api/activities').send({ type: 'bus', quantity: 5, date: today });

    const res = await request(app).get('/api/activities');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('filters by activity type', async () => {
    await request(app).post('/api/activities').send({ type: 'car', quantity: 10, date: today });
    await request(app).post('/api/activities').send({ type: 'bus', quantity: 5, date: today });

    const res = await request(app).get('/api/activities?type=car');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].type).toBe('car');
  });

  it('filters by date range', async () => {
    await request(app).post('/api/activities').send({ type: 'car', quantity: 10, date: '2026-09-15' });
    await request(app).post('/api/activities').send({ type: 'bus', quantity: 5, date: '2026-09-17' });

    const res = await request(app).get('/api/activities?startDate=2026-09-16&endDate=2026-09-18');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].type).toBe('bus');
  });

  it('returns 400 for invalid type filter', async () => {
    const res = await request(app).get('/api/activities?type=bicycle');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/dashboard', () => {
  it('returns dashboard with zero totals when empty', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBe(200);
    expect(res.body.data.totalCo2Kg).toBe(0);
    expect(res.body.data.weekRange).toBeDefined();
    expect(res.body.data.categoryBreakdown).toBeDefined();
  });

  it('returns correct totals for current week activities', async () => {
    const weekRange = getCurrentWeekRange();
    // Log activity in current week
    await request(app).post('/api/activities').send({ type: 'car', quantity: 10, date: weekRange.start });
    await request(app).post('/api/activities').send({ type: 'veg_meal', quantity: 1, date: weekRange.start });

    const res = await request(app).get('/api/dashboard');
    expect(res.body.data.totalCo2Kg).toBe(2.50);
    expect(res.body.data.categoryBreakdown.car).toBe(2.00);
    expect(res.body.data.categoryBreakdown.veg_meal).toBe(0.50);
  });

  it('excludes activities from other weeks', async () => {
    // Log activity in a distant past week
    await request(app).post('/api/activities').send({ type: 'car', quantity: 10, date: '2020-01-06' });

    const res = await request(app).get('/api/dashboard');
    expect(res.body.data.totalCo2Kg).toBe(0);
  });
});

describe('GET /api/weekly', () => {
  it('returns weekly data with default target', async () => {
    const res = await request(app).get('/api/weekly');
    expect(res.status).toBe(200);
    expect(res.body.data.targetKg).toBe(50); // default
    expect(res.body.data.currentCo2Kg).toBe(0);
    expect(res.body.data.exceeded).toBe(false);
    expect(res.body.data.weekRange).toBeDefined();
  });

  it('shows exceeded state when over target', async () => {
    // Set a low target
    await request(app).put('/api/settings/target').send({ weeklyTargetKg: 5 });

    // Log enough to exceed
    const weekRange = getCurrentWeekRange();
    await request(app).post('/api/activities').send({ type: 'car', quantity: 50, date: weekRange.start });

    const res = await request(app).get('/api/weekly');
    expect(res.body.data.exceeded).toBe(true);
    expect(res.body.data.nudgeMessage).toBeDefined();
    expect(res.body.data.currentCo2Kg).toBe(10); // 50 * 0.20
  });
});

describe('PUT /api/settings/target', () => {
  it('sets a valid target', async () => {
    const res = await request(app)
      .put('/api/settings/target')
      .send({ weeklyTargetKg: 100 });

    expect(res.status).toBe(200);
    expect(res.body.data.weeklyTargetKg).toBe(100);
  });

  it('returns 400 for invalid target', async () => {
    const res = await request(app)
      .put('/api/settings/target')
      .send({ weeklyTargetKg: -10 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 for missing target', async () => {
    const res = await request(app)
      .put('/api/settings/target')
      .send({});

    expect(res.status).toBe(400);
  });
});
