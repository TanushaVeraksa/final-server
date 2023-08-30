const jwt = require('jsonwebtoken')

const SECRET_KEY = 'SEKRET_KEY';

module.exports = function (req, res, next) {
    if(req.method === 'OPTIONS') {
        next();
    }
    try{
        const token = req.headers.authorization.split(' ')[1]
        console.log(token)
        if(!token) {
            res.status(401).json({message: "User not authorized"})
        }
        const decode = jwt.verify(token, SECRET_KEY);
        req.user = decode;
        next()
    } catch(e) {
        res.status(401).json({message: "User not authorized"})
    }
}