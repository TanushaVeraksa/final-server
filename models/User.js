const {Schema, model} = require("mongoose");

const User = new Schema({
    email: {type: String},
    name: {type: String, required: true},
    password: {type: String},
    role: {type: String, default: 'User'},
    block: {type: String, default: "Unblock"},
    accountId: {type: String},
    provider: {type: String},
})

module.exports = model('User', User);