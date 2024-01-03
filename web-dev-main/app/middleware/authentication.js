const jwt = require("jsonwebtoken");
const { unauthorized } = require("../constants/statusCodes");
const logger = require("./winston");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization"); // format: 'Bearer <token>'

  if (!token) {
    return res.status(unauthorized).json({ message: "Unauthorized" });
  }

  // here we verify the validity of our token
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    logger.error(error);
    return res.status(unauthorized).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
