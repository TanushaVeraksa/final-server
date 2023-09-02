const Router = require('express');
const router = new Router();
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SEKRET_KEY';

const generateJwt = (user) => {
   return jwt.sign(
    {id: user.id, email: user.email, name: user.name, role: user.role}, 
    SECRET_KEY, 
    {expiresIn: '24h'});
}

router.get('/check', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if(!token) {
        res.status(401).json({message: "User not authorized"})
    }
    const decode = jwt.verify(token, SECRET_KEY);
    req.user = decode;
    if(decode.role !== 'Admin') {
        return res.status(403).json({access: false})
    }
    return res.send({access: true})
})


module.exports = router;