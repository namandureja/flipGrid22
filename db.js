const mongoose = require("mongoose");
const User = require("./models/User.js");

module.exports.connectToDB = (callback) => {
    mongoose.connect(process.env.DB_URL, async () => {
        callback();
    });
};
