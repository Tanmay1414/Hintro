const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");
//const router = require("express").Router();
// ...add board routes here later
module.exports = router;
router.use(authMiddleware);

router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoardById);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

module.exports = router;
