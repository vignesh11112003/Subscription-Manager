
import { NavLink } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  CreditCard,
  ChartNoAxesCombined,
  LogOut,
} from "lucide-react";

import "./Navbar.css";

function Navbar({ currentUser, onLogout }) {
  const userInitial = currentUser?.name?.trim()?.charAt(0).toUpperCase() || "?";

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-brand-icon">
            <Wallet size={23} />
          </span>

          <span>SubTrack</span>
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" end className="nav-link">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/subscriptions" className="nav-link">
            <CreditCard size={18} />
            <span>Subscriptions</span>
          </NavLink>

          <NavLink to="/analytics" className="nav-link">
            <ChartNoAxesCombined size={18} />
            <span>Analytics</span>
          </NavLink>
        </nav>

        <div className="navbar-user-section">
          {currentUser && (
            <div className="navbar-user">
              <span className="navbar-avatar">
                {userInitial}
              </span>

              <span className="navbar-user-name">
                {currentUser.name}
              </span>
            </div>
          )}

          <button
            type="button"
            className="navbar-logout"
            onClick={onLogout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
