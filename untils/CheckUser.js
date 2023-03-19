const mongoose = require('mongoose');
const User = require("../models/User");

async function Check_User(data) {
    await mongoose.connect(process.env.MONGO_URL);
    return await User.find({id: data.id}).exec()
}

module.exports = Check_User;