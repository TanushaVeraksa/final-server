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
const passport = require('passport');
const instagramRoutes = require('./routes/instagram.routes');
const githubRoutes = require('./routes/github.routes');
const session = require('express-session');

const app = express();

app.use(
    cors({
      origin: "*",
      methods: "GET,POST",
      allowedHeaders: "Content-Type,Authorization",
      credentials: true,
      preflightContinue: true,
    })
  );

app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: 'secret',
    })
  );

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

const port = 5000;
const url = 'mongodb+srv://veraksa161:vlu2Otgeq0D7nM2o@cluster0.1lxltk8.mongodb.net/?retryWrites=true&w=majority';

app.use(express.json())
app.use('/api/auth', authRouter);
app.use('/api/user', authMiddleware, checkRouter);
app.use('/api/review', jsonParser, reviewRouter);
app.use('/api/piece', jsonParser, pieceRouter);
app.use('/api/personal', jsonParser, personalRouter);
app.use('/api/comment', jsonParser, commentRouter);
app.use('/api/github', jsonParser, githubRoutes);

const start = async() => {
    try{
        await mongoose.connect(url);
        app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
    } catch(e) {
        console.dir(e)
    }
}

start();