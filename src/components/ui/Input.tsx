import React, { useId } from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((
  { label, error, hint, icon, className = '', id: externalId, ...props },
  ref
) => {
  const generatedId = useId();
  const id = externalId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={`pp-input-group ${error ? 'pp-input-group--error' : ''} ${className}`}>
      <label htmlFor={id} className="pp-input-group__label">
        {label}
      </label>
      <div className="pp-input-group__wrapper">
        {icon && <span className="pp-input-group__icon" aria-hidden="true">{icon}</span>}
        <input
          ref={ref}
          id={id}
          className={`pp-input ${icon ? 'pp-input--with-icon' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="pp-input-group__error" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={hintId} className="pp-input-group__hint">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
