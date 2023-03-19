const jwt = require('jsonwebtoken');

function CreatJWT(userid) {
    const now = new Date();
    now.setHours(now.getHours() + 2)
    const JWTdata = {
        userId: userid,
        expireAt: now
    }

    const token = jwt.sign(
        JSON.stringify(JWTdata),
        process.env.JWT_KEY,
        {algorithm: 'HS256'}
    );

    return token
}

module.exports = CreatJWT;