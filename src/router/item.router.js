const express = require("express");
const {
  getAllItem,
  getDetailItem,
  addNewItem,
  updateItem,
  deleteItem,
} = require("../controller/item.controller");
const { auth, adminAuth } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", getAllItem);
router.get("/:id", getDetailItem);

router.post("/", auth, adminAuth, addNewItem);

router.patch("/:id", auth, adminAuth, updateItem);

router.delete("/:id", auth, adminAuth, deleteItem);

module.exports = router;
