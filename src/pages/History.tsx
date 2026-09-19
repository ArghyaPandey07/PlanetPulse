import React, { useEffect, useState } from 'react';
import { Clock, Filter, X } from 'lucide-react';
import { Card, Input, Select, Button, EmptyState, ErrorState, CategoryIcon } from '../components/ui';
import { PageHeader } from '../components/layout';
import { CO2_FACTORS } from '../constants';
import { getActivities } from '../lib/api';
import type { Activity, ActivityType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import './History.css';

const TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All Categories' },
  ...Object.entries(CO2_FACTORS).map(([value, info]) => ({
    value,
    label: info.label,
  })),
];

function formatCO2(kg: number): string {
  return `+${kg.toFixed(1)} kg`;
}

export const History: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getActivities({ 
      type: typeFilter || undefined, 
      startDate: startDate || undefined, 
      endDate: endDate || undefined 
    });
    if (res.success) {
      setActivities(res.data || []);
    } else {
      setError(res.errors?.[0]?.message || 'Failed to load activities');
    }
    setLoading(false);
  }, [typeFilter, startDate, endDate]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const totalCO2 = activities.reduce((sum, item) => sum + item.co2Kg, 0);

  return (
    <div className="pp-history">
      <PageHeader
        title="Activity History"
        context="Activity Log / History"
        description="View and filter your logged environmental impact"
      />

      <motion.div 
        className="pp-history__layout"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        {/* Filters */}
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}>
          <Card className="pp-history__filters-card">
            <div className="pp-history__filters-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Filter size={16} className="pp-history__filters-icon" />
                <span className="pp-history__filters-title">Filter Records</span>
              </div>
              <div className="pp-history__summary">
                <span className="pp-history__summary-item">
                  <strong>{activities.length}</strong> {activities.length === 1 ? 'record' : 'records'}
                </span>
                <span className="pp-history__summary-item pp-history__summary-item--total">
                  <strong>{totalCO2.toFixed(1)} kg</strong> total CO₂
                </span>
              </div>
            </div>
            <div className="pp-history__filter-grid">
              <Select
                label="Category"
                options={TYPE_FILTER_OPTIONS}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                icon={typeFilter ? <CategoryIcon type={typeFilter as ActivityType} size={14} /> : undefined}
              />
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
              <div className="pp-history__filter-actions">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setTypeFilter('');
                    setStartDate('');
                    setEndDate('');
                  }}
                  disabled={!typeFilter && !startDate && !endDate}
                  icon={<X size={16} />}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* History List */}
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}>
          <Card padding="none" className="pp-history__list-card">
            {loading ? (
              <div className="pp-history__loading">
                <div className="pp-history__loading-spinner" />
                <span>Loading activities...</span>
              </div>
            ) : error ? (
               <ErrorState title="Failed to load" message={error} onRetry={fetchHistory} />
            ) : activities.length === 0 ? (
              <EmptyState
                icon={<Clock size={24} />}
                title="No activities found"
                description={
                  typeFilter || startDate || endDate
                    ? 'No records match your current filters. Try adjusting them.'
                    : 'Your activity history is empty. Start logging to build your record.'
                }
                action={
                  (typeFilter || startDate || endDate) ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setTypeFilter('');
                        setStartDate('');
                        setEndDate('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <div className="pp-history__list">
                <AnimatePresence>
                  {activities.map((item) => {
                    const info = CO2_FACTORS[item.type];
                    return (
                      <motion.div 
                        key={item.id}
                        className="pp-history-item pp-card--hover"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="pp-history-item__icon-wrapper">
                          <CategoryIcon type={item.type} size={24} />
                        </div>
                        <div className="pp-history-item__content">
                          <h4 className="pp-history-item__title">{info?.label || item.type}</h4>
                          <div className="pp-history-item__meta">
                            <span className="pp-history-item__quantity">
                              {item.quantity} {item.unit || info?.unit}
                            </span>
                            <span className="pp-history-item__divider">•</span>
                            <span className="pp-history-item__date">
                              {new Date(item.date).toLocaleDateString(undefined, { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="pp-history-item__emissions">
                          {formatCO2(item.co2Kg)}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
