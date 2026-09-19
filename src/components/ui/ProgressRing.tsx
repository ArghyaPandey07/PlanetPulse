import React, { useEffect, useState } from 'react';
import './ProgressRing.css';

interface ProgressRingProps {
  progressPercent: number;
  totalCo2Kg: number;
  targetKg?: number | null;
  exceeded?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ progressPercent, totalCo2Kg, targetKg, exceeded }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  useEffect(() => {
    // Animate over 800ms
    const duration = 800;
    const start = performance.now();
    const finalProgress = Math.min(progressPercent, 100);
    const finalTotal = totalCo2Kg;

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // ease-out quartic
      const easeOut = 1 - Math.pow(1 - progress, 4);

      setAnimatedProgress(finalProgress * easeOut);
      setAnimatedTotal(finalTotal * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedProgress(finalProgress);
        setAnimatedTotal(finalTotal);
      }
    };

    requestAnimationFrame(animate);
  }, [progressPercent, totalCo2Kg]);

  const radius = 100;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;
  
  const approxKm = Math.round(totalCo2Kg / 0.20);
  const strokeColor = exceeded ? 'var(--color-error)' : 'var(--color-primary)';

  return (
    <div className="pp-progress-ring-container">
      <div className="pp-progress-ring-wrapper">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="pp-progress-ring"
        >
          <circle
            className="pp-progress-ring__track"
            stroke="var(--color-border-light)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className="pp-progress-ring__fill"
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="pp-progress-ring__content">
          <span className="pp-progress-ring__value" style={{ color: strokeColor }}>
            {animatedTotal.toFixed(1)}
          </span>
          <span className="pp-progress-ring__label">kg CO₂</span>
        </div>
      </div>
      
      {targetKg !== null && targetKg !== undefined && (
        <div className="pp-progress-ring__stats">
          <div className="pp-progress-ring__stat">
            <span className="pp-progress-ring__stat-label">Target</span>
            <span className="pp-progress-ring__stat-value">{targetKg.toFixed(1)} kg</span>
          </div>
          <div className="pp-progress-ring__stat">
            <span className="pp-progress-ring__stat-label">Remaining</span>
            <span className="pp-progress-ring__stat-value">
              {exceeded ? '0.0 kg' : (targetKg - totalCo2Kg).toFixed(1) + ' kg'}
            </span>
          </div>
        </div>
      )}
      
      {exceeded ? (
        <p className="pp-progress-ring__context pp-progress-ring__context--exceeded">
          Weekly target exceeded.
        </p>
      ) : (
        <p className="pp-progress-ring__context">
          ≈ {approxKm} km driven
        </p>
      )}
    </div>
  );
};
