const {Schema, model} = require("mongoose");

const User = new Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'User'},
    block: {type: String, default: "Unblock"},
})

module.exports = model('User', User);