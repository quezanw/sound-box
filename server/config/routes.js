const controller = require('../controller/users');

module.exports = app => {
    app.get('/login', controller.login);
    app.get('/callback', controller.callback);
    app.get('/get_song/:name/:refresh_token', controller.get_song);
    app.put('/play_song', controller.play_song);
    app.all('*', controller.angular);
}