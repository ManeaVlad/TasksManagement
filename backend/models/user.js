const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  local: { email: String, password: String },
  google: { email: String, id: String, displayName: String, token: String }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
