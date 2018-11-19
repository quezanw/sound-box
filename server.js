const express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    cookieParser = require('cookie-parser');

app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    // .use(express.static(path.join(__dirname, './static')))
    .use(express.static(path.join(__dirname, './public/dist/public')))
    .use(cors({origin: ["http://localhost:8888"], credentials: true}))
    .use(cookieParser());

require('./server/config/routes')(app);

const server = app.listen(8888, () => { console.log('listening on port 8888'); });
require('./sockets')(server);