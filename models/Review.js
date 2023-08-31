const {Schema, model, ObjectId} = require("mongoose");

const Review = new Schema({
    title: {type: String, required: true},
    piece: {type: String, required: true},
    group: {type: String, required: true},
    tag: [{type: String}],
    description: {type: String, required: true},
    grade: {type: Number, default: 0},
    rating: {type: Number, default: 0},
    likes: {type: Number, default: 0},
    img: {type: String, required: true},
    dateCreation: {type: String},
    commentId: [{type: ObjectId, ref: 'Comment'}],
    userId: {type: ObjectId, ref: 'User'},
})

module.exports = model('Review', Review);