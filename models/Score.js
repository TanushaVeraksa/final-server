const {Schema, model, ObjectId} = require("mongoose");

const Score = new Schema({
    userId: {type: ObjectId, ref: 'User'},
    grade: {type: Number, default: 0},
    reviewId: {type: ObjectId, ref: "Review"}
})

module.exports = model('Score', Score);