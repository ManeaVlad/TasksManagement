const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: [true, "Title is required."] },
  content: { type: String, required: [true, "Content is required."] },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Post", postSchema); // the collection name will be the plural of Post -> posts
