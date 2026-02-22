import React from "react";
import "./TopNavHome.css";
import { useUser } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const TopNavHome = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const avatarUrl =
    user?.user_metadata?.avatar_url || "https://i.pravatar.cc/100";

  return (
    <header className="topbar">
      <div>
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar"
          onClick={() => navigate("/profile")}
        />
      </div>

      <div className="bell">
        <i className="fa-regular fa-bell"></i>
      </div>
    </header>
  );
};

export default TopNavHome;
