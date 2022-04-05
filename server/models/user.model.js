const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is a required field."],
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Email is a required field."],
      index: true,
      validate: [isEmail, "Invalid Email, Please Amend."],
    },
    password: {
      type: String,
      required: [true, "Password is a required field."],
      minlength: [8, "Password must be 8 characters."],
    },
    picture: {
      type: String,
    },
    newMessage: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "online",
    },
  },
  { minimize: false, timestamps: true }
);

module.exports.User = mongoose.model("User", UserSchema);
