import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="pp-page-header">
      <div>
        <h1 className="pp-page-header__title">{title}</h1>
        {description && (
          <p className="pp-page-header__desc">{description}</p>
        )}
      </div>
      {action && <div className="pp-page-header__action">{action}</div>}
    </div>
  );
};
