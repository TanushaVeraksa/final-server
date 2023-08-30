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
    const token = generateJwt(req.user.id, req.user.email, req.user.name, req.user.role)
    return res.json({token})
})

module.exports = router;