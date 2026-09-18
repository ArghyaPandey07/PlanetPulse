import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, PlusCircle, History, Menu, X } from 'lucide-react';
import './Header.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/log', label: 'Log Activity', icon: PlusCircle },
  { to: '/history', label: 'History', icon: History },
] as const;

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="pp-header">
      <div className="pp-header__inner">
        <div className="pp-header__brand">
          <div className="pp-header__logo" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M8 12c0-3 1.5-6 4-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 12c0 3-1.5 6-4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="pp-header__name">PlanetPulse</span>
        </div>

        <nav className={`pp-header__nav ${mobileOpen ? 'pp-header__nav--open' : ''}`} aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `pp-header__link ${isActive ? 'pp-header__link--active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="pp-header__toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};
