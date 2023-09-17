const {Schema, model, ObjectId} = require("mongoose");

const Comment = new Schema({
    message: {type: String},
    userName: {type: String, required: true},
    reviewId: {type: ObjectId, ref: 'Review'}
})

Comment.index({'$**': 'text'});

module.exports = model('Comment', Comment);