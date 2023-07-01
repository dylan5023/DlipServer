const express = require("express");
const router = express.Router();
const { Comment } = require("../mongoose/model");

// add the comment
router.post("/comment/create", async (req, res) => {
  const { author, article, content } = req.body;
  const newComment = await Comment.create({ author, article, content });
  res.send(newComment._id ? true : false);
});

// edit the comment
router.patch("/comment/update", async (req, res) => {
  const { id, author, content } = req.body;
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: id, author },
    { content },
    // resend updated comment
    { new: true }
  );
  console.log(updatedComment);
  res.send(updatedComment);
});

// delete the comment(HARD DELETE)
router.delete("/comment/delete/hard", async (req, res) => {
  const { id, author } = req.body;
  const deletedComment = await Comment.deleteOne({ _id: id, author });
  console.log(deletedComment);
  res.send(deletedComment);
});

// delete the comment(SOFT  DELETE)
router.delete("/comment/delete/soft", async (req, res) => {
  const { id, author } = req.body;
  const deletedComment = await Comment.findOneAndUpdate(
    { _id: id, author },
    {
      deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    }
  );

  res.send(deletedComment);
});

module.exports = router;
