module.exports = server => {
    const io = require('socket.io').listen(server);
  
    // var room_names = {};
    var rooms = [];

    io.on('connection', socket => { 
        console.log('user connected');
        
        socket.on('disconnect', () => {
            console.log('user disconnected')
        });
    
        io.emit('show_rooms', rooms);

        socket.on('add_room', room => {
            console.log("Creating room", room.name);
            // room_names[room.name] = room.name;
            rooms.push(room);
            io.emit('show_rooms', rooms);
        });

        // joining a room
        socket.on('join', room => {
            console.log("User", room.user, "is joining room " + room.room_name);
            socket.join(room.room_name);
            let refresh_token = '';
            for (let roomJoined of rooms) {
                if (roomJoined.name == room.room_name) {
                    roomJoined.members++;
                    refresh_token = roomJoined.host_refresh_token;
                }
            }
            io.emit('show_rooms', rooms);
            io.to(room.room_name).emit('room_joined', {room_name: room.room_name, user: room.user, refresh_token: refresh_token});

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