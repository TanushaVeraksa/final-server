const {Schema, model, ObjectId} = require("mongoose");

const Comment = new Schema({
    img: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    rating: [{type: Number, default: 0}],
    likes: {type: Number, default: 0},
    hours: {type: Number, default: 0},
    release: {type: Number},
    dateCreation: {type: Number},
    genre: {type: String},
    commentId: [{type: ObjectId, ref: 'Comment'}],
    userId: {type: ObjectId, ref: 'User'}
})

module.exports = model('Comment', Comment);