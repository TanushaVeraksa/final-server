const Router = require('express');
const router = new Router();
const Review = require('../models/Review');
const Piece = require('../models/Piece');
const Score = require('../models/Score');
const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dshdtks2s', 
  api_key: '262578943786447', 
  api_secret: 'v0wxs4Z44mTGCoG_wlNqwJJTbZA' 
});


router.get('/date', async(req, res) => {
    const reviews = await Review.find({}).sort({dateCreation: 'desc'}).limit(4);
    return res.send(reviews);
})

router.get('/rating', async(req, res) => {
    const reviews = await Review.find({}).sort({rating: 'desc'}).limit(4);
    return res.send(reviews);
})

router.post('/create', async(req, res) => {
    const date = new Date();
    const currentDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    const {title, piece, group, tag, description, grade, img, userId} = req.body;
    try {
        const cloud = await cloudinary.uploader.upload(img);
        if(img.length === 0 || title.length === 0 || group.length === 0) {
            return res.status(400).json({message: 'This field cannot be empty'});
        }

        const review = new Review(
            {title, piece, group, tag, description, grade, img: cloud.url, dateCreation: currentDate, userId});
        const isPiece = await Piece.findOne({title: piece});
        if(isPiece) {
            await Piece.updateOne({title: piece}, { $push: { reviewId: review._id }})
        } else {
            const newPiece = new Piece({title: piece, reviewId: review._id})
            await newPiece.save();
        }
        await review.save();
        return res.status(500).send({message: 'Review was created', result: cloud})

    } catch(e) {
        console.log(e)
        return res.status(500).send({message: 'failure', error: e})
    }
})

router.post('/likes', async(req, res) => {
    const {userId, reviewId} = req.body;
    const review = await Review.findOne({_id: reviewId});
    let flag = false;
    if(review.likes.includes(userId)) {
        flag = true;
    } 
    return res.send({flag: flag})
})

router.post('/like', async(req, res) => {
    const {userId, reviewId} = req.body;
    const review = await Review.findOne({_id: reviewId});
    if(review.likes.includes(userId)) {
        await Review.updateOne({_id: reviewId}, { $pull: { likes: userId }})
    } else {
        await Review.updateOne({_id: reviewId}, { $push: { likes: userId }})
    }
    return res.send({review})
})

const getRating = async(id) => {
    const score = await Score.find({reviewId: id});
    const review = await Review.findOne({_id: id});
    const grade = score.map((elem) => elem.grade).reduce((acc, curr) => acc += curr);
    const scoreItems = review.scoreId.length;
    const rating = grade / scoreItems;
    return rating;
}

router.post('/rating', async(req, res) => {
    const {reviewId, userId, grade} = req.body;
    const checkScore = await Score.findOne({reviewId: reviewId});
    if(checkScore) {
    const checkUserScore = await Score.findOne({userId: userId});
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

router.get('/personal', async(req, res) => {
    const {userId, rating, dateCreation, grade} = req.query;
    let reviews;
    if(!rating && !dateCreation && !grade) {
        reviews = await Review.find({userId: userId});
    }

    // const {userId, genre, rating, release, limit, page} = req.query;
    // let review;
    // let p = page || 1;
    // let l = limit || 8;
    // let offset = p * l - l;
    // if(!genre && !rating && !release) {
    //     movies = await Movie.find({userId: userId}).skip(offset).limit(l);
    // }
    // if(genre && rating && release) {
    //     movies = await Movie.find({userId: userId, genre: genre}).skip(offset).limit(l).sort({release: release, rating: rating}); 
    // }
    // if(genre && !rating && !release) {
    //     movies = await Movie.find({userId: userId, genre: genre}).skip(offset).limit(l); 
    // }
    // if(genre && !rating && release) {
    //     movies = await Movie.find({userId: userId, genre: genre}).skip(offset).limit(l).sort({release: release}); 
    // }
    // if(!genre  && rating && !release) {
    //     movies = await Movie.find({userId: userId}).skip(offset).limit(l).sort({rating: rating}); //asc, desc
    // }
    // if(!genre && !rating && release) {
    //     movies = await Movie.find({userId: userId}).skip(offset).limit(l).sort({release: release}); 
    // }
    // if(!genre && rating && release) {
    //     movies = await Movie.find({userId: userId}).skip(offset).limit(l).sort({release: release, rating: rating}); 
    // }
    // if(genre && rating && !release) {
    //     movies = await Movie.find({userId: userId, genre: genre}).skip(offset).limit(l).sort({rating: rating}); 
    // }
    return res.send({review})
})

router.get('/:id', async(req,res) => {
    const {id} = req.params;
    const movie = await Review.findById(id)
    return res.send({review})
})

module.exports = router;