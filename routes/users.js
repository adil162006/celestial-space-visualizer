const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/users");
const { saveRedirectUrl } = require("../middleware");

// Signup Routes
router.get("/signup", authController.showSignup);
router.post("/signup", authController.postSignup);

// Login Routes
router.get("/login", authController.showLogin);
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    authController.postLogin
);

// Logout Route
router.get("/logout", authController.logout);

module.exports = router;
