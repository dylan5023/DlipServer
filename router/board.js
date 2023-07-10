const express = require("express");
const router = express.Router();
const { Article, Board } = require("../mongoose/model");

router.get("/board/best", async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ viewCount: -1 })
      .limit(5)
      .populate("board");

    res.send({
      content: articles,
      error: false,
      msg: "Success",
    });
  } catch (error) {
    console.error(error);
    res.send({
      content: null,
      error: true,
      msg: "Server error",
    });
  }
});

// A route that collects and displays various bulletin board posts in the main
router.get("/main", async (req, res) => {
  const board = await Board.find();
  if (!Array.isArray(board)) {
    res.send({
      error: true,
      msg: "Can't find a board",
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
    })
  )
    .then(() => {
      res.send({
        content: mainContent,
        error: false,
        msg: "Sucess",
      });
    })
    .catch((err) => {
      console.error(err);
      res.send({
        content: null,
        error: true,
        msg: "Server error",
      });
    });
});

// Route to load list of bulletin boards
router.get("/board/list", async (req, res) => {
  const board = await Board.find();
  res.send(board);
});

// Route to get posts by forum
router.get("/board/:slug", async (req, res) => {
  const { slug } = req.params;
  // infinity sclloing
  const { lastIndex } = req.query;

  const board = await Board.findOne({ slug });
  if (!board._id) {
    return res.send({
      article: [],
      error: true,
      msg: "Doest not exist",
    });
  }

  const findOption = {
    board: board._id,
  };

  if (lastIndex !== "0") {
    findOption._id = { $lt: lastIndex };
  }

  const article = await Article.find(findOption)
    .sort({ _id: -1 })
    .limit(2)
    .populate({
      path: "author",
      populate: { path: "company" },
    });

  const formatedArtilce = article.map((v) => {
    return {
      ...v._doc,
      author: {
        ...v._doc.author._doc,
        nickname: `${v._doc.author._doc.nickname[0]}${"*".repeat(
          v._doc.author._doc.nickname.length - 1
        )}`,
      },
    };
  });
  res.send({ article: formatedArtilce, error: false, msg: "Success" });
});

// admin: add board
router.post("/board/create", async (req, res) => {
  const { title, slug } = req.body;
  const newBoard = await Board({
    title,
    slug,
  }).save();

  res.send(newBoard._id ? true : false);
});

module.exports = router;
