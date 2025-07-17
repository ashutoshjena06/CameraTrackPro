const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("../controllers/authController");

// Auth Routes
console.log("Auth routes loaded");

router.post("/register", registerAdmin); // Optional
router.post("/login", loginAdmin);
router.get("/test", (req, res) => {
  res.send("Auth route working ✅");
});

module.exports = router;
