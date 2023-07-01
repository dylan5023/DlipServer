const express = require("express");
const router = express.Router();
const { Company } = require("./../mongoose/model");

// add company
router.post("/company/create", async (req, res) => {
  const { name } = req.body;
  const newCompany = await Company({
    name,
  }).save();

  res.send(newCompany._id ? true : false);
});

module.exports = router;
