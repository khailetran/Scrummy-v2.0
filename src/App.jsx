import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import styled from 'styled-components';
import Column from './components/Column';

const Title = styled.div`
  color: blue;
  background-color: lightblue;
  padding: 3em;
`;

const Board = styled.div`
  border: 1px solid black;
  background-color: lightblue;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const HEADERS = ['TO DO', 'IN PROGRESS', 'COMPLETE', 'DONE'];

const MOCK_DATA = [
  [
    { uuid: 0, author: 'anna', content: 'make styled components work' },
    { uuid: 1, author: 'scott', content: 'create mock data' },
  ],
  [{ uuid: 2, author: 'josh', content: 'make backend' }],
  [],
  [{ uuid: 3, author: 'derek', content: 'make backend with josh' }],
];

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [tasks, setTasks] = useState(MOCK_DATA);

  const [input, setInput] = useState('');

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

  function handleClick() {
    socket.emit('add-task', input);
  }

  function handleDelete(uuid) {
    socket.emit('delete-task', uuid);
  }

  return (
    <>
      <Title>App</Title>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleClick}>BUTTON</button>
      <Board>
        {tasks.map((columnTasks, i) => (
          <Column
            key={`col_${i}`}
            header={HEADERS[i]}
            columnTasks={columnTasks}
          />
        ))}
      </Board>
    </>
  );
};

export default App;
