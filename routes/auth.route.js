const express = require("express");
const passport = require("passport");
const { generateToken } = require("../middlewares/jwt");
const User = require("../models/user.models");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login route using Passport.js
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    res.status(200).json({ token });
  }
);

// Logout route
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
