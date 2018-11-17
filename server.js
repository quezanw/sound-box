const express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    // .use(express.static(path.join(__dirname, './static')))
    .use(express.static(path.join(__dirname, './public/dist/public')))
    .use(cors({origin: ["http://localhost:8888"], credentials: true}))
    .use(cookieParser())
    .use(session({
        secret: 'something_secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }));

require('./server/config/routes.js')(app);

const server = app.listen(8888, () => { console.log('listening on port 8888'); });
const socket = require('socket.io')(server);

io.on('connection', function (socket) { //2
  
    socket.emit('greeting', { msg: 'Greetings, from server Node, brought to you by Sockets! -Server' }); //3
    socket.on('thankyou', function (data) { //7
      console.log(data.msg); //8 (note: this log will be on your server's terminal)
    });
      
  });