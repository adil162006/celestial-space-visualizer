const express = require("express");
const router = express.Router();

const { showISS } = require("../controllers/iss.js");
const { isLoggedIn,userRateLimiter } = require("../middleware"); // Adjust if needed

router.get("/", isLoggedIn,userRateLimiter, showISS);

module.exports = router;
