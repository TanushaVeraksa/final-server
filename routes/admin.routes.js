const Router = require('express');
const router = new Router();
const User = require('../models/User');

router.get('/users', async (req, res) => {
    const users = await User.find({});
    return res.send(users)
})

module.exports = router;