import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import './AppLayout.css';

export const AppLayout: React.FC = () => {
  return (
    <div className="pp-layout">
      <Header />
      <main className="pp-layout__main">
        <div className="pp-layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
