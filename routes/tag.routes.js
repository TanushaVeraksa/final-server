const Router = require('express');
const router = new Router();
const Review = require('../models/Review');
const User = require('../models/User');

router.get('/', async(req, res) => {
    const tags = [];
    const review = await Review.find({})
    review.forEach(elem => {
        tags.push([...elem.tag])
    })
    const countTags = tags.flat().reduce((acc, el) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {})
    
    const result = [];
    for(let k in countTags) {
        result.push({value: k, count: countTags[k]})
    }
    return res.send(result)
})

router.get('/review-tag', async(req, res) => {
    const {tags} = req.query;
    const review = await Review.find({tag: { $all: tags }})
    return res.send(review)
})

router.get('/count-likes', async(req, res) => {
    const {id} = req.query;
    const review = await Review.findOne({_id: id});
    const user = await User.findOne({_id: review.userId});
    const reviews = await Review.find({userId: user._id});
    const counlLikes = reviews.reduce((acc, curr) => acc += curr.likes.length, 0);
    return res.send({userName: user.name, countLikes: counlLikes});
})

module.exports = router;