
const express = require('express');

const app = express();
const http = require('http').createServer(app);


const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log(`Server is Up at ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

// importing setting socket 
const io = require('socket.io')(http);
const users = {};
io.on('connection', socket => {
    // console.log('Connected...');

    socket.on('new-user-joined', Uname => {
        users[socket.id] = Uname;
        socket.broadcast.emit('userJoined', Uname);

    });

    socket.on('sendMessage', msg => {
        socket.broadcast.emit('recieveMessage', msg);
    });

    socket.on('disconnect', Uname => {
        socket.broadcast.emit('userLeft', users[socket.id]);
        delete users[socket.id];
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});




