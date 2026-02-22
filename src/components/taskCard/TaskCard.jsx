import "./TaskCard.css";

function TaskCard({ title, due, createdAt, priority, onClick }) {
  const priorityColors = {
    Low: "purple",
    Medium: "green",
    High: "red",
  };

  const colorClass = priorityColors[priority] || "";

  return (
    <div className="task-card" onClick={onClick}>
      <div className={`task-icon ${colorClass}`}>
        <i className="fas fa-tasks"></i>
      </div>

      <div className="task-text">
        <h3>{title}</h3>
        <p>Created: {createdAt}</p>
        <p>Due: {due}</p>
      </div>

      <i className="fas fa-chevron-right arrow"></i>
    </div>
  );
}

export default TaskCard;
