import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, format = (v) => v.toString() }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const display = useTransform(spring, (current) => format(current));

  if (!isClient) return <span>{format(value)}</span>;

  return <motion.span>{display}</motion.span>;
};
