const Board = require("../models/Board");

exports.createBoard = async (req, res) => {
  try {
    const { title } = req.body;

    const board = await Board.create({
      title,
      owner: req.user,
      members: [req.user],
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user }, { members: req.user }],
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate(
      "members",
      "name email",
    );

    if (!board) return res.status(404).json({ message: "Board not found" });

    // Check if user is member
    if (!board.members.some((m) => m._id.toString() === req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) return res.status(404).json({ message: "Board not found" });

    if (board.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Only owner can update board" });
    }

    if (req.body.title !== undefined) board.title = req.body.title;
    if (req.body.coverImage !== undefined) board.coverImage = req.body.coverImage || null;
    if (req.body.coverColor !== undefined) board.coverColor = req.body.coverColor || null;
    await board.save();

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) return res.status(404).json({ message: "Board not found" });

    if (board.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Only owner can delete board" });
    }

    await board.deleteOne();

    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
