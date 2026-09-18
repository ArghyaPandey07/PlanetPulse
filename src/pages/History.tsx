import React from 'react';
import { Clock, Search, Filter, Trash2 } from 'lucide-react';
import { Card, Input, Select, Button, Badge, EmptyState } from '../components/ui';
import { PageHeader } from '../components/layout';
import { CO2_FACTORS, CATEGORY_COLORS } from '../constants';
import type { ActivityType, Activity } from '../types';
import './History.css';

// ── Mock data for layout development ────────────────────────────
const MOCK_HISTORY: Activity[] = [
  { id: '1', type: 'car', quantity: 40, unit: 'km', co2Kg: 8.0, date: '2026-09-18', createdAt: '2026-09-18T09:00:00Z', note: 'Commute to office' },
  { id: '2', type: 'flight', quantity: 25, unit: 'km', co2Kg: 6.25, date: '2026-09-17', createdAt: '2026-09-17T14:00:00Z' },
  { id: '3', type: 'electricity', quantity: 6, unit: 'kWh', co2Kg: 4.8, date: '2026-09-17', createdAt: '2026-09-17T08:00:00Z', note: 'AC usage' },
  { id: '4', type: 'nonveg_meal', quantity: 1, unit: 'meal', co2Kg: 2.0, date: '2026-09-16', createdAt: '2026-09-16T19:00:00Z' },
  { id: '5', type: 'veg_meal', quantity: 3, unit: 'meal', co2Kg: 1.5, date: '2026-09-16', createdAt: '2026-09-16T12:00:00Z' },
  { id: '6', type: 'bus', quantity: 10.6, unit: 'km', co2Kg: 0.85, date: '2026-09-15', createdAt: '2026-09-15T07:30:00Z', note: 'Bus to market' },
];

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
  const [typeFilter, setTypeFilter] = React.useState<string>('');
  const [dateFilter, setDateFilter] = React.useState<string>('');
  const [showEmpty, setShowEmpty] = React.useState(false);

  // TODO: Replace with real domain logic
  const filteredHistory = MOCK_HISTORY.filter((item) => {
    if (typeFilter && item.type !== typeFilter) return false;
    if (dateFilter && item.date !== dateFilter) return false;
    return true;
  });

  const totalCO2 = filteredHistory.reduce((sum, item) => sum + item.co2Kg, 0);

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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmpty((v) => !v)}
            >
              {showEmpty ? 'Show data' : 'Show empty state'}
            </Button>
          </div>
        </div>
        <div className="pp-history__summary">
          <span className="pp-history__count">
            {filteredHistory.length} {filteredHistory.length === 1 ? 'entry' : 'entries'}
          </span>
          <span className="pp-history__total">
            Total: {formatCO2(totalCO2)} CO₂
          </span>
        </div>
      </Card>

      {/* History List */}
      <Card padding="none" className="pp-history__list-card">
        {(showEmpty || filteredHistory.length === 0) ? (
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
                    setShowEmpty(false);
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
                  <th>Note</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => {
                  const info = CO2_FACTORS[item.type];
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="pp-history__type-cell">
                          <span
                            className="pp-history__dot"
                            style={{ background: CATEGORY_COLORS[item.type] }}
                          />
                          {info.label}
                        </div>
                      </td>
                      <td>
                        {item.quantity} {info.unit}
                      </td>
                      <td className="pp-history__co2-cell">
                        {formatCO2(item.co2Kg)}
                      </td>
                      <td>{item.date}</td>
                      <td className="pp-history__note-cell">
                        {item.note || <span className="pp-history__no-note">—</span>}
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Delete ${info.label} entry`}
                          icon={<Trash2 size={14} />}
                          onClick={() => {
                            // TODO: Wire to domain logic
                            console.log('Delete:', item.id);
                          }}
                        />
                      </td>
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
