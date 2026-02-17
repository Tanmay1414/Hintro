import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../socket/socket";
import ListColumn from "./ListColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import Modal from "../ui/Modal";
import Navbar from "../layout/Navbar";
import { COVER_COLORS, COVER_IMAGES } from "../../constants/boardCovers";

export default function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [activities, setActivities] = useState([]);
  const [clearActivityModalOpen, setClearActivityModalOpen] = useState(false);
  const [coverModalOpen, setCoverModalOpen] = useState(false);

  useEffect(() => {
    fetchBoard();
    fetchLists();
    fetchTasks();
    fetchActivities();

    // 🔥 Join board room
    socket.emit("joinBoard", id);

    // 🔥 Listen for real-time events
    socket.on("taskCreated", (newTask) => {
      setTasks((prev) => [...prev, newTask]);
      fetchActivities();
    });

    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
      );
      fetchActivities();
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      fetchActivities();
    });

    return () => {
      socket.emit("leaveBoard", id);
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [id]);

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/boards/${id}`);
      setBoard(res.data);
    } catch {
      setBoard(null);
    }
  };

  const fetchLists = async () => {
    const res = await api.get(`/lists/${id}`);
    setLists(res.data);
  };

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    const boardTasks = res.data.filter((task) => task.boardId === id);
    setTasks(boardTasks);
  };

  const fetchActivities = async () => {
    try {
      const res = await api.get(`/activities/${id}`);
      setActivities(res.data);
    } catch {
      setActivities([]);
    }
  };

  const handleClearActivities = async () => {
    await api.delete(`/activities/${id}`);
    setActivities([]);
    setClearActivityModalOpen(false);
  };

  const handleUpdateCover = async (coverImage, coverColor) => {
    await api.put(`/boards/${id}`, {
      coverImage: coverImage ?? null,
      coverColor: coverColor ?? null,
    });
    setBoard((prev) => ({
      ...prev,
      coverImage: coverImage ?? null,
      coverColor: coverColor ?? null,
    }));
    setCoverModalOpen(false);
  };

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;

    await api.post("/lists", {
      title: newListTitle,
      boardId: id,
    });

    setNewListTitle("");
    fetchLists();
  };

  // 🔥 DRAG HANDLER
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(
      (task) => task._id === draggableId,
    );

    const task = updatedTasks[taskIndex];

    if (source.droppableId === destination.droppableId) {
      // Same list: reorder
      const listTasks = updatedTasks
        .filter((t) => t.listId === source.droppableId)
        .sort((a, b) => a.order - b.order);
      const [removed] = listTasks.splice(source.index, 1);
      listTasks.splice(destination.index, 0, removed);
      listTasks.forEach((t, i) => (t.order = i));
    } else {
      // Different list
      task.listId = destination.droppableId;
      task.order = destination.index;
    }

    setTasks(updatedTasks);

    // 🔥 Update backend
    await api.put(`/tasks/${draggableId}`, {
      listId: task.listId,
      order: task.order,
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen animated-bg text-white p-8">
        {/* Board Cover */}
        <div
          className="relative h-32 md:h-40 overflow-hidden rounded-2xl mb-8"
          style={
            board?.coverImage
              ? {
                  backgroundImage: `url(${board.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : board?.coverColor
                ? { backgroundColor: board.coverColor }
                : {
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  }
          }
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full flex items-end p-6 md:p-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">
                {board?.title || "Collaborative Board"}
              </h1>
              <button
                onClick={() => setCoverModalOpen(true)}
                className="text-sm text-white/80 hover:text-white px-2 py-1 rounded hover:bg-white/20 transition"
              >
                Change cover
              </button>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto">
            {lists.map((list) => (
              <ListColumn
                key={list._id}
                list={list}
                tasks={tasks
                  .filter((task) => task.listId === list._id)
                  .sort((a, b) => a.order - b.order)}
                refreshLists={fetchLists}
              />
            ))}

            {/* Add List */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-2xl w-72 shrink-0 shadow-lg hover:bg-white/10 transition">
              <input
                type="text"
                placeholder="New list title"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-sm mb-2"
              />
              <button
                onClick={handleCreateList}
                className="w-full bg-green-600 hover:bg-green-700 p-2 rounded text-sm"
              >
                Add List
              </button>
            </div>

            {/* Activity Panel */}
            <div className="w-72 backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0 shadow-xl hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Activity</h2>
                <button
                  onClick={() => setClearActivityModalOpen(true)}
                  disabled={activities.length === 0}
                  className="text-xs text-red-400 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-sm text-gray-400">No activity yet</p>
                ) : (
                  activities.map((a) => (
                    <p key={a._id} className="text-sm text-gray-400">
                      {a.message}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>

      <Modal
        isOpen={coverModalOpen}
        onClose={() => setCoverModalOpen(false)}
        title="Change board cover"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Colors</p>
          <div className="flex flex-wrap gap-2">
            {COVER_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleUpdateCover(null, color)}
                className="w-12 h-12 rounded-lg shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4">Photos</p>
          <div className="grid grid-cols-4 gap-2">
            {COVER_IMAGES.map((url) => (
              <button
                key={url}
                onClick={() => handleUpdateCover(url, null)}
                className="aspect-video rounded-lg overflow-hidden hover:ring-2 ring-white/50 transition"
              >
                <img
                  src={url}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <button
            onClick={() => handleUpdateCover(null, null)}
            className="text-sm text-gray-400 hover:text-white"
          >
            Remove cover
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={clearActivityModalOpen}
        onClose={() => setClearActivityModalOpen(false)}
        title="Clear Activity"
      >
        <p className="text-gray-300 mb-4">
          Remove all activity from this board? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setClearActivityModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleClearActivities}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Clear All
          </button>
        </div>
      </Modal>
    </>
  );
}
