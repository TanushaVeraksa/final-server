const Router = require('express');
const router = new Router();
const Review = require('../models/Review');
const Comment = require('../models/Comment');

router.get('/', async(req, res) => {
    const {searchString} = req.query;
    const searchReview = await Review.find({$text: {$search: searchString}});
    const searchComment = await Comment.find({$text: {$search: searchString}});
    const idFromComment = [];
    if(searchComment) {
        searchComment.forEach(elem => {
            idFromComment.push(elem.reviewId);
        })
    }
    let uniq = Array.from(new Set(idFromComment));
    let reviewComments = []
    if(uniq) {
        reviewComments = await Review.find({_id: [...uniq]});
    }
    return res.send(searchReview.concat(reviewComments))
})

module.exports = router;