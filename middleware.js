const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

module.exports.validateDateNotInFuture = (req, res, next) => {
    const inputDate = new Date(req.body.date);
    const today = new Date();

    // Remove time parts
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (inputDate > today) {
        return res.status(400).render("error.ejs", {
            err: { status: 400, message: "Date cannot be in the future." }
        });
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