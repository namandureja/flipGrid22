const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
        fname: String,
        address: String,
        phone : String,
        createdAt: {
            type: Date,
            default: Date.now
        },

    }, { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
