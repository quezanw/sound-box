const express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    cookieParser = require('cookie-parser');
    session = require('express-session');

app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    // .use(express.static(path.join(__dirname, './static')))
    .use(express.static(path.join(__dirname, './public/dist/public')))
    .use(cors())
    .use(cookieParser())
    .use(session({secret: 'something_secret', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 }}));

require('./server/config/routes.js')(app);

app.listen(8888, ()=> {
    console.log('listening on port 8888');
});