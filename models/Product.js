var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    features: Array,
    price: String,
    warranty: Number,
    isSoulbound: Boolean,
    image: String,
});

module.exports = new mongoose.model("Product", productSchema);
