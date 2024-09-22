const mongoose = require("mongoose");
const Product_Buyer = mongoose.Schema({
  Product: {
    type: String,
    require: [true, "Product is req"],
  },
  quantity: {
    type: Number,
    require: [true, "quantity is req"],
  },
  price: {
    type: Number,
    require: [true, "price is req"],
  },
});
const sch = mongoose.Schema({
  Purchase_date: {
    type: Date,
    default: Date.now,
  },
  Purchase_price: {
    type: Number,
    require: [true, "Purchase_price is req"],
  },
  Products: [Product_Buyer],
  Paid_Price: {
    type: Number,
    require: [true, "Paid_Price is req"],
  },
  Remaining_Price: {
    type: Number,
    require: [true, "Remaining_Price is req"],
  },
  Company_Name: {
    type: String,
    required: [true, "Company_Name is required"],
  },
  add_id: {
    type: mongoose.Types.ObjectId,
    required: [true, "add_id is required"],
  },
});
module.exports.invoice_model = mongoose.model("invoice_model", sch);
