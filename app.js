const express = require('express');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const axios = require('axios');
var cors = require('cors');
const mongoose = require('mongoose');

const User = require('./models/User');
const History = require('./models/ChatHistory');
const {response} = require("express");

dotenv.config();
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
});

app.post('/api.chatgpt', (req, res) => {
    let userid = req.body.id;
    // 还是应该让前端传回实时的当前聊天记录，否则每次都只传回一个userid来做检查对于数据库的访问过于频繁
    let chatHistory = req.body.data;

    chatHistory = chatHistory.map((item) => {
        return {
            role: item.role,
            content: item.content
        }
    });

    let data = {
        model: "gpt-3.5-turbo",
        messages: chatHistory
    };

    let config = {
        headers: {
            Authorization: `Bearer ${process.env.TOKEN}`
        }
    };

    axios.post('https://api.openai.com/v1/chat/completions', data, config)
        .then((response) => {
            if (response.status !== 200) {
                res.send('API connection error')
            } else {
                // 向数据库存储最新的聊天记录 todo
                chatHistory.push(response.data.choices[0].message);
                UpdateHistory(userid, chatHistory).then(r => {
                    res.send({code: 200, data: response.data.choices[0].message})
                });
            }
        });
});

async function UpdateHistory(userid, history) {
    await mongoose.connect(process.env.MONGO_URL);
    const user = await History.findOne({id: userid});

    user.history = history;
    await user.save();
}

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

app.post('/api.login', (req, res) => {
    const LoginData = req.body;

    Check_User(LoginData).then(user => {
        if (!user[0]) {
            res.send({code: 311, data: 'User not found!'})
        } else {
            if (user[0].pwd !== LoginData.pwd) {
                res.send({code: 312, data: 'Pwd wrong!'})
            } else {
                res.send({code: 310, data: 'Auth permitted!'});
            }
        }
    });
});

app.post('/api.signup', (req, res) => {
    const SignupData = req.body;

    Check_User(SignupData).then(user => {
        if (user[0]) {
            res.send({code: 311, data: 'Username has existed!'})
        } else {
            async function Add_User(data) {
                await mongoose.connect(process.env.MONGO_URL);
                await User.create({id: data.id, name: data.name, pwd: data.pwd});
                await History.create({id: data.id, history: []});
            }

            Add_User(SignupData).then(() => {
                res.send({code: 200, data: 'Add new user.'})
            });
        }
    })
});

async function Check_User(data) {
    await mongoose.connect(process.env.MONGO_URL);
    return await User.find({id: data.id}).exec()
}

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

app.listen(port, () => {
    console.log(`Running on ${port}`);
});