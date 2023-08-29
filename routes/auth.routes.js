const Router = require('express');
const User = require('../models/User');
const router = new Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SEKRET_KEY';

const generateJwt = (user) => {
   return jwt.sign(
    {id: user.id, email: user.email, name: user.name, role: user.role}, 
    SECRET_KEY, 
    {expiresIn: '24h'});
}

router.get('/', async (req, res) => {
    const candidate = await User.find({})
    res.send(candidate)
})

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

router.post('/registration', async (req, res) => {
    try {
        const {email, name, password} = req.body;
        const candidate = await User.findOne({email});
        if(candidate) {
            return res.status(400).json({message: `User with email ${email} already exist`});
        }
        if(!validateEmail(email)) {
            return res.status(400).json({message: 'Uncorrect email'})
        }
        if(name.length === 0) {
            return res.status(400).json({message: 'Name cannot be empty'})
        }
        if(password.length < 3 || password.length > 12) {
            return res.status(400).json({message: 'Password must be longer than 3 and shorter than 12'})
        }
        const hashPassword = await bcrypt.hash(password, 2);
        const user = new User({email, name, password: hashPassword});
        await user.save();
        const token = generateJwt(user);
        return res.json({token});

    } catch(e) {
        console.log(e)
        res.send({message: 'Server error'})
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message: 'User not found'});
        }
        const isPasswordValid = await bcrypt.compareSync(password, user.password);
 
        if(!isPasswordValid) {
            return res.status(400).json({message: 'Invalid password'});
        }
        const token = generateJwt(user);
        return res.json({token});

    } catch(e) {
        console.log(e)
        res.send({message: 'Server error'})
    }
})

router.get('/check', async (req, res) => {
    const token = generateJwt(req.body);
    return res.json({token});
})

module.exports = router;