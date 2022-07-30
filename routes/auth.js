const express = require("express");
const User = require("../models/User");
const crypto = require("crypto");

const router = express.Router();

router.post("/login", async (req, res) => {
    if (!req.body.email || !req.body.password) return res.json({ status: 0, message: "invalid parameters" });

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.json({ status: 2, message: "User does not exist." });
    }

    const hashedPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");
    if (user.password != hashedPassword) {
        return res.json({ status: 3, message: "Invalid Password" });
    }

    return res.json({ status: 1, message: "success", data: { ...user._doc, password: undefined } });
});

router.post("/register", async (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.fname)
        return res.json({ status: 0, message: "invalid parameters" });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.json({ status: 2, message: "User already exists!" });

    const hashedPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");
    console.log(req.body.fname);
    user = new User({
        email: req.body.email,
        password: hashedPassword,
        fname: req.body.fname,
        phone: req.body.phone,
    });
    try {
        await user.save();
    } catch (e) {
        console.log(e);
        return res.json({ status: 2, message: "database error" });
    }

    return res.json({ status: 1, message: "success", data: { ...user._doc } });
});

module.exports = router;
