const errorHandler = (error, req, res, next) => {
  if (error.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid or missing token" });
  }
  if (error.name === "ValidationError") {
    return res.status(401).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
};

module.exports = errorHandler;
