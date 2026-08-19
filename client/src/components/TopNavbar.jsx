import { Bell, CalendarDays, Search, Plus, ChevronDown } from "lucide-react";
import "../styles/renewal-dashboard.css";

export default function TopNavbar() {
  return (
    <div className="top-navbar">
      <div className="top-navbar__search">
        <Search size={16} className="top-navbar__search-icon" />
        <input
          type="text"
          placeholder="Search contracts, obligations..."
          className="top-navbar__search-input"
        />
      </div>

      <div className="top-navbar__actions">
        <button type="button" className="top-navbar__pill top-navbar__pill--ghost">
          <CalendarDays size={16} />
          Today
        </button>

        <button type="button" className="top-navbar__icon-button">
          <Bell size={18} />
          <span className="top-navbar__badge">2</span>
        </button>

        <button type="button" className="top-navbar__button top-navbar__button--primary">
          <Plus size={16} />
          Quick Action
        </button>

        <button type="button" className="top-navbar__profile">
          <span className="top-navbar__avatar">AM</span>
          <div className="top-navbar__profile-text">
            <strong>Arjun Mehta</strong>
            <span>Administrator</span>
          </div>
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
