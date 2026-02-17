const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createList,
  getListsByBoard,
  deleteList,
} = require("../controllers/listController");

router.use(authMiddleware);

router.post("/", createList);
router.get("/:boardId", getListsByBoard);
router.delete("/:id", deleteList);

module.exports = router;
