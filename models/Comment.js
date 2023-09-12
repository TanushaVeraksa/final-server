const {Schema, model, ObjectId} = require("mongoose");

const Comment = new Schema({
    message: {type: String},
    userEmail: {type: String, required: true},
    reviewId: {type: ObjectId, ref: 'Review'}
})

module.exports = model('Comment', Comment);