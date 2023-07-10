const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const Article = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  createdAt: { type: Date, default: Date.now, required: true },

  // Dynimic data
  viewCount: { type: Number, default: 0 },
  thumbupCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  deleteTime: { type: Number, default: 0 },

  // (optional): Data that users can add to their posts
  articleImgAddress: { type: String },
  mention: { type: Schema.Types.ObjectId, ref: "User" },
});

Article.plugin(AutoIncrement, { inc_field: "key" });

module.exports = Article;
