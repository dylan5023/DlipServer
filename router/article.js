const express = require("express");
const router = express.Router();
const { Article, Comment } = require("../mongoose/model");

// Router for getting each article
router.get("/article/:id", async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  const comment = await Comment.find({ article: id });
  res.send({ article, comment });
});

// add article
router.post("/article/create", async (req, res) => {
  const { title, author, content, board } = req.body;
  console.log(req.body);
  const newArticle = await Article({
    author,
    title,
    content,
    board,
  }).save();
  res.send(newArticle);
});
// edit the article
router.patch("/article /update", async (req, res) => {
  const { id, author, content } = req.body;
  const updatedArticle = await Article.findOneAndUpdate(
    { _id: id, author },
    { content },
    // resend updated comment
    { new: true }
  );
  console.log(updatedArticle);
  res.send(updatedArticle);
});
// delete the article(HARD DELETE)
router.delete("/article/delete/hard", async (req, res) => {
  const { id, author } = req.body;
  const deletedArticle = await Article.deleteOne({ _id: id, author });
  res.send(deletedArticle);
});

// delete the article(soft DELETE)
router.delete("/article/delete/soft", async (req, res) => {
  const { id, author } = req.body;
  const deletedArticle = await Article.findOneAndUpdate(
    { _id: id, author },
    {
      deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    }
  );
  res.send(deletedArticle);
});

module.exports = router;
