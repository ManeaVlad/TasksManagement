const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  title: { type: String, required: [true, "Title is required."] },
  assignee: { type: String, required: true },
  taskId: { type: String, required: true },
  dueDate: { type: String, required: true },
  startDate: { type: String, required: true },
  company: { type: String, required: true },
  view: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", notificationSchema);
