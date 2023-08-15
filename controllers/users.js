const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { HttpError } = require("../helpers/HttpErrors");
const gravatar = require("gravatar");
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

module.exports = {
  registerUser,
};
