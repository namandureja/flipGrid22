const express = require("express");
const Image = require("../models/Image");
const Product = require("../models/Product");
const Purchased = require("../models/Purchased");

const router = express.Router();
router.get("/product/all", async (req, res) => {
    return res.json(await Product.find({}));
});

router.get("/product/resale", async (req, res) => {
    let products = [];
    const purchased = await Purchased.find({ isResale: true });
    for (let i = 0; i < purchased.length; i++) {
        const prod = purchased[i];

        const product = await Product.findOne({ _id: prod._id % 1000 });

        products.push({ ...product._doc, price: prod.price, owner: prod.owner, sno: prod._id });
    }
    return res.json(products);
});

router.get("/ownedItems/:addr", async (req, res) => {
    const purchased = await Purchased.find({ owner: req.params.addr });
    let products = [];

    for (let i = 0; i < purchased.length; i++) {
        prod = purchased[i];
        const product = await Product.findOne({ _id: prod._id % 1000 });
        products.push({ ...product._doc, owner: prod.owner, sno: prod._id });
    }
    return res.json(products);
});

router.post("/putforresale/", async (req, res) => {
    const purchased = await Purchased.findOne({ _id: req.body.sno });
    console.log(purchased);
    purchased.isResale = true;
    purchased.price = req.body.value;
    purchased.save();
    return res.json({ ok: 1 });
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
