const Router = require('express');
const router = new Router();
const Piece = require('../models/Piece');
const Review = require('../models/Review');

router.get('/title', async (req, res) => {
    const piece = await Piece.find({});
    const pieceTitles = piece.map((elem) => elem.title);
    return res.send(pieceTitles)
})

router.get('/reviews', async(req, res) => {
    const {id} = req.query;
    try {
        const review = await Review.findOne({_id: id});
        const piece = await Piece.findOne({title: review.piece});
        const filterReview = piece.reviewId.filter(elem => String(elem) !== id)
        return res.send(filterReview);
    }catch(e) {
        console.log(e)
    } 
})

router.get('/rating', async(req, res) => {
    const {id} = req.query;
    const review = await Review.findOne({_id: id});
    const pieces = await Review.find({piece: review.piece})
    const ratingPieces = pieces.map(elem => elem.rating)
    const currRating = ratingPieces.reduce((acc, curr) => acc+=curr);
    const avarageRating = currRating/ratingPieces.length;
    return res.send(avarageRating.toFixed(2))
})

module.exports = router;