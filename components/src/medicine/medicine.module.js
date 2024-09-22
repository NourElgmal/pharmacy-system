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
});

const medicineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"], // This field is required
    },
    Addition_history: {
      type: Date,
      required: [true, "Addition history is required"],
      default: Date.now,
    },
    Expiry_date: {
      type: [saleSchema],
      required: [true, "Expiry_date is required"],
    },
    Company_Name: {
      type: String,
      required: [true, "Company_Name is required"],
    },
    The_narrow_branch: {
      type: [saleSchema],
      required: [true, "The_narrow_branch is required"],
    },
    sales: [saleSchema],
    Seller: {
      type: [[sellerSchema]],
    },
    price_AND_Date: [saleSchema],
    new_price_AND_Date: [saleSchema],
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    Number_of_strips_in_box: {
      type: Number,
      required: [true, "Number_of_strips_in_box is required"],
    },
    discount: {
      type: Number,
    },
    code_medicine: {
      type: String,
      require: [true, "code_medicine is required"],
    },
  },
  { timestamps: true }
);

module.exports.medicine_model = mongoose.model("Medicine", medicineSchema);
