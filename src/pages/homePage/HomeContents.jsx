import React from "react";
import "./HomeContents.css";
import { useUser } from "../../context/UserContext";

const HomeContents = () => {
  const { user } = useUser();

  return (
    <div className="phone">
      {/* Greeting */}
      <section className="greeting">
        <h1>
          Good afternoon,{" "}
          {user?.user_metadata?.full_name ||
            user?.user_metadata?.name ||
            user?.user_metadata?.preferred_username ||
            "User"}{" "}
          👋
        </h1>
        <p>Here's what's happening today</p>
      </section>

      {/* Cards */}
      <section className="cards">
        <div className="card">
          <div className="card-icon blue">
            <i className="fas fa-bullhorn"></i>
          </div>
          <div className="card-text">
            <h3>Announcements</h3>
            <p>Latest updates from your teams</p>
          </div>
          <i className="fas fa-chevron-right arrow"></i>
        </div>

        <div className="card">
          <div className="card-icon green">
            <i className="fas fa-list"></i>
          </div>
          <div className="card-text">
            <h3>Task List</h3>
            <p>View and manage your tasks</p>
          </div>
          <i className="fas fa-chevron-right arrow"></i>
        </div>

        <div className="card">
          <div className="card-icon purple">
            <i className="fas fa-calendar"></i>
          </div>
          <div className="card-text">
            <h3>Upcoming Events</h3>
            <p>Meetings and scheduled activities</p>
          </div>
          <i className="fas fa-chevron-right arrow"></i>
        </div>
      </section>
    </div>
  );
};

export default HomeContents;
