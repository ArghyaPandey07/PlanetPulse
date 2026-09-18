import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import './ErrorState.css';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="pp-error" role="alert">
      <div className="pp-error__icon">
        <AlertTriangle size={24} />
      </div>
      <h3 className="pp-error__title">{title}</h3>
      <p className="pp-error__message">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};
