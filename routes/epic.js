const express = require("express");
const router = express.Router();

const { showEPIC, resultEPIC } = require("../controllers/epic.js");
const {  validateDateNotInFuture,userRateLimiter } = require("../middleware"); // Adjust path if needed

// Show EPIC form
router.get("/", showEPIC);

// Handle EPIC form submission
router.post("/info",userRateLimiter, validateDateNotInFuture, resultEPIC);

module.exports = router;
