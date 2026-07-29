import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown
} from "react-icons/fi";

import "../../styles/header.css";

function Header() {

  return (

    <header className="header">

      {/* Left Side */}

      <div className="header-left">

        <button className="menu-btn">

          <FiMenu />

        </button>

        <div className="search-box">

          <FiSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search contracts, obligations..."
          />

          <span className="shortcut">

            ⌘ K

          </span>

        </div>

      </div>

      {/* Right Side */}

      <div className="header-right">

        <div className="notification">

          <FiBell />

          <span className="badge">

            3

          </span>

        </div>

        <div className="user">

          <div className="avatar">

            JD

          </div>

          <div>

            <h4>

              John Doe

            </h4>

            <p>

              Administrator

            </p>

          </div>

          <FiChevronDown />

        </div>

      </div>

    </header>

  );

}

export default Header;