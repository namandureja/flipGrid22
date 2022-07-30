const mongoose = require("mongoose");
const User = require("./models/User.js");

module.exports.callBack = callback => {
    mongoose.connect( process.env.DB_URL, async () => {
             callback();
    })
}

