const {Schema, model, ObjectId} = require("mongoose");

const Comment = new Schema({
    message: {type: String, required: true, unique: true},
    userId: {type: ObjectId, ref: 'User'}
})

module.exports = model('Comment', Comment);