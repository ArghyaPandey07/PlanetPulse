import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
}) => {
  return (
    <div className={`pp-card pp-card--pad-${padding} ${hover ? 'pp-card--hover' : ''} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="pp-card__header">
      <div>
        <h3 className="pp-card__title">{title}</h3>
        {subtitle && <p className="pp-card__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="pp-card__action">{action}</div>}
    </div>
  );
};
