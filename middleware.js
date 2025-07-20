const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.validateDateNotInFuture = (req, res, next) => {
    const inputDate = new Date(req.body.date); // Assuming input field name is 'date'
    const today = new Date();

    // Remove time parts
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (inputDate > today) {
        req.flash("error", "Date cannot be in the future.");
        
        // Redirect to stored URL or fallback to 'back'
        const redirectTo = req.session.redirectUrl || "back";
        return res.redirect(redirectTo);
    }

    next();
};


module.exports.userRateLimiter =  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // max 10 requests per window
    message: "You have exceeded the 10 requests per hour limit!",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // ✅ Use helper for IP-safe handling (prevents IPv6 bypass)
        return ipKeyGenerator(req);
    }
});