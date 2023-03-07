const express = require('express');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const axios = require('axios');
var cors = require('cors')
dotenv.config()
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/api.text', (req, res) => {
    const text = req.body.text;

    let data = {
        model: "text-davinci-003",
        prompt: text
    };

    let config = {
        headers: {
            Authorization: `Bearer ${process.env.TOKEN}`
        }
    };

    axios.post('https://api.openai.com/v1/completions', data, config)
        .then((response) => {
            if (response.status !== 200) {
                res.send('API connection error')
            } else {
                res.send(response.data.choices[0].text)
            }
        });
})

app.listen(port, () => {
    console.log(`Running on ${port}`);
});