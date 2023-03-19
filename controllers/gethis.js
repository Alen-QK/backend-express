const mongoose = require("mongoose");
const History = require("../models/ChatHistory");
const {app} = require("../app");

app.post('/api.gethis', (req, res) => {
    const userid = req.body.id;

    Select_His(userid).then((response) => {

        res.send({code: 200, data: response[0].history})
    })
})

async function Select_His(id) {
    await mongoose.connect(process.env.MONGO_URL);
    return await History.find({id: id}).exec()
}