const Router = require('express');
const router = new Router();
const Comment = require('../models/Comment');
const User = require('../models/User');
const events = require('events');

const emitter = new events.EventEmitter();

router.get('/get-comment', async(req, res) => {
    emitter.once('newMessage', (comment)=> {
        res.json(comment)
    })
})

router.post('/new-comment', async(req, res) => {
    const {message, email, reviewId} = req.body;
    const comment = new Comment({message: message, userEmail: email, reviewId: reviewId});
    await comment.save();
    emitter.emit('newMessage', {message: message, userEmail: email, reviewId: reviewId}) 
    res.status(200);
})

router.get('/review', async(req, res) => {
    const {reviewId} = req.query;
    const comments = await Comment.find({reviewId: reviewId})
    return res.send(comments)
})

module.exports = router;