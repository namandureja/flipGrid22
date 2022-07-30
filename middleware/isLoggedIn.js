const User = require("../models/User");

const isLoggedIn = async (req, res, next) => {
    if (!req.signedCookies.auth) return res.json({
        status: 0
    });
    const user = await User.findOne({ email: req.signedCookies.auth });
    if (!user) return res.json({
        status: 0
    });
    req.user = user;
    next();
}

module.exports = isLoggedIn;