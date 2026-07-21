import React from "react";
import {
  FaBars,
  FaSearch,
  FaBell,
  FaCalendarAlt,
  FaChevronDown
} from "react-icons/fa";

function Navbar() {
  return (
    <div style={styles.navbar}>

      <div style={styles.leftSection}>

        <button style={styles.menuButton}>
          <FaBars />
        </button>

        <div style={styles.searchBox}>

          <FaSearch style={styles.searchIcon} />

          <input
            type="text"
            placeholder="Search contracts, obligations, documents..."
            style={styles.searchInput}
          />

        </div>

      </div>

      <div style={styles.rightSection}>

        <div style={styles.iconButton}>
          <FaBell />
          <span style={styles.badge}>3</span>
        </div>

        <div style={styles.iconButton}>
          <FaCalendarAlt />
        </div>

        <div style={styles.profile}>

          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="profile"
            style={styles.image}
          />

          <div>

            <div style={styles.name}>
              Admin
            </div>

            <div style={styles.role}>
              Administrator
            </div>

          </div>

          <FaChevronDown
            style={{
              color: "#666",
              marginLeft: 8
            }}
          />

        </div>

      </div>

    </div>
  );
}

const styles = {

  navbar: {
    height: 80,
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 28px",
    borderRadius: 18,
    marginBottom: 25,
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)"
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: 18
  },

  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    border: "none",
    background: "#F3F4F6",
    cursor: "pointer",
    fontSize: 18
  },

  searchBox: {
    width: 430,
    display: "flex",
    alignItems: "center",
    background: "#F5F7FB",
    borderRadius: 12,
    padding: "12px 18px"
  },

  searchIcon: {
    color: "#999",
    marginRight: 12
  },

  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    width: "100%",
    fontSize: 15
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 20
  },

  iconButton: {
    width: 42,
    height: 42,
    background: "#F5F7FB",
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    cursor: "pointer",
    fontSize: 18
  },

  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    background: "#EF4444",
    color: "#fff",
    borderRadius: "50%",
    fontSize: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginLeft: 10
  },

  image: {
    width: 45,
    height: 45,
    borderRadius: "50%"
  },

  name: {
    fontWeight: "600",
    color: "#222"
  },

  role: {
    fontSize: 13,
    color: "#888"
  }

};

export default Navbar;