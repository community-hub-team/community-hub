import React from "react";
import "./TeamCard.css";

const TeamCard = ({ name, members }) => {
  return (
    <div className="team-card">
      <div className="card-icon blue">
        <i className="fas fa-users"></i>
      </div>
      <div className="card-text">
        <h3>{name}</h3>
        <p>{members} members</p>
      </div>
      <i className="fas fa-chevron-right arrow"></i>
    </div>
  );
};

export default TeamCard;
