const express = require('express');
const mongoose = require('mongoose')
const config = require('config');

const app = express();

const port = config.get('port') || 5000;

app.get('/', (req, res) => res.send('Home Page Route'));

const start = async() => {
    try{
        await mongoose.connect(config.get('dbUrl'));
        app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
    } catch(e) {
        console.dir(e)
    }
}

start();