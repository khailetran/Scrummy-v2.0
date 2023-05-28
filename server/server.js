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
  socket.on('next', (uuid) => {
    let foundTask = null;
    let foundColumnIndex;
    // find the task with the matching UUID and its current column index
    for (let i = 0; i < storage.length; i++) {
      // store current column 
      const column = storage[i];
      // store index if uuid is found
      const taskIndex = column.findIndex((task) => task.uuid === uuid);
      // if match was found and not in the last column...
      if (taskIndex !== -1 && i !== storage.length - 1) {
        // remove the task at the specified index from the column array
        foundTask = column.splice(taskIndex, 1)[0];
        foundColumnIndex = i;
        break;
      }
    }
    if (foundTask !== null) {
      // push foundTask into next column in storage
      storage[foundColumnIndex + 1].push(foundTask);
    }
    io.emit('next', [{ uuid: uuid, storage: storage }]);
  })

  //Listener for 'previous'
  socket.on('previous', (uuid) => {
    let foundTask = null;
    let foundColumnIndex;
    // find the task with the matching UUID and its current column index
    for (let i = 0; i < storage.length; i++) {
      // store current column 
      const column = storage[i];
      // store index if uuid is found
      const taskIndex = column.findIndex((task) => task.uuid === uuid);
      // if match was found and not in the first column...store result and column index
      if (taskIndex !== -1 && i !== 0) {
        // remove the task at the specified index from the column array
        foundTask = column.splice(taskIndex, 1)[0];
        foundColumnIndex = i;
        break;
      }
    }
    if (foundTask !== null) {
      // push foundTask into previous column in storage
      storage[foundColumnIndex - 1].push(foundTask);
    }
    io.emit('next', [{ uuid: uuid, storage: storage }]);
  })
});

server.listen(3000, () => console.log('The server is running at port 3000'));
