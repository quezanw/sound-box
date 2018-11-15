const mongoose = require('../config/mongoose');

let ModelSchema = new mongoose.Schema({
    
}, {timestamps: true});

module.exports = mongoose.model('Model', ModelSchema);