import { useEffect, useState } from "react";
import useBoardStore from "../store/boardStore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Modal from "../components/ui/Modal";

export default function Dashboard() {
  const { boards, fetchBoards, createBoard, loading } = useBoardStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    setCreating(true);
    try {
      const board = await createBoard(newBoardTitle.trim());
      setNewBoardTitle("");
      setShowModal(false);
      navigate(`/board/${board._id}`);
    } catch (error) {
      console.error("Create board error:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight">
              Your Boards
            </h1>

            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              + New Board
            </button>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : boards.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
              <h2 className="text-xl mb-3">No boards yet</h2>
              <p className="text-gray-400 mb-6">
                Create your first board to start collaborating.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                + Create Board
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boards.map((board) => (
                <div
                  key={board._id}
                  onClick={() => navigate(`/board/${board._id}`)}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer backdrop-blur-lg glow-hover transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Board cover */}
                  <div
                    className="h-28"
                    style={
                      board.coverImage
                        ? {
                            backgroundImage: `url(${board.coverImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : board.coverColor
                          ? { backgroundColor: board.coverColor }
                          : {
                              background:
                                "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                            }
                    }
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="bg-white/5 border border-white/10 border-t-0 p-4 rounded-b-2xl">
                    <h2 className="text-lg font-semibold mb-1 truncate">
                      {board.title}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Created {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setNewBoardTitle("");
        }}
        title="Create New Board"
      >
        <form onSubmit={handleCreateBoard} className="space-y-4">
          <input
            type="text"
            placeholder="Board title"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newBoardTitle.trim() || creating}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
