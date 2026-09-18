import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Card, CardHeader, Input, Select, Button } from '../components/ui';
import { PageHeader } from '../components/layout';
import { CO2_FACTORS } from '../constants';
import type { ActivityType } from '../types';
import './LogActivity.css';

const ACTIVITY_OPTIONS = Object.entries(CO2_FACTORS).map(([value, info]) => ({
  value,
  label: `${info.label} (${info.factor} kg/${info.unit})`,
}));

export const LogActivity: React.FC = () => {
  const [selectedType, setSelectedType] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState<string>('');
  const [note, setNote] = React.useState<string>('');
  const [date, setDate] = React.useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const selectedInfo = selectedType
    ? CO2_FACTORS[selectedType as ActivityType]
    : null;

  const estimatedCO2 = selectedInfo && quantity
    ? (parseFloat(quantity) * selectedInfo.factor)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire to domain logic
    console.log('Submit:', { type: selectedType, quantity, date, note });
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
          <form onSubmit={handleSubmit} className="pp-log__form">
            <Select
              label="Activity Type"
              options={ACTIVITY_OPTIONS}
              placeholder="Select an activity…"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
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
              hint={selectedInfo ? `${selectedInfo.factor} kg CO₂ per ${selectedInfo.unit}` : undefined}
            />

            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <Input
              label="Note (optional)"
              placeholder="e.g., Commute to office"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {/* Live CO₂ Estimate */}
            {estimatedCO2 > 0 && (
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
              icon={<PlusCircle size={18} />}
              disabled={!selectedType || !quantity}
            >
              Log Activity
            </Button>
          </form>
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
