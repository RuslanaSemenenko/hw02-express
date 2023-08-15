const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { HttpError } = require("../helpers/HttpErrors");
const gravatar = require("gravatar");
const { registrationSchema } = require("../schemas/validationSchemas");
const crypto = require("crypto");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.ELASTICEMAIL_API_KEY);

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

    const verificationToken = crypto.randomBytes(16).toString("hex");
    const newUser = new User({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });
    await newUser.save();

    await sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

const sendVerificationEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: "katotochkaaa@gmail.com",
    subject: "Email Verification",
    text: `To verify your email, click this link: ${process.env.BASE_URL}/users/verify/${verificationToken}`,
    html: `<p>To verify your email, click <a href="${process.env.BASE_URL}/users/verify/${verificationToken}">this link</a>.</p>`,
  };

  await sgMail.send(msg);
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  resendVerificationEmail,
};
