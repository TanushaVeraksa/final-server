const Router = require('express');
const router = new Router();
const Comment = require('../models/Comment');
const User = require('../models/User');

router.get('/get-comment', async(req, res) => {
    // const {curr, reviewId, userEmail} = req.query;
    // const comments = await Comment.find({reviewId: reviewId});
    // if(curr) {
    //     console.log(comments.length, curr.length)
    //     if(comments.length !== curr.length) {
    //         const {data} = await Comment.find({reviewId: reviewId}).sort({_id:-1}).limit(1);
    //         // if(userEmail !== data.userEmail) {
    //         //     return res.send(data);
    //         // }
    //     }
    // }
})

router.post('/new-comment', async(req, res) => {
    const {message, userEmail, reviewId} = req.body;
    const comment = new Comment({message: message, userEmail: userEmail, reviewId: reviewId});
    await comment.save(); 
    return res.send(comment)
})

router.get('/review', async(req, res) => {
    const {reviewId} = req.query;
    const comments = await Comment.find({reviewId: reviewId})
    return res.send(comments)
})

module.exports = router;