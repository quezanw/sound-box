const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb://localhost/sound_box',
    {useNewUrlParser: true},
);

module.exports = mongoose;