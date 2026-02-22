import React from "react";
import "./SettingsContents.css";

const SettingsContents = () => {
  return (
    <div className="settings-page-content">
      {/* Account Section */}
      <section className="section">
        <h2>Account</h2>

        <div className="card">
          <div className="card-text">
            <h3>Profile</h3>
            <p>View and edit your profile</p>
          </div>
          <i className="fas fa-chevron-right arrow"></i>
        </div>

        <div className="card">
          <div className="card-text">
            <h3>Change Password</h3>
            <p>Update your account password</p>
          </div>
          <i className="fas fa-chevron-right arrow"></i>
        </div>

        <div className="card logout-card">
          <div className="card-text">
            <h3>Log Out</h3>
            <p>Sign out of your account</p>
          </div>
          <i className="fas fa-sign-out-alt arrow"></i>
        </div>

        <div className="card">
          <div className="card-text">
            <h3>Delete Account</h3>
            <p>Remove your account permanently</p>
          </div>
          <i className="fas fa-chevron-right arrow"></i>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="section">
        <h2>Preferences</h2>

        <div className="card toggle-card">
          <div className="card-text">
            <h3>Dark Mode</h3>
            <p>Enable / Disable dark theme</p>
          </div>
          <label className="switch">
            <input type="checkbox" id="darkModeToggle" checked />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="card toggle-card">
          <div className="card-text">
            <h3>Notifications</h3>
            <p>Enable / Disable notifications</p>
          </div>
          <label className="switch">
            <input type="checkbox" id="notifToggle" checked />
            <span className="slider round"></span>
          </label>
        </div>
      </section>
    </div>
  );
};

export default SettingsContents;
