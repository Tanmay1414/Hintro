import { Draggable } from "@hello-pangea/dnd";
import api from "../../services/api";

export default function TaskCard({ task, index }) {
  const handleDelete = async () => {
    await api.delete(`/tasks/${task._id}`);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-200 relative"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="absolute top-2 right-2 text-red-400 text-xs hover:text-red-300"
          >
            ✕
          </button>

          <h3 className="font-semibold text-sm tracking-wide">{task.title}</h3>
          <p className="text-xs text-gray-300 mt-1">{task.description}</p>

          <button
            onClick={async (e) => {
              e.stopPropagation();
              await api.put(`/tasks/${task._id}`, {
                assignedTo: [JSON.parse(localStorage.getItem("user"))?._id],
              });
            }}
            className="mt-2 text-xs bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
          >
            Assign to Me
          </button>
        </div>
      )}
    </Draggable>
  );
}
