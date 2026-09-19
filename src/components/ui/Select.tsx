import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './Select.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((
  { label, options, placeholder, error, className = '', icon, id: externalId, ...props },
  ref
) => {
  const generatedId = useId();
  const id = externalId || generatedId;
  const errorId = `${id}-error`;

  return (
    <div className={`pp-select-group ${error ? 'pp-select-group--error' : ''} ${className}`}>
      <label htmlFor={id} className="pp-select-group__label">
        {label}
      </label>
      <div className={`pp-select-group__wrapper ${icon ? 'pp-select-group__wrapper--with-icon' : ''}`}>
        {icon && <div className="pp-select-group__icon">{icon}</div>}
        <select
          ref={ref}
          id={id}
          className="pp-select"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pp-select-group__chevron" aria-hidden="true" />
      </div>
      <AnimatePresence mode="popLayout">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            id={errorId}
            className="pp-select-group__error"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Select.displayName = 'Select';
