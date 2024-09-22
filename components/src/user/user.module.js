const mongoose = require("mongoose");

const sch = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      unique: [true, "User email already exists"],
    },
    pass: {
      type: String,
      required: [true, "User password is required"],
    },
    jop_title: {
      type: String,
      required: [true, "User job title is required"],
      enum: {
        values: ["admin", "user", "factor"],
        message: "{VALUE} is not supported as a job title",
      },
      default: "user",
    },
    working_hours: {
      type: Date,
      default: null, // Use null as default value
    },
    hours: {
      type: [Number], // Store the hours as number (milliseconds)
      default: [],
    },
    trusted: {
      type: Boolean,
      default: false,
    },
    change_pass: {
      type: Date,
    },
    sure: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

module.exports.user_model = mongoose.model("user_model", sch);
