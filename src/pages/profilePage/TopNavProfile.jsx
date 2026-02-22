import React from "react";
import "./TopNavProfile.css";
import { useNavigate } from "react-router-dom";

function TopNavProfile() {
  const navigate = useNavigate();
  function goBack() {
    navigate(-1);
  }
  return (
    <header className="top-nav">
      <p className="back-btn" onClick={goBack}>
        <i className="fas fa-arrow-left"></i>
      </p>
      <h1>Profile</h1>
      <div className="top-icons">
        <i className="fa-regular fa-bell"></i>
      </div>
    </header>
  );
}

export default TopNavProfile;
