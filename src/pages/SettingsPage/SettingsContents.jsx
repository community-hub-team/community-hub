import React, { useState, useEffect } from "react";
import "./SettingsContents.css";
import { useTheme } from '../../context/ThemeContext.jsx'
const SettingsContents = () => {
  const { isDark, toggleTheme } = useTheme()
 /* const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // Default to dark as per your CSS
  });

/*  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDark]);*/

  //const toggleTheme = () => setIsDark(!isDark);
  
  return (
    <div className="settings-page-content">
      {/* Account Section */}
      <section className="section">
        <h2>Account</h2>

        <div className="Card">
          <div className="Card-text">
            <h3>Profile</h3>
            <p>View and edit your profile</p>
          </div>
          <i className="fas fa-chevron-right arrow"></i>
        </div>

        <div className="Card">
          <div className="Card-text">
            <h3>Change Password</h3>
            <p>Update your account password</p>
          </div>
          <i className="fas fa-chevron-right arrow"></i>
        </div>

        <div className="Card logout-Card">
          <div className="Card-text">
            <h3>Log Out</h3>
            <p>Sign out of your account</p>
          </div>
          <i className="fas fa-sign-out-alt arrow"></i>
        </div>

        <div className="Card">
          <div className="Card-text">
            <h3>Delete Account</h3>
            <p>Remove your account permanently</p>
          </div>
          <i className="fas fa-chevron-right arrow"></i>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="section">
        <h2>Preferences</h2>

        <div className="Card toggle-Card">
          <div className="Card-text">
            <h3>Dark Mode</h3>
            <p>Enable / Disable dark theme</p>
          </div>
          <label className="switch">
            <input
                type="checkbox"
                id="darkModeToggle"
                checked={isDark}
                onChange={toggleTheme}
              />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="Card toggle-Card">
          <div className="Card-text">
            <h3>Notifications</h3>
            <p>Enable / Disable notifications</p>
          </div>
          <label className="switch">
            <input type="checkbox" id="notifToggle" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      </section>
    </div>
  );
};

export default SettingsContents;
