const { Server } = require("socket.io");
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const formatMessage = require('./db/messages');
const {
  userJoin,
  userLeave,
  getRoomUsers
} = require('./db/users');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

const botName = 'Server Bot';

io.on('connection', socket => {
  console.log('connected ' + socket.id)
  // При подключении юзера
  socket.on('join_room', (username, room) => {
    const user = userJoin(socket.id, username, room);

    console.log(user.username + " -- " + user.room)
    socket.join(user.room);

    // Приветствие юзера в комнате
    socket.emit('send_message', formatMessage(botName, `Welcome to Chat: ${room}`));

    socket.emit('get_room', room)

    socket.broadcast
      .to(user.room)
      .emit(
        'send_message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Отправляет юзеров из конкретной комнаты
    io.to(user.room).emit('room_users', getRoomUsers(user.room));
  });

  // Ждет получения сообщения
  socket.on('receive_message', msg => {
    console.log(msg)
    io.to(msg.room).emit('send_message', formatMessage(msg.username, msg.text, msg.room));
  });

  // Запускается когда юзер отключается от сокета
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'send_message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Отправляет юзеров из конкретной комнаты
      io.to(user.room).emit('room_users', getRoomUsers(user.room));
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));