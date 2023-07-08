const express = require("express");
const router = express.Router();
const { Article, Board } = require("./../mongoose/model");

// get evey articles
router.get("/main", async (req, res) => {
  const board = await Board.find({});
  if (!Array.isArray(board)) {
    res.send({
      error: true,
      msg: "Can't find board",
    });
  }

  let mainContent = [];
  Promise.all(
    board.map(async (b) => {
      const recentArticles = await Article.find({ board: b._id });
      if (!Array.isArray(recentArticles)) {
        return;
      }
      mainContent.push({
        ...b._doc,
        content: recentArticles,
      });
      return;
    })
  )
    .then(() => {
      res.send({
        content: mainContent,
        error: false,
        msg: "success",
      });
    })
    .catch((err) => {
      console.error(err);
      res.send({
        content: null,
        error: true,
        msg: "server error",
      });
    });
});

// get the board list
router.get("/board/list", async (req, res) => {
  const board = await Board.find();
  res.send(board);
});

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
