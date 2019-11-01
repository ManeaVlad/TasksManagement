const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: [true, "E-Mail is required."], unique: true },
  password: { type: String, required: [true, "Password is required."] },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
