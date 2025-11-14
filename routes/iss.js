const express = require("express");
const router = express.Router();

const { showISS } = require("../controllers/iss.js");
const { userRateLimiter } = require("../middleware"); // Adjust if needed

router.get("/",userRateLimiter, showISS);

module.exports = router;
