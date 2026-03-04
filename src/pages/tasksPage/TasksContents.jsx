import "./TasksContents.css";
import TaskCard from "../../components/taskCard/TaskCard";

function TasksContents({ tasks, onTaskClick }) {
  return (
    <div className=" phone">
      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} {...task} onClick={() => onTaskClick(task)} />
        ))
      )}
    </div>
  );
}

export default TasksContents;
