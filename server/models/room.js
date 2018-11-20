const mongoose = require('../config/mongoose');
const UserSchema = require('./user');

let RoomSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2},
    users: [UserSchema.UserSchema],
    password: {type: String, required: true, minlength: 4},
    host_token: {type: String}
}, {timestamps: true});

module.exports = mongoose.model('Room', RoomSchema);