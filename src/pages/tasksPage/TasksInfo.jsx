import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./TasksInfo.css";

function TaskInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    const tasks = saved ? JSON.parse(saved) : [];
    const foundTask = tasks.find((t) => String(t.id) === id);

    if (!foundTask) {
      navigate("/tasks");
    } else {
      setTask(foundTask);
    }
  }, [id, navigate]);

  if (!task) return null;

  const priorityColors = {
    Low: "purple",
    Medium: "green",
    High: "red",
  };

  const colorClass = priorityColors[task.priority] || "";

  return (
    <div className="phone">
      <header className="topbar">
        <div className="back-btn" onClick={() => navigate("/tasks")}>
          <i className="fas fa-arrow-left"></i>
        </div>
        <h1>{task.title}</h1>
      </header>

      <section className="hero-card">
        <div className={`hero-icon ${colorClass}`}>
          <i className="fas fa-tasks"></i>
        </div>

        <p>Created at: {task.createdAt}</p>
        <p className="due">Due: {task.due}</p>
      </section>

      <section className="details">
        <h3>Community:</h3>
        <p>{task.community}</p>

        <h3>Description:</h3>
        {task.description.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}

        <h3>Priority:</h3>
        <div className={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </div>
      </section>

      <button className="complete-btn">Mark as Completed</button>
    </div>
  );
}

export default TaskInfo;
