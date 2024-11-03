const express = require("express");
const Category = require("../models/categories.model");
const categoryRoutes = express.Router();

categoryRoutes.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find({});
    if (!categoryList) {
      return res.status(500).json({ error: "empty category" });
    }
    return res.status(200).json(categoryList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
categoryRoutes.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(500).json({ error: "empty category" });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
categoryRoutes.post("/", async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const category = new Category({
      name: name,
      icon: icon,
      color: color,
    });
    const createdCategory = await category.save();
    return res.status(201).json(createdCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
categoryRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
categoryRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    return res.status(200).json("Delete successful");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = categoryRoutes;
