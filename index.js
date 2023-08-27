const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.routes');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const port = 5000;
const url = 'mongodb+srv://veraksa161:vlu2Otgeq0D7nM2o@cluster0.1lxltk8.mongodb.net/?retryWrites=true&w=majority';

app.use('/api/auth', jsonParser, authRouter)
app.get('/api/auth', (req, res) => {
    res.send({message: "Hello"})
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