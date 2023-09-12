const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.routes');
const checkRouter = require('./routes/check.routes');
const reviewRouter = require('./routes/review.routes');
const pieceRouter = require('./routes/piece.routes');
const personalRouter = require('./routes/personal.routes');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cors = require("cors");
const authMiddleware = require('./middleware/auth.middleware');
const commentRouter = require('./routes/comment.routes');

const app = express();

// const corsOptions ={
//     origin:'*', 
//     // credentials:true,            //access-control-allow-credentials:true
//     // optionSuccessStatus:200
// }
// app.use(cors(corsOptions));

const port = 5000;
const url = 'mongodb+srv://veraksa161:vlu2Otgeq0D7nM2o@cluster0.1lxltk8.mongodb.net/?retryWrites=true&w=majority';

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json())
app.use('/api/auth', authRouter);
app.use('/api/user', authMiddleware, checkRouter);
app.use('/api/review', jsonParser, reviewRouter);
app.use('/api/piece', jsonParser, pieceRouter);
app.use('/api/personal', jsonParser, personalRouter);
app.use('/api/comment', jsonParser, commentRouter);

const start = async() => {
    try{
        await mongoose.connect(url);
        app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
    } catch(e) {
        console.dir(e)
    }
}

start();