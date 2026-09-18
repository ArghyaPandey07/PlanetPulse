import React from 'react';
import { TrendingUp, Target, Zap, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, Badge } from '../components/ui';
import { PageHeader } from '../components/layout';
import { CO2_FACTORS, CATEGORY_COLORS } from '../constants';
import type { ActivityType } from '../types';
import './Dashboard.css';

// ── Mock data for layout development ────────────────────────────
// TODO: Replace with real domain logic integration
const MOCK_WEEK_RANGE = 'Sep 15 – Sep 21, 2026';
const MOCK_TOTAL_CO2 = 23.4;
const MOCK_TARGET = 35;
const MOCK_PROGRESS = (MOCK_TOTAL_CO2 / MOCK_TARGET) * 100;

const MOCK_BREAKDOWN: { type: ActivityType; totalKg: number }[] = [
  { type: 'car', totalKg: 8.0 },
  { type: 'flight', totalKg: 6.25 },
  { type: 'electricity', totalKg: 4.8 },
  { type: 'nonveg_meal', totalKg: 2.0 },
  { type: 'veg_meal', totalKg: 1.5 },
  { type: 'bus', totalKg: 0.85 },
];

const MOCK_RECENT = [
  { id: '1', type: 'car' as ActivityType, quantity: 40, unit: 'km', co2Kg: 8.0, date: '2026-09-18' },
  { id: '2', type: 'flight' as ActivityType, quantity: 25, unit: 'km', co2Kg: 6.25, date: '2026-09-17' },
  { id: '3', type: 'electricity' as ActivityType, quantity: 6, unit: 'kWh', co2Kg: 4.8, date: '2026-09-17' },
];

function formatCO2(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  return `${kg.toFixed(1)} kg`;
}

export const Dashboard: React.FC = () => {
  const isOnTrack = MOCK_TOTAL_CO2 <= MOCK_TARGET;

  return (
    <div className="pp-dashboard">
      <PageHeader
        title="Dashboard"
        description={`Week of ${MOCK_WEEK_RANGE}`}
      />

      {/* ── KPI Row ──────────────────────────────── */}
      <div className="pp-dashboard__kpis">
        <Card className="pp-kpi">
          <div className="pp-kpi__icon pp-kpi__icon--primary">
            <TrendingUp size={20} />
          </div>
          <div className="pp-kpi__content">
            <p className="pp-kpi__label">Total Emissions</p>
            <p className="pp-kpi__value">{formatCO2(MOCK_TOTAL_CO2)}</p>
            <p className="pp-kpi__sub">CO₂ this week</p>
          </div>
        </Card>

        <Card className="pp-kpi">
          <div className="pp-kpi__icon pp-kpi__icon--target">
            <Target size={20} />
          </div>
          <div className="pp-kpi__content">
            <p className="pp-kpi__label">Weekly Target</p>
            <p className="pp-kpi__value">{formatCO2(MOCK_TARGET)}</p>
            <Badge variant={isOnTrack ? 'success' : 'warning'}>
              {isOnTrack ? 'On track' : 'Exceeded'}
            </Badge>
          </div>
        </Card>

        <Card className="pp-kpi">
          <div className="pp-kpi__icon pp-kpi__icon--remaining">
            <Zap size={20} />
          </div>
          <div className="pp-kpi__content">
            <p className="pp-kpi__label">Remaining</p>
            <p className="pp-kpi__value">
              {formatCO2(Math.max(0, MOCK_TARGET - MOCK_TOTAL_CO2))}
            </p>
            <p className="pp-kpi__sub">
              {isOnTrack
                ? `${(100 - MOCK_PROGRESS).toFixed(0)}% of budget left`
                : 'Target exceeded — keep going!'}
            </p>
          </div>
        </Card>
      </div>

      {/* ── Main Grid ───────────────────────────── */}
      <div className="pp-dashboard__grid">
        {/* Progress Bar Card */}
        <Card className="pp-dashboard__progress-card">
          <CardHeader
            title="Weekly Progress"
            subtitle={`${MOCK_WEEK_RANGE}`}
          />
          <div className="pp-progress">
            <div className="pp-progress__bar">
              <div
                className={`pp-progress__fill ${MOCK_PROGRESS > 100 ? 'pp-progress__fill--exceeded' : ''}`}
                style={{ width: `${Math.min(MOCK_PROGRESS, 100)}%` }}
              />
              {MOCK_PROGRESS <= 100 && (
                <div
                  className="pp-progress__marker"
                  style={{ left: `${MOCK_PROGRESS}%` }}
                />
              )}
            </div>
            <div className="pp-progress__labels">
              <span>{formatCO2(MOCK_TOTAL_CO2)} used</span>
              <span>{formatCO2(MOCK_TARGET)} target</span>
            </div>
          </div>
          {!isOnTrack && (
            <div className="pp-progress__encouragement">
              <p>You've gone a bit over your target — that's okay! Every small change helps. Consider taking the bus or having a veggie meal tomorrow. 🌱</p>
            </div>
          )}
        </Card>

        {/* Category Breakdown */}
        <Card className="pp-dashboard__breakdown-card">
          <CardHeader title="By Category" subtitle="This week's breakdown" />
          <div className="pp-breakdown">
            {MOCK_BREAKDOWN.map(({ type, totalKg }) => {
              const pct = MOCK_TOTAL_CO2 > 0 ? (totalKg / MOCK_TOTAL_CO2) * 100 : 0;
              const info = CO2_FACTORS[type];
              return (
                <div key={type} className="pp-breakdown__row">
                  <div className="pp-breakdown__label">
                    <span
                      className="pp-breakdown__dot"
                      style={{ background: CATEGORY_COLORS[type] }}
                    />
                    <span className="pp-breakdown__name">{info.label}</span>
                  </div>
                  <div className="pp-breakdown__bar-wrapper">
                    <div
                      className="pp-breakdown__bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: CATEGORY_COLORS[type],
                      }}
                    />
                  </div>
                  <span className="pp-breakdown__value">{formatCO2(totalKg)}</span>
                  <span className="pp-breakdown__pct">{pct.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="pp-dashboard__recent-card" padding="none">
          <div style={{ padding: 'var(--space-6) var(--space-6) 0' }}>
            <CardHeader title="Recent Activity" subtitle="Latest entries" />
          </div>
          <div className="pp-recent">
            {MOCK_RECENT.map((entry) => {
              const info = CO2_FACTORS[entry.type];
              return (
                <div key={entry.id} className="pp-recent__row">
                  <span
                    className="pp-recent__dot"
                    style={{ background: CATEGORY_COLORS[entry.type] }}
                  />
                  <div className="pp-recent__info">
                    <span className="pp-recent__type">{info.label}</span>
                    <span className="pp-recent__detail">
                      {entry.quantity} {info.unit} · {entry.date}
                    </span>
                  </div>
                  <div className="pp-recent__co2">
                    <span>{formatCO2(entry.co2Kg)}</span>
                    <ArrowUpRight size={14} className="pp-recent__arrow" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
