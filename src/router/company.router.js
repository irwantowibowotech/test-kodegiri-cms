const express = require("express");
const {
  getAllCompany,
  getDetailCompany,
  addNewCompany,
  updateCompany,
  deleteCompany,
} = require("../controller/company.controller");
const { auth, adminAuth } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", getAllCompany);
router.get("/:id", getDetailCompany);

router.post("/", auth, adminAuth, addNewCompany);

router.patch("/:id", auth, adminAuth, updateCompany);

router.delete("/:id", auth, adminAuth, deleteCompany);

module.exports = router;
