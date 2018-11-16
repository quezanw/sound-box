const mongoose = require('../config/mongoose');

let UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    spotify_id: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);