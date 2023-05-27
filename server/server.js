const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

//temp storage to store tasks
let storage = [[], [], [], []]

// Serve static files in the /dist folder
app.use('/', express.static(path.join(__dirname, '../dist')));
app.get('/', (req, res) => res.sendFile(__dirname, '../dist/index.html'));

// SocketIO listeners
// socket refers to the client
// io refers this server
io.on('connection', (socket) => {
  console.log(`A client has connected! ${socket.id}`);

  // Listener for the 'greeting-from-client'
  socket.on('add-task', (content) => {
    // Assign a unique id for the task
    // Assign an author for the task
    const uuid = uuidv4();
    //store it to the first index of storage (TO DO column)
    storage[0].push({ author: socket.id, content, uuid: uuid });
    io.emit('add-task', [{ author: socket.id, content, uuid: uuid, storage: storage }]);
    // `User ${socket.id} has sent ${content} and its uuid is ${uuidv4()}`);
  });

  //Listener for 'delete-message'
  socket.on('delete-task', (uuid) => {
    // update the storage when delete is fired
    storage = storage.map((column) => column.filter((task) => task.uuid !== uuid));
    io.emit('delete-task', [{ uuid: uuid, storage: storage }]);
  })

  //Listener for 'next'
  // socket.on('next', (uuid) => {


  // })

});









// io.on('connection', (socket) => {
//   console.log(`A client has connected! ${socket.id}`);

//   // Listener for the 'greeting-from-client'
//   socket.on('add-task', (content) => {
//     // Assign a unique id for the task
//     // Assign an author for the task
//     io.emit('add-task', {
//       author: socket.id,
//       content: [[content], [], [], []],
//       uuid: uuidv4(),
//       currColumn: 0,
//     });
//     // `User ${socket.id} has sent ${content} and its uuid is ${uuidv4()}`);
//   });

//   //Listener for 'delete-message'
//   socket.on('delete-task', (uuid) => {
//     io.emit('delete-task', uuid);
//   });

//   //Listener for 'right arrow'
//   socket.on('next-column', (currColumn) => {
//     if (currColumn <= 3) {
//       io.emit('next-column', {
//         currColumn: currColumn + 1,
//       });
//     }
//   });

//   //Listener for 'left arrow'
//   socket.on('previous-column', (author, content, uuid, currColumn) => {
//     if (currColumn === 0) {
//       Error('Cannot move column');
//     } else {
//       io.emit('previous-column', {
//         author,
//         content,
//         uuid,
//         currColumn: currColumn - 1,
//       });
//     }
//   });
// });

server.listen(3000, () => console.log('The server is running at port 3000'));
