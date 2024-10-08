const express = require("express");
const productRoute = express.Router();
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controllers");

productRoute.post("/", createProduct);
productRoute.get("/", getAllProducts);
productRoute.get("/:id", getSingleProduct);
productRoute.put("/:id", updateProduct);
productRoute.delete("/:id", deleteProduct);

module.exports = productRoute;
