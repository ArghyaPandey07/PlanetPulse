import React, { useState } from 'react';
import { PlusCircle, CheckCircle, Leaf, Car, Bus, Plane, Zap, Sprout, Beef } from 'lucide-react';
import { Card, CardHeader, Input, Button, ErrorState, CategoryIcon } from '../components/ui';
import { PageHeader } from '../components/layout';
import { CO2_FACTORS } from '../constants';
import { logActivity } from '../lib/api';
import type { ActivityType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import './LogActivity.css';



const CATEGORY_ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  car: Car,
  bus: Bus,
  flight: Plane,
  electricity: Zap,
  veg_meal: Sprout,
  nonveg_meal: Beef,
};

// Group categories for the visual selector
const CATEGORY_GROUPS: { group: string; types: ActivityType[] }[] = [
  { group: 'Transport', types: ['car', 'bus', 'flight'] },
  { group: 'Food', types: ['veg_meal', 'nonveg_meal'] },
  { group: 'Energy', types: ['electricity'] },
];

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
    if (loading) return; // Prevent duplicate submissions
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
        context="Activity Log / New Entry"
        description="Record your carbon-producing activities"
      />

      <motion.div 
        className="pp-log__grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        {/* ── Left Column: Form ──────────────────── */}
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}>
          <Card className="pp-log__form-card">
            <CardHeader title="New Entry" subtitle="Select a category and enter the details" />
          
          <AnimatePresence mode="wait">
          {generalError && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: 'var(--space-4)' }}
            >
              <ErrorState title="Error logging activity" message={generalError} />
            </motion.div>
          )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
          {successCo2 !== null ? (
            <motion.div 
              key="success"
              className="pp-log__success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="pp-log__success-icon">
                <CheckCircle size={48} />
              </div>
              <h3 className="pp-log__success-title">Activity Logged!</h3>
              <p className="pp-log__success-message">
                This activity contributed <strong>{successCo2.toFixed(2)} kg CO₂</strong> to your footprint.
              </p>
              <Button 
                className="pp-log__success-btn"
                onClick={() => setSuccessCo2(null)}
                icon={<PlusCircle size={18} />}
              >
                Log Another Activity
              </Button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              onSubmit={handleSubmit} 
              className="pp-log__form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Category Selector */}
              <div className="pp-log__categories">
                <label className="pp-log__field-label">Activity Category</label>
                <div className="pp-log__category-groups">
                  {CATEGORY_GROUPS.map(({ group, types }) => (
                    <div key={group} className="pp-log__category-group">
                      <span className="pp-log__group-label">{group}</span>
                      <div className="pp-log__group-items">
                        {types.map((type) => {
                          const info = CO2_FACTORS[type];
                          const Icon = CATEGORY_ICON_MAP[type] || Leaf;
                          const isSelected = selectedType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              className={`pp-log__category-btn ${isSelected ? 'pp-log__category-btn--active' : ''}`}
                              onClick={() => setSelectedType(type)}
                              aria-pressed={isSelected}
                            >
                              <Icon size={20} />
                              <span>{info.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                {errorMap.type && (
                  <p className="pp-log__field-error">{errorMap.type}</p>
                )}
              </div>

              {/* Quantity Input */}
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

              {/* Date Input */}
              <Input
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                error={errorMap.date}
                required
              />

              {/* Estimate Preview */}
              <AnimatePresence>
              {estimatedCO2 > 0 && !errorMap.quantity && (
                <motion.div 
                  className="pp-log__estimate"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="pp-log__estimate-inner">
                    <span className="pp-log__estimate-label">Estimated CO₂</span>
                    <span className="pp-log__estimate-value">
                      {estimatedCO2.toFixed(2)} kg
                    </span>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loading}
                icon={!loading && <PlusCircle size={18} />}
                disabled={!selectedType || !quantity || loading}
              >
                {loading ? 'Logging...' : 'Log Activity'}
              </Button>
            </motion.form>
          )}
          </AnimatePresence>
          </Card>
        </motion.div>

        {/* ── Right Column: Context ─────────────── */}
        <motion.div 
          className="pp-log__sidebar"
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
        >
          {/* CO₂ Factors Reference */}
          <Card className="pp-log__reference-card">
            <CardHeader title="CO₂ Factors" subtitle="Reference guide" />
            <div className="pp-log__factors">
              {Object.entries(CO2_FACTORS).map(([key, info]) => (
                <div 
                  key={key} 
                  className={`pp-log__factor-row ${selectedType === key ? 'pp-log__factor-row--active' : ''}`}
                >
                  <div className="pp-log__factor-left">
                    <CategoryIcon type={key as ActivityType} size={16} />
                    <span className="pp-log__factor-name">{info.label}</span>
                  </div>
                  <span className="pp-log__factor-value">
                    {info.factor} kg/{info.unit}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Environmental Tip */}
          <Card className="pp-log__tip-card">
            <div className="pp-log__tip-content">
              <Leaf className="pp-log__tip-icon" size={24} />
              <p className="pp-log__tip-text">
                Tracking your carbon footprint is the first step toward reducing it. Small changes in daily habits can make a meaningful difference.
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
