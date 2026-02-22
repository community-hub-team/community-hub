import React from "react";
import "./TopNavSettings.css";
import { FaBell } from "react-icons/fa";

const TopNavSettings = () => {
  return (
    <header className="topbar">
      <h1>Settings</h1>
      <div className="top-icons">
        <FaBell />
      </div>
    </header>
  );
};

export default TopNavSettings;
