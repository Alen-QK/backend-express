const Check_User = require("../untils/CheckUser");
const {app} = require("../app");
const CreatJWT = require("../untils/CreateJWT");

app.post('/api.login', (req, res) => {
    const LoginData = req.body;

    Check_User(LoginData).then(user => {
        if (!user[0]) {
            res.send({code: 311, data: 'User not found!'})
        } else {
            if (user[0].validPassword(LoginData.pwd)) {
                const JWT = CreatJWT(LoginData.id);

                res.send({code: 310, data: JWT});
            } else {
                res.send({code: 312, data: 'Pwd wrong!'})
            }
        }
    });
});