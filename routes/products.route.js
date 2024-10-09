const express = require("express");
const productRoute = express.Router();
const { authMiddleware } = require("../middlewares/jwt");
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controllers");

productRoute.post("/", authMiddleware, createProduct);
productRoute.get("/", getAllProducts);
productRoute.get("/:id", getSingleProduct);
productRoute.put("/:id", authMiddleware, updateProduct);
productRoute.delete("/:id", authMiddleware, deleteProduct);

module.exports = productRoute;
