import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <AnimatePresence mode="popLayout">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            id={errorId}
            className="pp-input-group__error"
            role="alert"
          >
            {error}
          </motion.p>
        )}
        {!error && hint && (
          <motion.p
            key="hint"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            id={hintId}
            className="pp-input-group__hint"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
