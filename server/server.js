const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

// Serve static files in the /dist folder
app.use('/', express.static(path.join(__dirname, '../dist')));
app.get('/', (req, res) => res.sendFile(__dirname, '../dist/index.html'));

// SocketIO listeners
// socket refers to the client
// io refers this server
io.on('connection', (socket) => {
  console.log(`A client has connected! ${socket.id}`);

  // Sends information to ALL clients that are connects
  socket.emit('greeting-from-server', {
    greeting: 'Hello Client',
  });

  // Listener for the 'greeting-from-client'
  socket.on('greeting-from-client', (message) => {
    // USER apsdofkasdpofk: "whatever the message was"
    io.emit('receive-message', `${socket.id} has sent ${message}`);
  });
});

server.listen(3000, () => console.log('The server is running at port 3000'));
