const Review = require('../models/Review');
const Router = require('express');
const router = new Router();

router.get('/:id', async(req, res) => {
    const {group, dateCreation, grade} = req.query;
    const {id} = req.params;
    let reviews;
    if(!group && !dateCreation && !grade) {
        reviews = await Review.find({userId: id});
    }
    if(!group && !dateCreation && grade) {
        reviews = await Review.find({userId: id}).sort({grade: grade}); //asc, desc
    }
    if(!group && dateCreation && !grade) {
        reviews = await Review.find({userId: id}).sort({dateCreation: dateCreation}); //asc, desc
    }
    if(group && !dateCreation && !grade) {
        reviews = await Review.find({userId: id, group: group});
    }
    if(group && dateCreation && !grade) {
        reviews = await Review.find({userId: id, group: group}).sort({dateCreation: dateCreation});
    }
    if(group && !dateCreation && grade) {
        reviews = await Review.find({userId: id, group: group}).sort({grade: grade});
    }
    if(!group && dateCreation && grade) {
        reviews = await Review.find({userId: id}).sort({dateCreation: dateCreation, grade: grade});
    }
    if(group && dateCreation && grade) {
        reviews = await Review.find({userId: id, group: group}).sort({dateCreation: dateCreation, grade: grade});
    }
    return res.send(reviews)
})

module.exports = router;