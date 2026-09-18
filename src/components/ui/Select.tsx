import React, { useId } from 'react';
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
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((
  { label, options, placeholder, error, className = '', id: externalId, ...props },
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
      <div className="pp-select-group__wrapper">
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
      {error && (
        <p id={errorId} className="pp-select-group__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
