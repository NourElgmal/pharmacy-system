const mongoose = require("mongoose");

const pr = mongoose.Schema({
  date: {
    type: Date,
    require: [true, "profit.date is req"],
  },
  profit: {
    type: Number,
    require: [true, "profit.profit is req"],
  },
});
const profit = mongoose.Schema({
  day: [pr],
  month: [pr],
  year: [pr],
});
module.exports.profit_model = mongoose.model("profit_model", profit);
