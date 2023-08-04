const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers/HttpErrors");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Not authorized");
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, "your-secret-key");
    req.user = payload;
    next();
  } catch (error) {
    throw new HttpError(401, "Not authorized");
  }
};

module.exports = { verifyToken };
