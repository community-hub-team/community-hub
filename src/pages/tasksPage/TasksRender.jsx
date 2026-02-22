import { useState, useEffect } from "react";
import "./TasksInfo.css";
import { useNavigate } from "react-router-dom";
import TopNavTasks from "./TopNavTasks";
import TasksContents from "./TasksContents";
import BottomNav from "../../components/bottomNav/BottomNav";

function TasksRender() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [showModal, setShowModal] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [dueError, setDueError] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [dueInput, setDueInput] = useState("");

  const navigate = useNavigate();

  const createTask = () => {
    const createdAt = new Date();
    const dueDate = dueInput ? new Date(dueInput) : null;

    if (dueDate && dueDate < createdAt) {
      setDueError("Due date cannot be earlier than created date.");
      return;
    }

    const formattedCreated = createdAt.toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const formattedDue = dueDate
      ? dueDate.toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Not set";

    const newTask = {
      id: Date.now(),
      title: titleInput.trim() || "Not set",
      description: descInput.trim() || "Empty",
      priority,
      createdAt: formattedCreated,
      due: formattedDue,
      community: "Xalteam@CommunityHub",
    };

    setTasks((prev) => [...prev, newTask]);

    setTitleInput("");
    setDescInput("");
    setDueInput("");
    setPriority("Medium");
    setShowModal(false);
  };

  return (
    <div className="tasks-wrapper">
      <TopNavTasks onAddClick={() => setShowModal(true)} />

      <TasksContents
        tasks={tasks}
        onTaskClick={(task) => navigate(`/tasks/${task.id}`)}
      />

      {showModal && (
        <div className="overlay">
          <div className="modal">
            <h2>Create Task</h2>

            <input
              placeholder="Task title"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />

            <textarea
              placeholder="Description"
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input
              type="datetime-local"
              value={dueInput}
              onChange={(e) => {
                setDueInput(e.target.value);
                setDueError("");
              }}
            />

            {dueError && <p style={{ color: "red" }}>{dueError}</p>}

            <button onClick={() => setShowModal(false)}>Cancel</button>
            <button onClick={createTask}>Create</button>
          </div>
        </div>
      )}
      <BottomNav active="tasks" />
    </div>
  );
}

export default TasksRender;
