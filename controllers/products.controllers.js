const Product = require("../models/products.models");

const getAllProducts =  async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }}
const getSingleProduct =  async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findOne({ _id: productId });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }}
const createProduct = async (req, res) => {
  try {
    if (!req.body.name || !req.body.price || !req.body.quantity) {
      return res.status(400).json({ error: "invalid credentials" });
    }
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }}
const updateProduct=  async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ error: "no product with that id" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }}

const deleteProduct= async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ error: "no product with that id" });
    }
    const deletedProduct = await Product.findByIdAndDelete(productId);
    return res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }}


module.exports = {
    getAllProducts,getSingleProduct,createProduct,updateProduct,deleteProduct
}
