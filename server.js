const express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    request = require('request'),
    cors = require('cors'),
    querystring = require('querystring'),
    cookieParser = require('cookie-parser');

app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .use(express.static(path.join(__dirname, './public/dist/public')))
    .use(cors())
    .use(cookieParser());

require('./server/config/routes.js')(app);

app.listen(8888, ()=> {
    console.log('listening on port 8888');
});