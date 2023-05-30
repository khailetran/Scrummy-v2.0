import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import OnlineUsers from './components/OnlineUsers';
import CreateCard from './components/CreateCard';
import Column from './components/Column';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  background-color: #ffffff;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.05) 0.1em,
      transparent 0.1em
    ),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0.1em, transparent 0.1em);
  background-size: 0.7em 0.7em;
  border-bottom: 2px solid black;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-family: 'Abril Fatface', cursive;
  font-size: 2.2rem;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const HEADERS = ['To Do', 'In Progress', 'Complete', 'Reviewed'];

const MOCK_DATA = [
  [
    { uuid: 0, author: 'anna', content: 'make styled components work' },
    { uuid: 1, author: 'scott', content: 'create mock data' },
  ],
  [{ uuid: 2, author: 'josh', content: 'make backend' }],
  [],
  [{ uuid: 3, author: 'derek', content: 'make backend with josh' }],
];

const MOCK_ONLINE_USERS = ['aardvark', `goldfish`, `zebra`, `penguin`];
const MOCK_USER = 'aardvark';

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [tasks, setTasks] = useState(MOCK_DATA);
  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      // initialize:
      // username
      // allUsers
      // board state
    }

    function onDisconnect() {
      setIsConnected(false);
      // ?
    }

    function onUserConnected(username) {
      // add the user to allUsers
    }

    function onUserDisconnected(username) {
      // remove the user from allUsers
    }

    function onAddTask(newTask) {
      setTasks((tasks) => [...tasks, newTask]);
    }

    function onDeleteTask(uuid) {
      setTasks((tasks) => tasks.filter((task) => task.uuid !== uuid));
    }

    function onMoveTaskLeft(uuid) {
      // move the task left
    }

    function onMoveTaskRight(uuid) {
      // move the task right
    }

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('user-connected', onUserConnected);
    socket.on('user-disconnected', onUserDisconnected);
    socket.on('add-task', onAddTask);
    socket.on('delete-task', onDeleteTask);
    socket.on('move-task-left', onMoveTaskLeft);
    socket.on('move-task-right', onMoveTaskRight);

    // Clean up the event listeners when the component unmounts
    // (prevents duplicate event registration)
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('user-connected', onUserConnected);
      socket.off('user-disconnected', onUserDisconnected);
      socket.off('add-task', onAddTask);
      socket.off('delete-task', onDeleteTask);
      socket.off('move-task-left', onMoveTaskLeft);
      socket.off('move-task-right', onMoveTaskRight);
    };
  }, []);

  function handleAddTask(content) {
    console.log('adding task:');
    console.log(content);
    // socket.emit('add-task', content);
  }

  function handleDeleteTask(uuid) {
    console.log('deleting task:');
    console.log(uuid);
    // socket.emit('delete-task', uuid);
  }

  function handleMoveTaskLeft(uuid) {
    console.log('move task left');
  }

  function handleMoveTaskRight(uuid) {
    console.log('move task right');
  }

  return (
    <main>
      <Header>
        <Container>
          <Title>Scrummy</Title>
          <CreateCard handleAddTask={handleAddTask} />
        </Container>
        <OnlineUsers onlineUsers={MOCK_ONLINE_USERS} user={MOCK_USER} />
      </Header>
      <Board>
        {tasks.map((columnTasks, i) => (
          <Column
            key={`col_${i}`}
            header={HEADERS[i]}
            columnTasks={columnTasks}
            handleDeleteTask={handleDeleteTask}
            disableLeft={i === 0}
            disableRight={i === tasks.length - 1}
          />
        ))}
      </Board>
    </main>
  );
};

export default App;
