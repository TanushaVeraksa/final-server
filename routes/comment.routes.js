const Router = require('express');
const router = new Router();
const Comment = require('../models/Comment');
const User = require('../models/User');
const events = require('events');

const emitter = new events.EventEmitter();

// router.get('/get-comment', async(req, res) => {
//     emitter.once('newMessage', (comment)=> {
//         res.json(comment)
//     })
// })

// router.post('/new-comment', async(req, res) => {
//     const {message, userEmail, reviewId} = req.body;
//     const comment = new Comment({message: message, userEmail: userEmail, reviewId: reviewId});
//     await comment.save();
//     emitter.emit('newMessage', {message: message, userEmail: userEmail, reviewId: reviewId}) 
//     res.status(200);
// })



router.get('/connect', async(req, res) => {
   res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cashe'
   })
   emitter.on('newMessage', (message) => {
    res.write(`data: ${JSON.stringify(message)} \n\n`)
   })
})

router.post('/new-comment', async(req, res) => {
    const {message, userEmail, reviewId} = req.body;
    const comment = new Comment({message: message, userEmail: userEmail, reviewId: reviewId});
    await comment.save();
    emitter.emit('newMessage', {message: message, userEmail: userEmail, reviewId: reviewId}) 
    res.status(200);
})

router.get('/review', async(req, res) => {
    const {reviewId} = req.query;
    const comments = await Comment.find({reviewId: reviewId})
    return res.send(comments)
})

module.exports = router;