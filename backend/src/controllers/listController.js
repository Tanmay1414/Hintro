const List = require("../models/List");
const Board = require("../models/Board");

exports.createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;

    // Check board exists
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Check membership
    if (!board.members.includes(req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const listCount = await List.countDocuments({ boardId });

    const list = await List.create({
      title,
      boardId,
      order: listCount,
    });

    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getListsByBoard = async (req, res) => {
  try {
    const lists = await List.find({ boardId: req.params.boardId }).sort({
      order: 1,
    });

    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: "List not found" });

    // Delete all tasks in this list
    const Task = require("../models/Task");
    await Task.deleteMany({ listId: list._id });

    await list.deleteOne();
    res.json({ message: "List and its tasks deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
