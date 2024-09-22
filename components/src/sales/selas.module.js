const mongoose = require("mongoose");

const saleSchema = mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Sale date is required"],
    default: Date.now,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  price_for_allquantity: {
    type: Number,
  },
  The_narrow_branch: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
});

const sellerSchema = mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Sale date is required"],
    default: Date.now,
  },
  id: {
    type: mongoose.Types.ObjectId,
    required: [true, "Seller ID is required"],
    ref: "user_model",
  },
  quantity: {
    type: Number,
    required: [true, "Quantity sold is required"],
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  name_of_medcen: {
    type: String,
    required: [true, "name_of_medcen is required"],
  },
});

const salesModelSchema = mongoose.Schema({
  sales: [saleSchema],
  Seller: [[sellerSchema]],
});

module.exports.sales_model = mongoose.model("sales_model", salesModelSchema);
