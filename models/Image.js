var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
    data: Buffer,
});

module.exports = new mongoose.model("Image", imageSchema);
