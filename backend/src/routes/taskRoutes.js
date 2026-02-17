const router = require("express").Router();
const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  getTasksByList,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Protect all routes
router.use(protect);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/list/:listId", getTasksByList);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
