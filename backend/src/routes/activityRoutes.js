const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {
  getActivitiesByBoard,
  clearActivitiesByBoard,
} = require("../controllers/activityController");

router.use(protect);

router.get("/:boardId", getActivitiesByBoard);
router.delete("/:boardId", clearActivitiesByBoard);

module.exports = router;
