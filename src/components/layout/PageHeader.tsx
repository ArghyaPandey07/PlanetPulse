import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  description?: string;
  context?: string; // e.g. "PlanetPulse / Dashboard"
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  context,
  action,
}) => {
  return (
    <div className="pp-page-header">
      <div className="pp-page-header__content">
        {context && <span className="pp-page-header__context">{context}</span>}
        <h1 className="pp-page-header__title">
          {title}
          <svg className="pp-page-header__deco" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 20A7 7 0 0 1 4 13c0-3.5 2.5-6.5 6-7.5 1.5-.5 3.5-.5 5.5 0 .5 3 .5 6.5 0 8.5-1 4.5-4.5 6-4.5 6Z" fill="currentColor" opacity="0.1" />
            <path d="M15.5 5.5c-3 5-5.5 7.5-5.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
          </svg>
        </h1>
        {description && (
          <p className="pp-page-header__desc">{description}</p>
        )}
      </div>
      {action && <div className="pp-page-header__action">{action}</div>}
    </div>
  );
};
