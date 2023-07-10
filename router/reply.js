const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Comment, Reply } = require("../mongoose/model");

// add the reply comment
router.post("/reply/create", async (req, res) => {
  const { comment, content } = req.body;
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
    const newReply = await Reply({ author: data.id, comment, content }).save();
    const updateCount = await Comment.findOneAndUpdate(
      { _id: comment },
      {
        $inc: { replyCount: 1 },
      }
    );
    res.send(newReply._id ? true : false);
  });
});

// edit the comment
router.patch("/reply/update", async (req, res) => {
  const { id, author, content } = req.body;
  const updatedReply = await Reply.findOneAndUpdate(
    { _id: id, author },
    { content },
    // resend updated comment
    { new: true }
  );

  res.send(updatedReply);
});

// delete the comment(HARD DELETE)
router.delete("/reply/delete/hard", async (req, res) => {
  const { id, author } = req.body;
  const deletedReply = await Reply.deleteOne({ _id: id, author });
  res.send(deletedReply);
});

// delete the comment(soft DELETE)
router.delete("/reply/delete/soft", async (req, res) => {
  const { id, author } = req.body;
  const deletedReply = await Reply.findOneAndUpdate(
    { _id: id, author },
    {
      deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    }
  );
  res.send(deletedReply);
});

module.exports = router;
