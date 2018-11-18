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

require('./server/config/routes.js')(app);

const server = app.listen(8888, () => { console.log('listening on port 8888'); });
const io = require('socket.io').listen(server);

io.on('connection', socket => { 
    console.log('user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected')
    });

    socket.on('message', message => {
        console.log("Message received: " + message);
        io.emit('message', {type: 'new-message', text: message});
    });

    socket.on('join', room => {
        console.log("Joining room " + room);
        socket.join(room);
        socket.broadcast.to(room).emit('room message', 'Someone has entered the room!');
    });
});
