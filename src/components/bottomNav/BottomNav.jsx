import React from "react";
import "./BottomNav.css";
import { useLocation, useNavigate } from "react-router-dom"; // If using React Router

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", icon: "fas fa-home", path: "/" },
    { name: "Tasks", icon: "fas fa-list", path: "/tasks" },
    { name: "Teams", icon: "fas fa-users", path: "/teams" },
    { name: "Settings", icon: "fas fa-gear", path: "/settings" },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <div
          key={item.name}
          className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <i className={item.icon}></i>
          <span>{item.name}</span>
        </div>
      ))}
    </nav>
  );
};

export default BottomNav;
