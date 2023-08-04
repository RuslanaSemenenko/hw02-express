const express = require("express");
const {
  loginUser,
  logoutUser,
  getCurrentUser,
} = require("../controllers/auth");
const authMiddleware = require("../controllers/auth");
const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/current", authMiddleware, getCurrentUser);

module.exports = router;
