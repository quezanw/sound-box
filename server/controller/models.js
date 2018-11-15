const Model = require('../models/model'),
    path = require('path');

module.exports = {
    angular: (req, res) => {
        res.sendFile(path.resolve('./public/dist/public/index.html'));
    }
}