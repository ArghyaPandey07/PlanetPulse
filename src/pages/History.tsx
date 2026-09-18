import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Card, Input, Select, Button, EmptyState, ErrorState } from '../components/ui';
import { PageHeader } from '../components/layout';
import { CO2_FACTORS, CATEGORY_COLORS } from '../constants';
import { getActivities } from '../lib/api';
import type { Activity } from '../types';
import './History.css';

const TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All Types' },
  ...Object.entries(CO2_FACTORS).map(([value, info]) => ({
    value,
    label: info.label,
  })),
];

function formatCO2(kg: number): string {
  return `${kg.toFixed(2)} kg`;
}

export const History: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    const res = await getActivities({ type: typeFilter || undefined, startDate: dateFilter || undefined, endDate: dateFilter || undefined });
    if (res.success) {
      setActivities(res.data || []);
    } else {
      setError(res.errors?.[0]?.message || 'Failed to load activities');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [typeFilter, dateFilter]);

  const totalCO2 = activities.reduce((sum, item) => sum + item.co2Kg, 0);

  return (
    <div className="pp-history">
      <PageHeader
        title="Activity History"
        description="View and filter your logged activities"
      />

      {/* Filters */}
      <Card className="pp-history__filters">
        <div className="pp-history__filter-row">
          <Select
            label="Activity Type"
            options={TYPE_FILTER_OPTIONS}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          <Input
            label="Date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <div className="pp-history__filter-actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTypeFilter('');
                setDateFilter('');
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
        <div className="pp-history__summary">
          <span className="pp-history__count">
            {activities.length} {activities.length === 1 ? 'entry' : 'entries'}
          </span>
          <span className="pp-history__total">
            Total: {formatCO2(totalCO2)} CO₂
          </span>
        </div>
      </Card>

      {/* History List */}
      <Card padding="none" className="pp-history__list-card">
        {loading ? (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Loading activities...
          </div>
        ) : error ? (
           <ErrorState title="Failed to load" message={error} onRetry={fetchHistory} />
        ) : activities.length === 0 ? (
          <EmptyState
            icon={<Clock size={24} />}
            title="No activities found"
            description={
              typeFilter || dateFilter
                ? 'Try adjusting your filters to see more results.'
                : 'Start logging activities to see your history here.'
            }
            action={
              (typeFilter || dateFilter) ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setTypeFilter('');
                    setDateFilter('');
                  }}
                >
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="pp-history__table-wrapper">
            <table className="pp-history__table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>CO₂</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((item) => {
                  const info = CO2_FACTORS[item.type];
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="pp-history__type-cell">
                          <span
                            className="pp-history__dot"
                            style={{ background: CATEGORY_COLORS[item.type] }}
                          />
                          {info?.label || item.type}
                        </div>
                      </td>
                      <td>
                        {item.quantity} {item.unit || info?.unit}
                      </td>
                      <td className="pp-history__co2-cell">
                        {formatCO2(item.co2Kg)}
                      </td>
                      <td>{item.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
