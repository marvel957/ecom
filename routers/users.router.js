const mongoose = require("mongoose");
const express = require("express");
const userRoutes = express.Router();
const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middlewares/jwt");

userRoutes.get("/", async (req, res) => {
  try {
    const userList = await User.find({}).select("-passwordHash");
    return res.status(200).json(userList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
userRoutes.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
userRoutes.post("/", async (req, res) => {
  try {
    const createdUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    return res.status(201).json(createdUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
userRoutes.post("/register", async (req, res) => {
  try {
    const createdUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    return res.status(201).json(createdUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
userRoutes.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "unregistered email adress" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );
    if (!validPassword)
      return res.status(400).json({ error: "invalid credentials" });

    const token = generateToken(user);

    return res.status(201).json({ user: user.email, token: token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
userRoutes.get("/get/count", async (req, res) => {
  const usersCount = await User.countDocuments();
  return res.status(200).json({ "no of users": usersCount });
});
userRoutes.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("Invalid user id");
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.status(200).json("Delete successful");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = userRoutes;
