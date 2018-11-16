const controller = require('../controller/users');

module.exports = app => {
    app.get('/login', controller.login);
    app.get('/callback', controller.callback);
    app.get('/get_song/:name', controller.get_song);
    app.all('*', controller.angular);
}