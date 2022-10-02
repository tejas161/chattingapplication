const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const dotenv = require('dotenv');
const path = require("path");

app.use(cors());
app.use(router);
dotenv.config({path:'./config.env'});
const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'Admin', text: `${user.name}, Welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

if ( process.env.NODE_ENV == "production"){

  

   

  app.get('/', (req, res) => {
      app.use(express.static(path.resolve(__dirname,'client','build')));
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

  })


}

server.listen(PORT, () => console.log(`Server has started.`));