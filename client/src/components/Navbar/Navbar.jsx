import "./Navbar.css";
import {
  MdMenu,
  MdSearch,
  MdNotificationsNone,
  MdCalendarToday,
  MdKeyboardArrowDown,
} from "react-icons/md";

const Navbar = () => {
  return (
    <header className="navbar">

      <div className="navbar-left">

        <button className="menu-btn">
          <MdMenu />
        </button>

        <div className="search-box">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search contracts, obligations, documents..."
          />
        </div>

      </div>

      <div className="navbar-right">

        <div className="nav-icon">
          <MdNotificationsNone />
          <span className="badge">3</span>
        </div>

        <div className="nav-icon">
          <MdCalendarToday />
        </div>

        <div className="profile">

          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="profile"
          />

          <div className="profile-info">
            <h4>Spandana Doe</h4>
            <p>Compliance Manager</p>
          </div>

          <MdKeyboardArrowDown />

        </div>

      </div>

    </header>
  );
};

export default Navbar;
