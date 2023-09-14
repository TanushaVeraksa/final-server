const Router = require('express');
const router = new Router();
const Review = require('../models/Review');
const Piece = require('../models/Piece');
const Score = require('../models/Score');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dshdtks2s',
    api_key: '262578943786447',
    api_secret: 'v0wxs4Z44mTGCoG_wlNqwJJTbZA'
  });

const deleteImg = (publicId) => {
    cloudinary.uploader.destroy(publicId, function(error,result) {
        console.log(result, error) })
        .then(resp => console.log(resp))
        .catch(_err=> console.log("Something went wrong, please try again later."));
}

router.post('/destroyImg', async(req, res)=> {
    const {publicId} = req.body;
    deleteImg(publicId);
    return res.send('Image was destroyed')
})
          
router.get('/date', async(req, res) => {
    const reviews = await Review.find({}).sort({dateCreation: 'desc'}).limit(4);
    return res.send(reviews);
})

router.get('/rating', async(req, res) => {
    const reviews = await Review.find({}).sort({rating: 'desc'}).limit(4);
    return res.send(reviews);
})
router.post('/update', async(req, res) => {
    const {id, title, piece, group, tag, description, grade, img, publicId} = req.body;
    await Review.updateOne({_id: id}, { $set: {title: title, piece: piece, group: group, tag: tag, description: description, grade: grade, img: img, publicId: publicId}})
    const review = await Review.findOne({_id: id})
    return res.send(review);
})

router.post('/create', async(req, res) => {
    const date = new Date();
    const currentDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    const {title, piece, group, tag, description, grade, img, publicId, userId} = req.body;
    try {
        const review = new Review(
            {title, piece, group, tag, description, grade, img, publicId, dateCreation: currentDate, userId});
        const isPiece = await Piece.findOne({title: piece});
        if(isPiece) {
            await Piece.updateOne({title: piece}, { $push: { reviewId: review._id }})
        } else {
            const newPiece = new Piece({title: piece, reviewId: review._id})
            await newPiece.save();
        }
        await review.save();
        return res.send({review})

    } catch(e) {
        console.log(e)
        return res.status(500).send({message: 'failure', error: e})
    }
})

router.post('/delete', async(req, res) => {
    const {id} = req.body;
    await Review.deleteOne({_id: id});
    return res.send({message: 'Review was deleted'})
})

router.post('/likes', async(req, res) => {
    const {userId, reviewId} = req.body;
    const review = await Review.findOne({_id: reviewId});
    let flag = false;
    if(review.likes.includes(userId)) {
        flag = true;
    } 
    return res.send(flag)
})

router.post('/like', async(req, res) => {
    const {userId, reviewId} = req.body;
    const review = await Review.findOne({_id: reviewId});
    if(review.likes.includes(userId)) {
        await Review.updateOne({_id: reviewId}, { $pull: { likes: userId }})
    } else {
        await Review.updateOne({_id: reviewId}, { $push: { likes: userId }})
    }
    const updatedReview = await Review.findOne({_id: reviewId});
    return res.send(updatedReview)
})

router.post('/userlike', async(req, res) => {
    const {reviewId} = req.body;
    const review = await Review.findById({_id: reviewId});
    const userLike = review.likes.map((elem) => elem);
    const users = (await User.find({_id: [...userLike]})).map(elem => elem.email)
    return res.send(users);
})

const getRating = async(id) => {
    const score = await Score.find({reviewId: id});
    const review = await Review.findOne({_id: id});
    const grade = score.map((elem) => elem.grade).reduce((acc, curr) => acc += curr);
    const scoreItems = review.scoreId.length;
    const rating = grade / scoreItems;
    return rating.toFixed(2);
}

router.post('/rating', async(req, res) => {
    const {reviewId, userId, grade} = req.body;
    const checkScore = await Score.findOne({reviewId: reviewId});
    if(checkScore) {
    const checkUserScore = await Score.findOne({userId: userId, reviewId: reviewId});
        if(checkUserScore) {
            await Score.updateOne({reviewId: reviewId, userId: userId}, {grade: grade});
        } else {
            const newScore = await Score({userId, grade, reviewId});
            await newScore.save();
            await Review.updateOne({_id: reviewId}, {$push: {scoreId: newScore._id}});
        }
    } else {
        const newScore = await Score({userId, grade, reviewId});
        await newScore.save();
        await Review.updateOne({_id: reviewId}, {$push: {scoreId: newScore._id}});
    }
    const rating = await getRating(reviewId);
    await Review.updateOne({_id: reviewId}, {rating: rating});
    return res.send({message: 'Rating apdated'})
})

router.get('/:id', async(req,res) => {
    const {id} = req.params;
    const review = await Review.findById(id)
    return res.send(review)
})

router.post('/one', async(req, res) => {
    const {id} = req.body;
    const review = await Review.findById(id)
    return res.send(review)
})

router.post('/tags', async(req, res) => {
    const tags = [];
    const review = await Review.find({})
    review.forEach(elem => {
        tags.push([...elem.tag])
    })
    const uniqTags = Array.from(new Set(tags.flat()));
    return res.send(uniqTags)
})

module.exports = router;