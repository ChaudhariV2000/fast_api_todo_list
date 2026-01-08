import { useEffect, useState } from "react";
import API from "./api";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    API.get("/tasks").then(res => setTasks(res.data));
  };

  const submitTask = () => {
    if (!title) return;

    const payload = { title, description };

    if (editingId) {
      API.put(`/tasks/${editingId}`, payload).then(fetchTasks);
    } else {
      API.post("/tasks", payload).then(fetchTasks);
    }

    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
  };

  const deleteTask = (id) => {
    API.delete(`/tasks/${id}`).then(fetchTasks);
  };

  return (
    <div className="container">
      <h2>📝 Task Manager</h2>

      <input
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button onClick={submitTask}>
        {editingId ? "Update Task" : "Add Task"}
      </button>

      <hr style={{ margin: "20px 0" }} />

      <AnimatePresence>
        {tasks.map(task => (
          <motion.div
            key={task.id}
            className="task-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="task-title"
              onClick={() =>
                setExpandedId(expandedId === task.id ? null : task.id)
              }
            >
              {task.title}
            </div>

            <AnimatePresence>
              {expandedId === task.id && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: "#555" }}
                >
                  {task.description || "No description"}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="task-actions">
              <button className="secondary" onClick={() => editTask(task)}>
                ✏️ Edit
              </button>
              <button className="danger" onClick={() => deleteTask(task.id)}>
                ❌ Delete
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default App;
