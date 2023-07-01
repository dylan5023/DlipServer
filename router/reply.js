const express = require("express");
const router = express.Router();
const { Reply } = require("../mongoose/model");

// add the reply comment
router.post("/reply/create", async (req, res) => {
  const { author, comment, content } = req.body;
  const newReply = await Reply.create({ author, comment, content });
  res.send(newReply._id ? true : false);
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
