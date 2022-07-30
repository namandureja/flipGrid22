const express = require("express");
const Image = require("../models/Image");
const Product = require("../models/Product");

const router = express.Router();

router.get("/product/all", async (req, res) => {
    return res.send(await Product.find({}));
});

router.get("/product/:id", async (req, res, next) => {
    const prod = await Product.findOne({ _id: req.params.id });
    if (prod) {
        return res.json({ ...prod._doc, __v: undefined });
    }
    next();
});

router.get("/image/:id", async (req, res, next) => {
    const img = await Image.findOne({ _id: req.params.id });
    if (img) {
        res.send(img.data);
    }
    next();
});

module.exports = router;
