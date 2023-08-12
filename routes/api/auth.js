const express = require("express");
const {
  loginUser,
  logoutUser,
  getCurrentUser,
} = require("../controllers/auth");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", authMiddleware.verifyToken, logoutUser);
router.get("/current", authMiddleware.verifyToken, getCurrentUser);

module.exports = router;
