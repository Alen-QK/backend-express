const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    id: String,
    name: String,
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function(pwd) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(pwd, this.salt, 1000, 64, `sha512`).toString('hex');
};

UserSchema.methods.validPassword = function(pwd) {
    const hash = crypto.pbkdf2Sync(pwd, this.salt, 1000, 64, `sha512`).toString('hex');

    return this.hash === hash;
}

module.exports = mongoose.model('User', UserSchema);