const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  companyName: { type: String, required: [true, "Name is required."] },
});

module.exports = mongoose.model("Company", companySchema);
