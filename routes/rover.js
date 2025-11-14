const express = require("express");
const router = express.Router();

const { showRover, resultRover } = require("../controllers/rover.js");
const {  validateDateNotInFuture, userRateLimiter } = require("../middleware");

// Show the rover form page
router.get("/", showRover);

// Handle rover image search form submission
router.post("/info", userRateLimiter ,validateDateNotInFuture, resultRover);

module.exports = router;
