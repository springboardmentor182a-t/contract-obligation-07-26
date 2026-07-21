import React from "react";
import {
  FaHome,
  FaFileContract,
  FaClipboardList,
  FaSyncAlt,
  FaBell,
  FaChartPie,
  FaCalendarAlt,
  FaFolderOpen,
  FaCog,
  FaQuestionCircle
} from "react-icons/fa";

function Sidebar() {

  const menu = [
    { icon: <FaHome />, text: "Dashboard", active: false },
    { icon: <FaFileContract />, text: "Contracts", active: false },
    { icon: <FaClipboardList />, text: "Obligations", active: false },
    { icon: <FaSyncAlt />, text: "Renewals", active: true },
    { icon: <FaBell />, text: "Alerts", active: false },
    { icon: <FaChartPie />, text: "Reports", active: false },
    { icon: <FaCalendarAlt />, text: "Calendar", active: false },
    { icon: <FaFolderOpen />, text: "Documents", active: false },
    { icon: <FaCog />, text: "Settings", active: false },
    { icon: <FaQuestionCircle />, text: "Help & Support", active: false }
  ];

  return (
    <div style={styles.sidebar}>

      <div>

        <div style={styles.logoArea}>

          <div style={styles.logoCircle}>
            📄
          </div>

          <div>

            <div style={styles.logoTitle}>
              Contract
            </div>

            <div style={styles.logoSub}>
              Obligation Tracking
            </div>

          </div>

        </div>

        <div style={{ marginTop: 35 }}>

          {menu.map((item, index) => (

            <div
              key={index}
              style={{
                ...styles.menuItem,
                background: item.active ? "#6C4CFF" : "transparent"
              }}
            >

              <span style={styles.icon}>
                {item.icon}
              </span>

              {item.text}

            </div>

          ))}

        </div>

      </div>

      <div>

        

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

        </div>

      </div>

    </div>
  );
}
const styles = {

  sidebar: {
  width: 280,
  background: "#5f27cd",   // Exact dark navy-purple
  minHeight: "100vh",
  padding: 25,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRight: "1px solid #2A1E63",
  boxSizing: "border-box"
},

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: 15
  },

  logoCircle: {
    width: 55,
    height: 55,
    borderRadius: 16,
    background: "#6C4CFF",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24
  },

  logoTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#FFFFFF"
},

  logoSub: {
  fontSize: 12,
  color: "#C8C4F5"
},
 menuItem: {
  display: "flex",
  alignItems: "center",
  gap: 15,
  padding: "14px 18px",
  marginBottom: 10,
  borderRadius: 12,
  color: "#FFFFFF",
  fontWeight: "500",
  cursor: "pointer",
  transition: "0.3s"
},

  icon: {
    fontSize: 18,
    width: 22
  },

  

 

  profile: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    paddingTop: 15,
    borderTop: "1px solid #E5E5E5"
  },

  image: {
    width: 48,
    height: 48,
    borderRadius: "50%"
  },

  name: {
    fontWeight: "600",
    color: "#222"
  },

  role: {
    fontSize: 13,
    color: "#777"
  }



  



};

export default Sidebar;