const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.routes');
const checkRouter = require('./routes/check.routes');
const reviewRouter = require('./routes/review.routes');
const pieceRouter = require('./routes/piece.routes');
const personalRouter = require('./routes/personal.routes');
const bodyParser = require('body-parser');
const Comment = require('../models/Comment');
const jsonParser = bodyParser.json();
const cors = require("cors");
const authMiddleware = require('./middleware/auth.middleware');
const commentRouter = require('./routes/comment.routes');
const events = require('events');

const emitter = new events.EventEmitter();

const app = express();

app.use(cors());

const corsOptions = {
    origin: 'https://final-client-livid.vercel.app',
    optionsSuccessStatus: 200 
}

const port = 5000;
const url = 'mongodb+srv://veraksa161:vlu2Otgeq0D7nM2o@cluster0.1lxltk8.mongodb.net/?retryWrites=true&w=majority';

app.use(express.json())
app.use('/api/auth', authRouter);
app.use('/api/user', authMiddleware, checkRouter);
app.use('/api/review', jsonParser, reviewRouter);
app.use('/api/piece', jsonParser, pieceRouter);
app.use('/api/personal', jsonParser, personalRouter);
//app.use('/api/comment', commentRouter);

app.get('/api/comment/get-comment', cors(corsOptions), async(req, res) => {
    emitter.once('newMessage', (comment)=> {
        res.json(comment)
    })
})

app.post('/api/comment/new-comment', cors(corsOptions), async(req, res) => {
    const {message, userEmail, reviewId} = req.body;
    const comment = new Comment({message: message, userEmail: userEmail, reviewId: reviewId});
    await comment.save();
    emitter.emit('newMessage', {message: message, userEmail: userEmail, reviewId: reviewId}) 
    res.status(200);
})

const start = async() => {
    try{
        await mongoose.connect(url);
        app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
    } catch(e) {
        console.dir(e)
    }
}

start();