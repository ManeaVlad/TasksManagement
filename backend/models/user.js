const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  local: {
    email: { type: String, unique: true },
    password: String,
    userName: { type: String, unique: true },
    companyName: { type: String, default: "" },
    activeUser: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    phone: { type: String, default: "" },
    role: { type: String, default: "" },
  },
  google: {
    email: { type: String, unique: true },
    id: String,
    userName: { type: String, unique: true },
    token: String,
    companyName: { type: String, default: "" },
    activeUser: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    phone: { type: String, default: "" },
    role: { type: String, default: "" },
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
