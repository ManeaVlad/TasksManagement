const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  title: { type: String, required: [true, "Title is required."] },
  description: { type: String, required: [true, "Description is required."] },
  imagePath: { type: String },
  creator: {
    type: String,
    required: true,
  },
  state: { type: String, default: "Pending" },
  priority: { type: String, required: true },
  assignee: { type: String },
  dueDate: { type: String, required: true },
  startDate: { type: String, required: true },
  company: { type: String, required: true },
});

module.exports = mongoose.model("Project", projectSchema);
