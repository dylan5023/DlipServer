const express = require("express");
const router = express.Router();
const { Article, Comment } = require("../mongoose/model");
const jwt = require("jsonwebtoken");
// add the comment
router.post("/comment/create", async (req, res) => {
  const { article, content } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.send({
      error: true,
      msg: "Token is not authorized",
    });
  }

  const token = authorization.split(" ")[1];
  const secret = req.app.get("jwt-secret");

  jwt.verify(token, secret, async (err, data) => {
    if (err) {
      res.send(err);
    }

    const newComment = await Comment({
      author: data.id,
      article,
      content,
    }).save();

    await Article.findOneAndUpdate(
      { _id: article },
      {
        $inc: { commentCount: 1 },
      }
    );
    res.send(newComment._id ? true : false);
  });
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
