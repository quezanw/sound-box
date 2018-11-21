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
            if (!room.user.display_name) {
                room.user = {display_name: "Anonymous", images: [{url: "https://developer.spotify.com/assets/branding-guidelines/icon3@2x.png"}]};
            }
            console.log("User", room.user.display_name, "is joining room " + room.room_name);
            socket.join(room.room_name);
            let refresh_token = '';
            let currentRoom = {}
            for (let roomJoined of rooms) {
                if (roomJoined.name == room.room_name) {
                    roomJoined.members.push(room.user);
                    currentRoom = roomJoined;
                    refresh_token = roomJoined.host_refresh_token;
                }
            }
            io.emit('show_rooms', rooms);
            io.to(room.room_name).emit('room_joined', {
                room_name: room.room_name, 
                users: currentRoom.members,
                queue: currentRoom.queue,
                refresh_token: refresh_token
            });

            // adding a song to the queue
            socket.on('add_song', song => {
                currentRoom = {}
                for (let roomJoined of rooms) {
                    if (roomJoined.name == room.room_name) {
                        roomJoined.queue.push({info: song, upvotes: 0});
                        currentRoom = roomJoined;
                        refresh_token = roomJoined.host_refresh_token;
                    }
                }
                io.to(room.room_name).emit('song_queue', currentRoom.queue);
            })

            // upvoting a song
            socket.on('upvote', (song) => {
                console.log("Server is upvoting song");
                io.to(room.room_name).emit('song_upvoted', song);
            })
        });
    });
}