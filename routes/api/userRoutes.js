const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const userController = require("../controllers/users");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

const upload = multer({ storage });

router.post("/register", userController.registerUser);
router.patch("/avatars", upload.single("avatar"), userController.uploadAvatar);
router.post("/verify", userController.resendVerificationEmail);

module.exports = router;
