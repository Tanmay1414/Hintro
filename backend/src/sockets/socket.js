module.exports = function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🔥 Join board room
    socket.on("joinBoard", (boardId) => {
      socket.join(boardId);
      console.log(`Socket ${socket.id} joined board ${boardId}`);
    });

    // 🔥 Leave board room
    socket.on("leaveBoard", (boardId) => {
      socket.leave(boardId);
      console.log(`Socket ${socket.id} left board ${boardId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
