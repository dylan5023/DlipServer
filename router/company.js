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

// get list of popular companies
router.get("/company/list/famous", async (req, res) => {
  const company = await Company.find().limit(10).sort({ realtimeScore: -1 });

  res.send(company);
});

module.exports = router;
