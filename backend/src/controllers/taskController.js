const Task = require("../models/Task");
const List = require("../models/List");
const Activity = require("../models/Activity");

exports.createTask = async (req, res) => {
  try {
    const { title, description, listId } = req.body;

    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const taskCount = await Task.countDocuments({ listId });

    const task = await Task.create({
      title,
      description,
      listId,
      boardId: list.boardId,
      order: taskCount,
    });

    // 🔥 Emit real-time event
    const io = req.app.get("io");
    io.to(list.boardId.toString()).emit("taskCreated", task);

    // Log activity
    await Activity.create({
      boardId: list.boardId,
      message: `Task "${task.title}" created`,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasksByList = async (req, res) => {
  try {
    const tasks = await Task.find({ listId: req.params.listId })
      .sort({ order: 1 })
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const wasMoved = "listId" in req.body || "order" in req.body;
    Object.assign(task, req.body);
    await task.save();

    // Log activity when task is moved
    if (wasMoved) {
      await Activity.create({
        boardId: task.boardId,
        message: `Task "${task.title}" moved`,
      });
    }

    // 🔥 Emit real-time update
    const io = req.app.get("io");
    io.to(task.boardId.toString()).emit("taskUpdated", task);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const taskTitle = task.title;
    const boardId = task.boardId;
    const taskId = task._id;

    await task.deleteOne();

    // Log activity
    await Activity.create({
      boardId,
      message: `Task "${taskTitle}" deleted`,
    });

    // 🔥 Emit real-time delete
    const io = req.app.get("io");
    io.to(boardId.toString()).emit("taskDeleted", taskId);

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
