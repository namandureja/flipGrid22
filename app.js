const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const { connectToDB } = require("./db");
const contractInfo = require("./FlipkartItem.json");
const contractAddress = require("./polygontest.json");
const { ethers } = require("ethers");
const Purchased = require("./models/Purchased");
const Product = require("./models/Product");

var cors = require("cors");
const User = require("./models/User");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.use("/", require("./routes/info.js"));
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/", require("./routes/upload.js"));

if (!process.env.PORT) process.env.PORT = 4000;
connectToDB(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server is listening on port ${process.env.PORT}`);
    });

    const contract = new ethers.Contract(
        contractAddress.address,
        contractInfo.abi,
        ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com/")
    );

    const sendSms = (text, number) => {};

    contract.on("Transfer", async (...args) => {
        console.log(args);
        let prod = await Purchased.findOne({ _id: args[2].toNumber() });
        const item = await Product.findOne({ _id: args[2] % 1000 });
        let user = await User.findOne({ address: args[1] });
        user = { phone: 42 };
        console.log(user);
        console.log(item);
        if (!prod) {
            if (args[0] == "0x0000000000000000000000000000000000000000") {
                console.log("New product purchased by", args[1]);
                sendSms(
                    `We congratulate you on the purchase of a new ${item.name}. You can view this transaction in polygonscan at https://mumbai.polygonscan.com/tx/${args[3].transactionHash}`,
                    user.phone
                );
            }
            prod = new Purchased({
                _id: args[2],
                owner: args[1],
            });
            prod.save();
        } else {
            console.log("Resale product purchased by", args[1]);
            prod.owner = args[1];
            prod.isResale = false;
            sendSms(
                `We congratulate you on the purchase of a resold ${item.name}. You can view this transaction in polygonscan at https://mumbai.polygonscan.com/tx/${args[3].transactionHash}`,
                user.phone
            );
            prod.save();
        }
    });
});
