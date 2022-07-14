const express = require("express");
const {
  getAllTransaction,
  getDetailTransaction,
  addNewTransaction,
  updateTransaction,
} = require("../controller/transaction.controller");
const { auth, adminAuth } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", getAllTransaction);
router.get("/:id", getDetailTransaction);

router.post("/", auth, adminAuth, addNewTransaction);

router.patch("/:id", auth, adminAuth, updateTransaction);

module.exports = router;
