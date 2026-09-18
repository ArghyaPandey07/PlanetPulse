import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="pp-empty">
      <div className="pp-empty__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="pp-empty__title">{title}</h3>
      <p className="pp-empty__desc">{description}</p>
      {action && <div className="pp-empty__action">{action}</div>}
    </div>
  );
};
