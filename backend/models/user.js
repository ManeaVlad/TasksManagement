const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  local: {
    email: { type: String, unique: true },
    password: String,
    userName: { type: String, unique: true },
    companyName: String,
    activeUser: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
  },
  google: {
    email: { type: String, unique: true },
    id: String,
    userName: { type: String, unique: true },
    token: String,
    companyName: String,
    activeUser: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
