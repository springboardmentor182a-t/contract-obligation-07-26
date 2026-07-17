import "./Sidebar.css";
import {
  MdDashboard,
  MdDescription,
  MdAutorenew,
  MdAssignment,
  MdBarChart,
  MdSettings,
  MdLogout,
} from "react-icons/md";

const Sidebar = () => {
  const menuItems = [
    { icon: <MdDashboard />, name: "Dashboard", active: false },
    { icon: <MdDescription />, name: "Contracts", active: false },
    { icon: <MdAutorenew />, name: "Renewals", active: true },
    { icon: <MdAssignment />, name: "Obligations", active: false },
    { icon: <MdBarChart />, name: "Reports", active: false },
    { icon: <MdSettings />, name: "Settings", active: false },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">CI</div>
        <div>
          <h2>ContractIQ</h2>
          <p>Compliance Platform</p>
        </div>
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`menu-item ${item.active ? "active" : ""}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </nav>

      <div className="logout">
        <MdLogout />
        <span>Logout</span>
      </div>
    </aside>
  );
};

export default Sidebar;