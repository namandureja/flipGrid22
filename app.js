const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const { connectToDB } = require("./db");
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
});
