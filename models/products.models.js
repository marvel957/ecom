const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "product name is required"] },
    quantity: { type: Number, required: true, default: 0 },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
