var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    _id: Number,
    owner: String,
    price: {
        type: String,
        default: "0.0",
    },
    isResale: {
        type: Boolean,
        default: false,
    },
});

module.exports = new mongoose.model("Purchased", productSchema);
