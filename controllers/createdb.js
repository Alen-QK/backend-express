const mongoose = require("mongoose");
const User = require("../models/User");
const History = require("../models/ChatHistory");
const {app} = require("../app");

app.post('/api.db', (req, res) => {
    Create_DB(res);
});

async function Create_DB(res) {
    await mongoose.connect(process.env.MONGO_URL);
    const test = await User.find({name: 'admin'}).exec();

    if (!test[0]) {
        await User.create({id: 'test', name: 'admin', pwd: '123456'});
        await History.create({id: 'YXdzZGY=', history: [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Who won the world series in 2020?"},
                {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
                {"role": "user", "content": "Where was it played?"}
            ]});

        res.send({code: 210, data: 'DB init finish'});
    } else {
        res.send({code: 211, data: 'DB existed'});
    }
}