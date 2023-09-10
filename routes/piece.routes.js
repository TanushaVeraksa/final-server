const Router = require('express');
const router = new Router();
const Piece = require('../models/Piece');

router.get('/title', async (req, res) => {
    const piece = await Piece.find({});
    const pieceTitles = piece.map((elem) => elem.title);
    return res.send(pieceTitles)
})

module.exports = router;