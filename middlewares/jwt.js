const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "marvtheGOAT";

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { generateToken, authMiddleware };
