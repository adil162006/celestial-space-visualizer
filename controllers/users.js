const User = require("../models/user");
const passport = require("passport");


module.exports.showSignup = (req,res)=>{
    res.render("users/signup")
}
module.exports.postSignup = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err); // important!
            req.flash("success", "Welcome to celestia!");
            return res.redirect("/");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}

module.exports.showLogin = (req, res) => {
    res.render("users/login");
}
module.exports.postLogin = (req, res) => {
        const redirectUrl = res.locals.redirectUrl || "/"; // ✅ define it
        req.flash("success", "Welcome back!");
        return res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully");
        return res.redirect("/");
    });
}


