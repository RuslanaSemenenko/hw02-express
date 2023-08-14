const express = require("express");
const {
  loginUser,
  logoutUser,
  getCurrentUser,
} = require("../../controllers/auth");
const authMiddleware = require("../../middleware/authMiddleware");

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/logout", authMiddleware.verifyToken, logoutUser);
authRouter.get("/current", authMiddleware.verifyToken, getCurrentUser);

module.exports = authRouter;
