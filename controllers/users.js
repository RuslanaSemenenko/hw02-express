const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { HttpError } = require("../helpers/HttpErrors");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const { registrationSchema } = require("../schemas/validationSchemas");

const registerUser = async (req, res, next) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email, { s: "250", d: "mm" });

    const newUser = new User({
      email,
      password: hashedPassword,
      avatarURL,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const avatarFile = req.file;

    const image = await Jimp.read(avatarFile.path);
    await image.resize(250, 250).write(avatarFile.path);

    const newFileName = path.basename(avatarFile.path);
    const newFilePath = path.join("public/avatars", newFileName);
    await fs.rename(avatarFile.path, newFilePath);

    const user = await User.findById(req.user.id);
    user.avatarURL = `/avatars/${newFileName}`;
    await user.save();

    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  uploadAvatar,
};
