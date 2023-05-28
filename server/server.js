const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.Server(app);
const io = socketIO(server, {
  pingTimeout: 1000, // how many ms without a pong packet to consider the connection closed
  pingInterval: 5000 // how many ms before sending a new ping packet
});

//temp storage to store tasks
let storage = [[], [], [], []]

//list of names
let anonNames = ['alligator', 'anteater', 'armadillo', 'auroch', 'axolotl', 'badger', 'bat', 'bear', 'beaver',
  'blobfish', 'buffalo', 'camel', 'chameleon', 'cheetah', 'chipmunk', 'chinchilla', 'chupacabra', 'cormorant',
  'coyote', 'crow', 'dingo', 'dinosaur', 'dog', 'dolphin', 'dragon', 'duck', 'octopus', 'elephant', 'ferret',
  'fox', 'frog', 'giraffe', 'goose', 'gopher', 'grizzly', 'hamster', 'hedgehog', 'hippo', 'hyena', 'jackal',
  'jackalope', 'ibex', 'ifrit', 'iguana', 'kangaroo', 'kiwi', 'koala', 'kraken', 'lemur', 'leopard', 'liger',
  'lion', 'llama', 'manatee', 'mink', 'monkey', 'moose', 'narwhal', 'nyan cat', 'orangutan', 'otter', 'panda',
  'penguin', 'platypus', 'python', 'pumpkin', 'quagga', 'quokka', 'rabbit', 'raccoon', 'rhino', 'sheep', 'shrew',
  'skunk', 'squirrel', 'tiger', 'turtle', 'unicorn', 'walrus', 'wolf', 'wolverine', 'wombat'];

// anon names storage object
const anonNamesObj = new Map();

// generate unique anon name from anonNames
const generateUniqueAnonName = () => {
  let isUnique = false;
  let anonName;

  while (!isUnique) {
    // generate a random anonName
    anonName = anonNames[Math.floor(Math.random() * anonNames.length)];

    // check if the generated anonName is already assigned
    let isNameAssigned = false;
    for (const assignedAnonName of anonNamesObj.values()) {
      if (assignedAnonName === anonName) {
        isNameAssigned = true;
        break;
      }
    }

    // exit loop if name has not already been assigned
    if (!isNameAssigned) {
      isUnique = true;
    }
  }

  return anonName;
};

// Serve static files in the /dist folder
app.use('/', express.static(path.join(__dirname, '../dist')));
app.get('/', (req, res) => res.sendFile(__dirname, '../dist/index.html'));

// SocketIO listeners
// socket refers to the client
// io refers this server
io.on('connection', (socket) => {
  console.log(`A client has connected! ${socket.id}`);

  // client disconnection
  socket.on('disconnect', () => {
    console.log(`A client has disconnected! ${socket.id}`);
  });

  // Listener for the 'greeting-from-client'
  socket.on('add-task', (content) => {
    // Assign a unique id for the task
    // Assign an author for the task
    const uuid = uuidv4();

    let anonName;

    // Check if anonName is already assigned for the current socket.id
    if (anonNamesObj.has(socket.id)) {
      anonName = anonNamesObj.get(socket.id);
    } else {
      // Generate a random anon name for the current socket.id
      anonName = generateUniqueAnonName();
      // Store the anonName for the current socket.id
      anonNamesObj.set(socket.id, anonName);
    }

    //store it to the first index of storage (TO DO column)
    storage[0].push({ author: socket.id, content, uuid: uuid, anonName: anonName });
    io.emit('add-task', [{ author: socket.id, content, uuid: uuid, storage: storage, anonName: anonName }]);
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
