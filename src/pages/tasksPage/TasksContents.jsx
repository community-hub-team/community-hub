import "./TasksContents.css";
import TaskCard from "../../components/TaskCard/TaskCard";

function TasksContents({ tasks, onTaskClick }) {
  return (
    <div className="tasks-cards">
      {tasks.length === 0 ? (
        <p style={{ color: "#9aa4b2", textAlign: "center" }}>No tasks yet</p>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} {...task} onClick={() => onTaskClick(task)} />
        ))
      )}
    </div>
  );
}

export default TasksContents;
