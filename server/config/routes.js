const controller = require('../controller/models');

module.exports = app => {
    app.get('/login', controller.login);
    app.get('/callback', controller.callback);
    app.all('*', controller.angular);
}