const mongoose = require("mongoose");
const User = require("../models/User");
const History = require("../models/ChatHistory");
const Check_User = require("../untils/CheckUser");
const {app} = require("../app");

app.post('/api.signup', (req, res) => {
    const SignupData = req.body;

    Check_User(SignupData).then(user => {
        if (user[0]) {
            res.send({code: 311, data: 'Username has existed!'})
        } else {
            async function Add_User(data) {
                await mongoose.connect(process.env.MONGO_URL);

                let newUser = new User();
                newUser.id = data.id;
                newUser.name = data.name;
                newUser.setPassword(data.pwd);
                // await User.create({id: data.id, name: data.name, pwd: data.pwd});
                await newUser.save();
                await History.create({id: data.id, history: []});
            }

            Add_User(SignupData).then(() => {
                res.send({code: 200, data: 'Add new user.'})
            });
        }
    })
});