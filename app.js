const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyparser.json());

app.listen(port, () => {
    console.log(`Running on ${port}`);
});

exports.app = app;