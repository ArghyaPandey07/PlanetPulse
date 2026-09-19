import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, PlusCircle, History, Menu, X, Leaf } from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/log', label: 'Log Activity', icon: PlusCircle },
  { to: '/history', label: 'History', icon: History },
] as const;

export const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="pp-sidebar-mobile-top">
        <div className="pp-brand">
          <Leaf className="pp-brand-icon" size={24} />
          <span className="pp-brand-name">PlanetPulse</span>
        </div>
        <button
          className="pp-mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`pp-sidebar ${mobileOpen ? 'pp-sidebar--open' : ''}`} aria-label="Main navigation">
        <div className="pp-sidebar__inner">
          <div className="pp-sidebar__header">
            <div className="pp-brand">
              <Leaf className="pp-brand-icon" size={24} />
              <span className="pp-brand-name">PlanetPulse</span>
            </div>
            <p className="pp-sidebar__tagline">Small Actions. A Healthier Planet.</p>
          </div>

          <nav className="pp-sidebar__nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `pp-sidebar__link ${isActive ? 'pp-sidebar__link--active' : ''}`
                }
              >
                <Icon size={20} className="pp-sidebar__link-icon" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="pp-sidebar-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}
    </>
  );
};
