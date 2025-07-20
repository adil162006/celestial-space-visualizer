const express = require("express");
const router = express.Router();

const { showEPIC, resultEPIC } = require("../controllers/epic.js");
const { isLoggedIn, validateDateNotInFuture,userRateLimiter } = require("../middleware"); // Adjust path if needed

// Show EPIC form
router.get("/", showEPIC);

// Handle EPIC form submission
router.post("/info", isLoggedIn,userRateLimiter, validateDateNotInFuture, resultEPIC);

module.exports = router;
