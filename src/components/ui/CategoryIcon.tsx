import React from 'react';
import { Car, Bus, Plane, Zap, Sprout, Beef } from 'lucide-react';
import type { ActivityType } from '../../types';
import './CategoryIcon.css';

const ICON_MAP: Record<ActivityType, React.FC<{ size?: number }>> = {
  car: Car,
  bus: Bus,
  flight: Plane,
  electricity: Zap,
  veg_meal: Sprout,
  nonveg_meal: Beef,
};

interface CategoryIconProps {
  type: ActivityType;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ type, size = 16 }) => {
  const Icon = ICON_MAP[type] || Car;

  return (
    <span className={`pp-cat-icon pp-cat-icon--${type}`}>
      <Icon size={size} />
    </span>
  );
};
