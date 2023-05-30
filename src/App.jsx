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

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onAddTask(newTask) {
      setTasks((tasks) => [...tasks, newTask]);
    }

    function onDeleteTask(uuid) {
      setTasks((tasks) => tasks.filter((task) => task.uuid !== uuid));
    }

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('add-task', onAddTask);
    socket.on('delete-task', onDeleteTask);

    // Clean up the event listeners when the component unmounts
    // (prevents duplicate event registration)
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('add-task', onAddTask);
      socket.off('delete-task', onDeleteTask);
    };
  }, []);

  function handleAddTask(content) {
    console.log('adding task:');
    console.log(content);
    // socket.emit('add-task', content);
  }

  function handleDeleteTask(uuid) {
    socket.emit('delete-task', uuid);
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
          />
        ))}
      </Board>
    </main>
  );
};

export default App;
