const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("../controllers/authController");

// Auth Routes
router.post("/register", registerAdmin); // Optional
router.post("/login", loginAdmin);

module.exports = router;
