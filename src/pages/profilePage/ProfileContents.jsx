import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import "./ProfileContents.css";

const ProfileContents = () => {
  const [user, setUser] = useState(null);

  // Fetch current logged-in user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUser(user);
    };
    fetchUser();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return alert(error.message);
    window.location.href = "/login"; // redirect to login page
  };

  // Delete account handler
  const handleDelete = async () => {
    if (!user) return;
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );
    if (!confirm) return;

    const { error } = await supabase.auth.admin.deleteUser(user.id);
    // Note: Supabase admin API is required for deleteUser
    if (error) return alert(error.message);

    alert("Account deleted successfully.");
    window.location.href = "/signup";
  };

  if (!user) {
    return <p>Loading user info...</p>;
  }

  return (
    <div className="page-content">
      {/* User Info */}
      <section className="user-info">
        <img
          src={user.user_metadata?.avatar_url || "https://i.pravatar.cc/100"}
          alt="User Avatar"
          className="avatar"
        />
        <h2 id="username">{user.user_metadata?.full_name || user.email}</h2>
        <p id="email">{user.email}</p>
      </section>

      {/* Account Actions */}
      <section className="account-actions">
        <button onClick={handleLogout} className="action-btn">
          <i className="fas fa-right-from-bracket"></i> Log Out
        </button>
        <button onClick={handleDelete} className="action-btn delete">
          <i className="fas fa-trash"></i> Delete Account
        </button>
      </section>

      {/* Security Settings */}
      <section className="security-settings">
        <h3>Security</h3>
        <button className="action-btn">
          <i className="fas fa-lock"></i> Change Password
        </button>
        <button className="action-btn">
          <i className="fas fa-shield-alt"></i> Enable 2FA
        </button>
      </section>

      {/* Discord Servers List */}
      <section className="discord-servers">
        <h3>Discord Servers</h3>
        <ul id="serversList">
          <li>
            <i className="fab fa-discord"></i> Server 1
          </li>
          <li>
            <i className="fab fa-discord"></i> Server 2
          </li>
          <li>
            <i className="fab fa-discord"></i> Server 3
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ProfileContents;
