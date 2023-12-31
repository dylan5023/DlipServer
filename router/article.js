const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Article, Comment, Reply } = require("../mongoose/model");

//  get each article
router.get("/article/:key", async (req, res) => {
  const { key } = req.params;

  // Increment the viewCount of the article by 1
  await Article.updateOne({ key }, { $inc: { viewCount: 1 } });

  const article = await Article.findOne({ key })
    .populate("board")
    .populate({
      path: "author",
      populate: { path: "company" },
    });

  const commentList = await Comment.find({ article: article._id }).populate({
    path: "author",
    populate: { path: "company" },
  });

  Promise.all(
    commentList.map(async (v) => {
      const replies = await Reply.find({ comment: v._doc._id }).populate({
        path: "author",
        populate: { path: "company" },
      });
      return {
        ...v._doc,
        author: {
          ...v._doc.author._doc,
          nickname: `${v._doc.author._doc.nickname[0]}${"*".repeat(
            v._doc.author._doc.nickname.length - 1
          )}`,
        },
        replies: replies.map((r) => {
          return {
            ...r._doc,
            author: {
              ...r._doc.author._doc,
              nickname: `${r._doc.author._doc.nickname[0]}${"*".repeat(
                r._doc.author._doc.nickname.length - 1
              )}`,
            },
          };
        }),
      };
    })
  )
    .then((comment) => {
      res.send({
        article: {
          ...article._doc,
          author: {
            ...article._doc.author._doc,
            nickname: `${article.author._doc.nickname[0]}${"*".repeat(
              article._doc.author._doc.nickname.length - 1
            )}`,
          },
        },
        comment: comment,
      });
    })
    .catch(() => {});
});

// add articles
router.post("/article/create", async (req, res) => {
  const { title, content, board } = req.body;
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
    const payload = {
      author: data.id,
      title,
      content,
      board,
    };
    const newArticle = await Article(payload).save();
    res.send(newArticle);
  });
});

// edit article
router.patch("/article/update", async (req, res) => {
  const { id, author, content } = req.body;
  const updatedArticle = await Article.findOneAndUpdate(
    {
      _id: id,
      author,
    },
    {
      content,
    },
    {
      new: true,
    }
  );
  res.send(updatedArticle);
});

//(HARD DELETE)
router.delete("/article/delete/hard", async (req, res) => {
  const { id, author } = req.body;
  const deletedArticle = await Article.deleteOne({
    _id: id,
    author,
  });
  res.send(deletedArticle);
});

// (SOFT DELETE)
router.delete("/article/delete/soft", async (req, res) => {
  const { id, author } = req.body;
  const deletedArticle = await Article.findOneAndUpdate(
    {
      _id: id,
      author,
    },
    {
      deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30일 후의 시간이 저장
    }
  );
  res.send(deletedArticle);
});

module.exports = router;
