const controller = require('../controller/models');

module.exports = app => {
    app.all('*', controller.angular);
}