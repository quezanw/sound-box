module.exports = server => {
    const io = require('socket.io').listen(server);
  
    var rooms = {};

    io.on('connection', socket => { 
        console.log('user connected');
        
        socket.on('disconnect', () => {
            console.log('user disconnected')
        });
    
        io.emit('show_rooms', rooms);

        socket.on('add_room', room_name => {
            console.log("Creating room", room_name);
            rooms[room_name] = room_name;
            io.emit('show_rooms', rooms);
        });

        // joining a room
        socket.on('join', room => {
            console.log("Joining room " + room);
            socket.join(room);
            socket.broadcast.to(room).emit('room message', 'Someone has entered the room!');

            // adding a song to the queue
            socket.on('add_song', song => {
                console.log("Adding song");
                io.to(room).emit('song_queue', song);
            })

            // upvoting a song
            socket.on('upvote', (song) => {
                console.log("Server is upvoting song");
                io.to(room).emit('song_upvoted', song);
            })
        });
    });
}