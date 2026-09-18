import React, { useEffect, useState } from 'react';
import { TrendingUp, Target, Zap, Edit2 } from 'lucide-react';
import { Card, CardHeader, Badge, Button, Modal, Input, ErrorState } from '../components/ui';
import { PageHeader } from '../components/layout';
import { CO2_FACTORS, CATEGORY_COLORS } from '../constants';
import { getDashboard, getWeekly, updateTarget } from '../lib/api';
import type { DashboardData, WeeklyData } from '../lib/api';
import type { ActivityType } from '../types';
import './Dashboard.css';

function formatCO2(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  return `${kg.toFixed(1)} kg`;
}

export const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Target modal state
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetInput, setTargetInput] = useState('');
  const [targetError, setTargetError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const [dashRes, weekRes] = await Promise.all([getDashboard(), getWeekly()]);
    
    if (!dashRes.success || !weekRes.success) {
      setError(dashRes.errors?.[0]?.message || weekRes.errors?.[0]?.message || 'Failed to load dashboard data');
    } else {
      setDashboardData(dashRes.data!);
      setWeeklyData(weekRes.data!);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    setTargetError(null);
    const val = targetInput ? parseFloat(targetInput) : null;
    
    const res = await updateTarget(val);
    if (res.success) {
      setIsTargetModalOpen(false);
      fetchData(); // Refresh data
    } else {
      setTargetError(res.errors?.[0]?.message || 'Failed to update target');
    }
  };

  if (loading) {
    return <div className="pp-dashboard"><p style={{ padding: 'var(--space-6)' }}>Loading dashboard...</p></div>;
  }

  if (error || !dashboardData || !weeklyData) {
    return (
      <div className="pp-dashboard">
        <ErrorState title="Error" message={error || 'Could not load data'} onRetry={fetchData} />
      </div>
    );
  }

  const { totalCo2Kg, categoryBreakdown, weekRange } = dashboardData;
  const { targetKg, progressPercent, exceeded, nudgeMessage } = weeklyData;

  const isOnTrack = !exceeded;
  const progress = progressPercent ?? 0;
  
  // Format breakdown for sorting
  const breakdownList = Object.entries(categoryBreakdown).map(([type, totalKg]) => ({
    type: type as ActivityType,
    totalKg
  })).sort((a, b) => b.totalKg - a.totalKg);

  return (
    <div className="pp-dashboard">
      <PageHeader
        title="Dashboard"
        description={`Week of ${weekRange.start} – ${weekRange.end}`}
      />

      {/* ── KPI Row ──────────────────────────────── */}
      <div className="pp-dashboard__kpis">
        <Card className="pp-kpi">
          <div className="pp-kpi__icon pp-kpi__icon--primary">
            <TrendingUp size={20} />
          </div>
          <div className="pp-kpi__content">
            <p className="pp-kpi__label">Total Emissions</p>
            <p className="pp-kpi__value">{formatCO2(totalCo2Kg)}</p>
            <p className="pp-kpi__sub">CO₂ this week</p>
          </div>
        </Card>

        <Card className="pp-kpi">
          <div className="pp-kpi__icon pp-kpi__icon--target">
            <Target size={20} />
          </div>
          <div className="pp-kpi__content" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="pp-kpi__label">Weekly Target</p>
                <p className="pp-kpi__value">{targetKg === null ? 'Not set' : formatCO2(targetKg)}</p>
              </div>
              <Button variant="ghost" size="sm" icon={<Edit2 size={14} />} onClick={() => {
                setTargetInput(targetKg !== null ? String(targetKg) : '');
                setIsTargetModalOpen(true);
              }} />
            </div>
            {targetKg !== null && (
              <Badge variant={isOnTrack ? 'success' : 'warning'}>
                {isOnTrack ? 'On track' : 'Exceeded'}
              </Badge>
            )}
          </div>
        </Card>

        <Card className="pp-kpi">
          <div className="pp-kpi__icon pp-kpi__icon--remaining">
            <Zap size={20} />
          </div>
          <div className="pp-kpi__content">
            <p className="pp-kpi__label">Remaining</p>
            <p className="pp-kpi__value">
              {targetKg === null ? '—' : formatCO2(Math.max(0, targetKg - totalCo2Kg))}
            </p>
            <p className="pp-kpi__sub">
              {targetKg === null 
                ? 'Set a target first'
                : (isOnTrack ? `${(100 - progress).toFixed(0)}% of budget left` : 'Target exceeded — keep going!')
              }
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
            subtitle={`${weekRange.start} – ${weekRange.end}`}
          />
          {targetKg === null ? (
             <div className="pp-progress__encouragement">
               <p>Set a weekly target to track your progress and reduce your footprint!</p>
             </div>
          ) : (
            <>
              <div className="pp-progress">
                <div className="pp-progress__bar">
                  <div
                    className={`pp-progress__fill ${exceeded ? 'pp-progress__fill--exceeded' : ''}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                  {progress <= 100 && (
                    <div
                      className="pp-progress__marker"
                      style={{ left: `${progress}%` }}
                    />
                  )}
                </div>
                <div className="pp-progress__labels">
                  <span>{formatCO2(totalCo2Kg)} used</span>
                  <span>{formatCO2(targetKg)} target</span>
                </div>
              </div>
              {nudgeMessage && (
                <div className="pp-progress__encouragement">
                  <p>{nudgeMessage}</p>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Category Breakdown */}
        <Card className="pp-dashboard__breakdown-card">
          <CardHeader title="By Category" subtitle="This week's breakdown" />
          <div className="pp-breakdown">
            {breakdownList.length === 0 ? (
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>No activities logged this week.</p>
            ) : (
              breakdownList.map(({ type, totalKg }) => {
                const pct = totalCo2Kg > 0 ? (totalKg / totalCo2Kg) * 100 : 0;
                const info = CO2_FACTORS[type];
                return (
                  <div key={type} className="pp-breakdown__row">
                    <div className="pp-breakdown__label">
                      <span
                        className="pp-breakdown__dot"
                        style={{ background: CATEGORY_COLORS[type] }}
                      />
                      <span className="pp-breakdown__name">{info?.label || type}</span>
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
              })
            )}
          </div>
        </Card>
      </div>

      <Modal isOpen={isTargetModalOpen} onClose={() => setIsTargetModalOpen(false)} title="Set Weekly Target">
        <form onSubmit={handleUpdateTarget} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Weekly Target (kg CO₂)"
            type="number"
            min="0"
            step="any"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            placeholder="Leave blank to clear target"
            error={targetError || undefined}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <Button variant="ghost" type="button" onClick={() => setIsTargetModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Target</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
