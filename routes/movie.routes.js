const Router = require('express');
const router = new Router();
const Movie = require('../models/Movie');
const cloudinary = require('cloudinary').v2
          
cloudinary.config({ 
  cloud_name: 'dshdtks2s', 
  api_key: '262578943786447', 
  api_secret: 'v0wxs4Z44mTGCoG_wlNqwJJTbZA' 
});


router.get('/', async(req, res) => {
    const movies = await Movie.find({});
    return res.send(movies);
})


router.post('/create', async(req, res) => {
    const date = new Date();
    const currentDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    const {img, title, description, rating, likes, hours, release, genre, userId} = req.body;
    try {
        const cloud = await cloudinary.uploader.upload(img);
        if(img.length === 0 || title.length === 0 || description.length === 0) {
            return res.status(400).json({message: 'This field cannot be empty'});
        }
        const movie = new Movie(
            {img: cloud.url, title, description, rating, likes, hours, release, dateCreation: currentDate, genre, userId});
        await movie.save();
        return res.status(500).send({message: 'Movie was created', result: cloud})

    } catch(e) {
        console.log(e)
        return res.status(500).send({message: 'failure', error: e})
    }
})

router.get('/:id', async(req,res) => {
    
})

module.exports = router;