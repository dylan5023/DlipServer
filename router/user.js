const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
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

  const secret = req.app.get("jwt-secret");
  // create token
  const token = jwt.sign(
    { id: loginUser._id, email: email, nickname: loginUser.nickname },
    secret,
    { expiresIn: "7d", issuer: "dlip", subject: "auth" }
  );
  res.send({
    email: loginUser.email,
    nickname: loginUser.nickname,
    token: token,
    error: false,
    msg: "sucess login",
  });
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
// check token
router.get("/user/token", (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send(false);
  }
  const token = authorization.split(" ")[1];
  const secret = req.app.get("jwt-secret");
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      return res.send(err);
    }
    res.send({
      email: data.email,
      nickname: data.nickname,
    });
  });
});
// change user information

// delete user

// add profile img

module.exports = router;
