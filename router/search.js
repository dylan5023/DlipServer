const express = require("express");
const router = express.Router();
const { Article } = require("../mongoose/model");

// A route that returns post search results
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

router.get("/search/:q", async (req, res) => {
  const { q } = req.params;
  const { lastIndex } = req.query;

  const findOption = {
    title: { $regex: q },
  };

  if (lastIndex !== "0") {
    findOption._id = { $lt: lastIndex };
  }

  // Increment the viewCount of the articles in the search result by 1
  await Article.updateMany(findOption, { $inc: { viewCount: 1 } });

  const article = await Article.find(findOption)
    .sort({ _id: -1 })
    .limit(6)
    .populate({
      path: "author",
      populate: {
        path: "company",
      },
    });

  res.send({
    article: article,
    error: false,
    msg: "Success",
  });
});

module.exports = router;
