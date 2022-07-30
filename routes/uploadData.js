const express = require("express");
const User = require("../models/User");
var imgModel = require('../models/Images');
var prodModel = require('../models/Products');
const fs = require("fs");
const path = require('path');

const router = express.Router();

var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });


router.post('/upload/image', upload.single('image'),(req, res) => {
    console.log()
    var obj = {
        name: req.body.name,
        desc : req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
            return res.json({status:2, message: "database error" });
        }
        else {
            return res.json({status:1, message: "success",data: item});
        }
    });
});

router.post("/upload/product", async (req,res)=>{
    let product = new prodModel({
        name: req.body.name,
        features: req.body.features,
        price: req.body.price,
        isSoulbound: req.body.soul,
        image : req.body.imageUrl,
    })
    try {
        await product.save();  
    } catch (e) {
        console.log(e);
        return res.json({status:2, message: "database error" });
    }
    return res.json({status:1, message: "Success" });
})  


router.post("/modifyAddress",(req,res)=>{
    User.findByIdAndUpdate(req.body.id,{address:req.body.address},()=>{
        return res.json({status:1, message: "success"});
    })
})



module.exports = router;