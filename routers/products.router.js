const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");

const productRoutes = express.Router();
const Product = require("../models/products.model");
const Category = require("../models/categories.model");

productRoutes.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const products = await Product.find(filter).populate("category");
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
productRoutes.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  return res.status(200).send(product);
});
productRoutes.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("Invalid product id");
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(500).json({ error: "invalid category" });
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );
    return res.status(200).send(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
productRoutes.post(`/`, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(500).json({ error: "invalid category" });
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });
    await product.save();
    return res.status(200).send(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
productRoutes.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("Invalid product id");
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    return res.status(200).json("Delete successful");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
productRoutes.get("/get/count", async (req, res) => {
  const productsCount = await Product.countDocuments();
  return res.status(200).json({ "no of products": productsCount });
});
productRoutes.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? Number(req.params.count) : 0;
  const featuredProducts = await Product.find({ isFeatured: true }).limit(
    count
  );
  return res.status(200).json(featuredProducts);
});

module.exports = productRoutes;
