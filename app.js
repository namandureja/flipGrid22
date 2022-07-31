const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const { connectToDB } = require("./db");
const contractInfo = require("./FlipkartItem.json");
const contractAddress = require("./localhost.json");
const { ethers } = require("ethers");
const Purchased = require("./models/Purchased");

var cors = require("cors");

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
        ethers.getDefaultProvider("http://localhost:8545")
    );

    contract.on("Transfer", async (...args) => {
        let prod = await Purchased.findOne({ _id: args[2].toNumber() });
        if (!prod) {
            if (args[0] == "0x0000000000000000000000000000000000000000") {
                console.log("New product purchased by", args[1]);
            } else {
                console.log("Resale product purchased by", args[1]);
            }
            prod = new Purchased({
                _id: args[2],
                owner: args[1],
            });
            prod.save();
        } else {
            prod.owner = args[1];
            prod.isResale = false;
            prod.save();
        }
    });
});
