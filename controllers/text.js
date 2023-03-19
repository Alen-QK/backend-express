const axios = require("axios");
const {app} = require("../app");
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
});