import React from "react";
import "./TopNavSettings.css";
import { FaBell } from "react-icons/fa";

const TopNavSettings = () => {
  return (
    <header className="topbr">
      <h1>Settings</h1>
      <div className="top-icons">
        <i className="fa-regular fa-bell"></i>
      </div>
    </header>
  );
};

export default TopNavSettings;
