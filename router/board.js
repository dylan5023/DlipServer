const express = require("express");
const router = express.Router();
const { Article, Board } = require("./../mongoose/model");

// get the posts per board
router.get("/board/:slug", async (req, res) => {
  const { slug } = req.params;
  const { lastIndex } = req.query; // infinity scrolling
  const board = await Board.findOne({ slug });
  if (!board._id) {
    return res.send({
      article: [],
      error: true,
      msg: "no existing board",
    });
  }
  const article = await Article.find({ board: board._id });
  res.send({ article, error: false, msg: "success" });
});

// admin : add board
router.post("/board/create", async (req, res) => {
  const { title, slug } = req.body;
  const newBoard = await Board({
    title,
    slug,
  }).save();
  res.send(newBoard._id ? true : false);
});

module.exports = router;
