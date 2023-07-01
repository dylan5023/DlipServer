const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// just comment
const Comment = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  article: { type: Schema.Types.ObjectId, ref: "Article" },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },

  //   dynamically generated
  thumbupCount: { type: Number, default: 0 },
  deleteTime: { type: Number, default: 0 },

  //   option: user can add data
  articleImgAddress: { type: String },
});

module.exports = Comment;
