const express = require("express");
const router = express.Router();

const { showEXO } = require("../controllers/exoplanet.js");
const { isLoggedIn } = require("../middleware"); // Adjust path if needed

router.get("/", isLoggedIn, showEXO);

module.exports = router;
