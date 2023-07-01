const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// comment of comment
const Reply = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },

  //   dynamically generated
  thumbupCount: { type: Number, default: 0 },
  deleteTime: { type: Number, default: 0 },

  //   option: user can add data
  replyImgAddress: { type: String },
});

module.exports = Reply;
