const {Schema, model, ObjectId} = require("mongoose");

const Piece = new Schema({
    title: {type: String, required: true},
    reviewId: [{type: ObjectId, ref: 'Review'}]
})

module.exports = model('Piece', Piece);