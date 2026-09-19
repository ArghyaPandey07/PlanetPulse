import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import './AppLayout.css';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -4 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.25,
} as const;

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="pp-layout">
      {/* Subtle climate-themed visual background elements */}
      <div className="pp-layout__bg-blobs" aria-hidden="true">
        <div className="pp-layout__bg-blob pp-layout__bg-blob--1" />
        <div className="pp-layout__bg-blob pp-layout__bg-blob--2" />
        <div className="pp-layout__bg-blob pp-layout__bg-blob--3" />
      </div>
      <div className="pp-layout__bg-noise" aria-hidden="true" />
      
      <Sidebar />
      <main className="pp-layout__main">
        <div className="pp-layout__content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ width: '100%', height: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
