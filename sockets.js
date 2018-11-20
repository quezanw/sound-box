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
        
            // joining a room
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

            // adding a song to the queue
            try {
                socket.on('add_song', song => {
                    console.log("Adding song");
                    console.log(song['room'])
                    try {
                        io.to(song['room']).emit('song_queue', song['song']);
                    } catch (e) {
                        console.log("error broadcasting song in server");
                        console.log(e);
                    }
                    // try {
                    //     io.to()
                    // } catch (e) {
                    //     console.log("error broadcasting song in server");
                    //     console.log(e);
                    // }
                })
            } catch (e) {
                console.log("error adding song in server");
                console.log(e);
            }
        });
    } catch (e) {
        console.log("Error connecting to socket");
        console.log(e);
    }
}