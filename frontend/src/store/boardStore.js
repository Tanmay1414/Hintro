import { create } from "zustand";
import api from "../services/api";

const useBoardStore = create((set, get) => ({
  boards: [],
  loading: false,

  fetchBoards: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/boards");
      set({ boards: res.data, loading: false });
    } catch (error) {
      console.error("Fetch boards error:", error);
      set({ loading: false });
    }
  },

  createBoard: async (title) => {
    const res = await api.post("/boards", { title });
    set({ boards: [res.data, ...get().boards] });
    return res.data;
  },
}));

export default useBoardStore;
