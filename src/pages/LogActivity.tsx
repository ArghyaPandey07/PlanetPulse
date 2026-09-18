import React, { useState } from 'react';
import { PlusCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, Input, Select, Button, ErrorState } from '../components/ui';
import { PageHeader } from '../components/layout';
import { CO2_FACTORS } from '../constants';
import { logActivity } from '../lib/api';
import type { ActivityType } from '../types';
import './LogActivity.css';

const ACTIVITY_OPTIONS = Object.entries(CO2_FACTORS).map(([value, info]) => ({
  value,
  label: `${info.label} (${info.factor} kg/${info.unit})`,
}));

export const LogActivity: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successCo2, setSuccessCo2] = useState<number | null>(null);

  const selectedInfo = selectedType ? CO2_FACTORS[selectedType as ActivityType] : null;
  const estimatedCO2 = selectedInfo && quantity ? parseFloat(quantity) * selectedInfo.factor : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMap({});
    setGeneralError(null);
    setSuccessCo2(null);

    const res = await logActivity({
      type: selectedType,
      quantity: quantity,
      date,
    });

    setLoading(false);

    if (res.success && res.data) {
      setSuccessCo2(res.data.co2Kg);
      // Clear form
      setSelectedType('');
      setQuantity('');
      setDate(new Date().toISOString().split('T')[0]);
    } else if (res.errors) {
      const fieldErrors: Record<string, string> = {};
      res.errors.forEach(err => {
        if (err.field === 'general') {
          setGeneralError(err.message);
        } else {
          fieldErrors[err.field] = err.message;
        }
      });
      setErrorMap(fieldErrors);
    }
  };

  return (
    <div className="pp-log">
      <PageHeader
        title="Log Activity"
        description="Record your carbon-producing activities"
      />

      <div className="pp-log__grid">
        <Card className="pp-log__form-card">
          <CardHeader title="New Entry" subtitle="Add an activity to your log" />
          
          {generalError && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <ErrorState title="Error logging activity" message={generalError} />
            </div>
          )}

          {successCo2 !== null ? (
            <div className="pp-log__success" style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
              <CheckCircle size={48} color="var(--color-success)" style={{ margin: '0 auto var(--space-4)' }} />
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>Activity Logged!</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                This activity contributed <strong>{successCo2.toFixed(2)} kg CO₂</strong> to your footprint.
              </p>
              <Button style={{ marginTop: 'var(--space-6)' }} onClick={() => setSuccessCo2(null)}>
                Log Another Activity
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pp-log__form">
              <Select
                label="Activity Type"
                options={ACTIVITY_OPTIONS}
                placeholder="Select an activity…"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                error={errorMap.type}
                required
              />

              <Input
                label={`Quantity${selectedInfo ? ` (${selectedInfo.unit})` : ''}`}
                type="number"
                placeholder={selectedInfo ? `Enter ${selectedInfo.unit}` : 'Select activity first'}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="any"
                required
                disabled={!selectedType}
                error={errorMap.quantity}
                hint={selectedInfo ? `${selectedInfo.factor} kg CO₂ per ${selectedInfo.unit}` : undefined}
              />

              <Input
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                error={errorMap.date}
                required
              />

              {estimatedCO2 > 0 && !errorMap.quantity && (
                <div className="pp-log__estimate">
                  <span className="pp-log__estimate-label">Estimated CO₂</span>
                  <span className="pp-log__estimate-value">
                    {estimatedCO2.toFixed(2)} kg
                  </span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loading}
                icon={!loading && <PlusCircle size={18} />}
                disabled={!selectedType || !quantity || loading}
              >
                Log Activity
              </Button>
            </form>
          )}
        </Card>

        {/* Quick Reference */}
        <Card className="pp-log__reference-card">
          <CardHeader title="CO₂ Factors" subtitle="Reference guide" />
          <div className="pp-log__factors">
            {Object.entries(CO2_FACTORS).map(([key, info]) => (
              <div key={key} className="pp-log__factor-row">
                <span className="pp-log__factor-name">{info.label}</span>
                <span className="pp-log__factor-value">
                  {info.factor} kg/{info.unit}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
