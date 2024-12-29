const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
  },
  productDeliveryTime: {
    type: String,
  },
  productDeliveryFee: {
    type: Number,
  },
  productImageUrl: {
    type: String,
  },
  productRate: {
    type: Number,
  },
  productType: {
    type: String,
    enum: ["veg,non-veg"],
  },
});

let productModel;
if (mongoose.models.products) {
  productModel = mongoose.model("products");
}
productModel = mongoose.model("products", productSchema);

module.exports = productModel;
