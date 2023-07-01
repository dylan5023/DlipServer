const express = require("express");
const cors = require("cors");
const { article, board, comment, company, reply, user } = require("./router");
const app = express();
const PORT = 8088;

app.use(cors());
app.use(express.json()); //req.body
app.use(express.urlencoded({ extended: true }));

app.use(article);
app.use(board);
app.use(comment);
app.use(company);
app.use(reply);
app.use(user);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, "localhost", (req, res) => {
  console.log(`app listening at http://localhost:${PORT}`);
});
