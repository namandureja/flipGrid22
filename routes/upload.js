const express = require("express");
const User = require("../models/User");
var Image = require("../models/Image");
var Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/upload/image", async (req, res) => {
    const img = new Image({ data: req.files.file.data });
    await img.save();
    return res.json({ imageId: img._id });
});

router.post("/upload/product", async (req, res) => {
    let product = new Product({
        _id: req.body.itemId,
        name: req.body.name,
        features: req.body.features.split(","),
        price: req.body.price,
        warranty: req.body.warranty,
        isSoulbound: req.body.isSoulbound,
        image: req.body.imageId,
    });
    try {
        await product.save();
    } catch (e) {
        console.log(e);
        return res.json({ status: 2, message: "database error" });
    }
    return res.json({ status: 1, message: "Success" });
});

router.post("/modifyAddress", (req, res) => {
    User.findByIdAndUpdate(req.body.id, { address: req.body.address }, () => {
        return res.json({ status: 1, message: "success" });
    });
});

module.exports = router;
