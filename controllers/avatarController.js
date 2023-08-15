const fs = require("fs").promises;
const Jimp = require("jimp");
const path = require("path");
const User = require("../../models/user");

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
  uploadAvatar,
};
