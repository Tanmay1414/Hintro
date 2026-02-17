const Activity = require("../models/Activity");

exports.getActivitiesByBoard = async (req, res) => {
  try {
    const activities = await Activity.find({ boardId: req.params.boardId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearActivitiesByBoard = async (req, res) => {
  try {
    await Activity.deleteMany({ boardId: req.params.boardId });
    res.json({ message: "Activity list cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
