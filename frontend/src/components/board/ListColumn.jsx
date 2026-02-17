import { useState } from "react";
import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";
import api from "../../services/api";

export default function ListColumn({ list, tasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Delete list handler
  const handleDeleteList = async () => {
    if (!window.confirm(`Delete list "${list.title}" and all its tasks?`))
      return;
    setDeleting(true);
    try {
      await api.delete(`/lists/${list._id}`);
      // Optionally: trigger parent to refresh lists
      if (typeof window.refreshLists === "function") window.refreshLists();
    } catch (error) {
      alert("Failed to delete list.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateTask = async () => {
    if (!title.trim()) return;

    await api.post("/tasks", {
      title,
      description,
      listId: list._id,
    });

    setTitle("");
    setDescription("");
  };

  return (
    <Droppable droppableId={list._id}>
      {(provided) => (
        <div
          className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-2xl w-72 shrink-0 shadow-xl hover:bg-white/10 transition-all duration-300"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2 className="font-semibold mb-4 flex justify-between items-center">
            <span>{list.title}</span>
            <div className="flex items-center gap-2">
              <span className="bg-gray-600 text-xs px-2 py-1 rounded">
                {tasks.length}
              </span>
              <button
                onClick={handleDeleteList}
                disabled={deleting}
                title="Delete list"
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded disabled:opacity-40"
              >
                🗑
              </button>
            </div>
          </h2>

          {/* TASK LIST */}
          <div className="space-y-3 mb-4">
            {tasks.length === 0 && (
              <p className="text-gray-400 text-sm">No tasks</p>
            )}

            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}

            {provided.placeholder}
          </div>

          {/* ADD TASK FORM */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-sm"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-sm"
            />
            <button
              onClick={handleCreateTask}
              className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-sm"
            >
              Add Task
            </button>
          </div>
        </div>
      )}
    </Droppable>
  );
}
