const axios = require("axios");
const mongoose = require("mongoose");
const History = require("../models/ChatHistory");
const {app} = require("../app");
const jwt = require('jsonwebtoken');
app.post('/api.chatgpt', (req, res) => {
    let userJWT = req.headers.jwt;
    if (!userJWT) {
        res.status(400).send('No token');
        return
    }

    const tokenInfo = jwt.verify(userJWT, process.env.JWT_KEY);

    if (!tokenInfo) {
        res.status(400).send('Invalid token');
        return
    }

    const tokenExpire = new Date(tokenInfo.expireAt);
    const now = new Date();

    if (tokenExpire < now) {
        res.status(401).send('Token expire');
        return
    }

    const userid = tokenInfo.userId;

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