const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { callBack } = require('./db');
var cors = require('cors')

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/auth', require('./routes/auth.js'));

if (!process.env.PORT) process.env.PORT = 4000;
callBack(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`);
  });
});
