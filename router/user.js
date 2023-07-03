const express = require("express");
const router = express.Router();
const { User } = require("./../mongoose/model");

// login
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  const loginUser = await User.findOne({ email: email });
  if (!loginUser._id) {
    return res.send({
      error: true,
      msg: "User not found",
    });
  }
  const correctPassword = await loginUser.authenticate(password);
  if (!correctPassword) {
    return res.send({
      error: true,
      msg: "Invalid password",
    });
  }

  res.send({ email: loginUser.email, nickname: loginUser.nickname });
});

// add user
router.post("/user/create", async (req, res) => {
  const { nickname, company, email, password } = req.body;
  const newUser = await User({
    email,
    nickname,
    password,
    company,
  }).save();

  console.log(newUser);
  res.send(newUser._id ? true : false);
});

// change user information

// delete user

// add profile img

module.exports = router;
