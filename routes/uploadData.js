const express = require("express");
const User = require("../models/User");
var imgModel = require('../models/Images');
var prodModel = require('../models/Products');
const fs = require("fs");
const path = require('path');

const router = express.Router();



router.post('/upload/image',(req, res) => {
    var final_img = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            contentType: req.files.file.mimetype,
            data: new Buffer.from(req.files.file.data, 'base64')
        }
    };
    imgModel.create(final_img, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Saved To database");

        }
    })
});

router.post("/upload/product", async (req, res) => {
    let product = new prodModel({
        name: req.body.name,
        features: req.body.features,
        price: req.body.price,
        isSoulbound: req.body.soul,
        image: req.body.imageUrl,
    })
    try {
        await product.save();
    } catch (e) {
        console.log(e);
        return res.json({ status: 2, message: "database error" });
    }
    return res.json({ status: 1, message: "Success" });
})


router.post("/modifyAddress", (req, res) => {
    User.findByIdAndUpdate(req.body.id, { address: req.body.address }, () => {
        return res.json({ status: 1, message: "success" });
    })
})



module.exports = router;