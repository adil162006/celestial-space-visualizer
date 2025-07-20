const express = require("express");
const router = express.Router();
const { showAPOD, resultAPOD } = require("../controllers/apod");
const { isLoggedIn, validateDateNotInFuture,userRateLimiter } = require("../middleware");

// GET route to display the APOD form
router.get("/", showAPOD);

// POST route to fetch and show APOD result
router.post("/info", isLoggedIn, userRateLimiter,validateDateNotInFuture, resultAPOD);

module.exports = router;
