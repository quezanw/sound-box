module.exports = server => {
    const io = require('socket.io').listen(server);

    try {
        io.on('connection', socket => { 
            console.log('user connected');
            
            try {
                socket.on('disconnect', () => {
                    console.log('user disconnected')
                });
            } catch (e) {
                console.log("Error on disconnect");
                console.log(e);
            }
        
            try {
                socket.on('message', message => {
                    console.log("Message received: " + message);
                    try {
                        io.emit('message', {type: 'new-message', text: message});
                    } catch (e) {
                        console.log("Error emitting message from server");
                        console.log(e);
                    }
                });
            } catch (e) {
                console.log("Server error with message");
                console.log(e)
            }
        
            try {
                socket.on('join', room => {
                    console.log("Joining room " + room);
                    try {
                        socket.join(room);
                        try {
                            socket.broadcast.to(room).emit('room message', 'Someone has entered the room!');
                        } catch (e) {
                            console.log("Error emitting message to room");
                            console.log(e);
                        }
                    } catch (e) {
                        console.log("error joining soon in server");
                        console.log(e);
                    }
        
                });
            } catch (e) {
                console.log("Server error with join");
                console.log(e);
            }
        });
    } catch (e) {
        console.log("Error connecting to socket");
        console.log(e);
    }
}