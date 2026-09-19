import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div 
      className="pp-empty"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pp-empty__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="pp-empty__title">{title}</h3>
      <p className="pp-empty__desc">{description}</p>
      {action && <div className="pp-empty__action">{action}</div>}
    </motion.div>
  );
};
