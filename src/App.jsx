import React, { useState, useEffect } from 'react';
import { socket } from './socket';

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [tasks, setTasks] = useState([]);
  /**
   *  [
   *     {
   *      uuid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', <<--- unique id for task
   *      content: "Finish cleaning the house", <<--- content
   *      author: "Josh" <<---- socket.id
   *     }
   *
   *
   *  ]
   */

  const [input, setInput] = useState('');

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onReceiveTask(newTask) {
      console.log('STORAGE from onReceiveTask', newTask[0]);
      setTasks((tasks) => [...tasks, newTask[0]]);
    }

    function onDeleteTask(obj) {
      console.log("UPDATED STORAGE after deleting", obj[0])
      setTasks((tasks) => tasks.filter((task) => task.uuid !== obj[0].uuid));
    }

    function onNext(storage){
      console.log("UPDATED STORAGE after clicking next", storage[0])
    }

    function onPrevious(storage){
      console.log("UPDATED STORAGE after clicking previous", storage[0])
    }

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('add-task', onReceiveTask);
    socket.on('delete-task', onDeleteTask);
    socket.on('next', onNext);
    socket.on('previous', onPrevious);

    // Clean up the event listeners when the component unmounts
    // (prevents duplicate event registration)
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('add-task', onReceiveTask);
      socket.off('delete-task', onDeleteTask);
      socket.off('next', onNext);
      socket.off('previous', onPrevious);
    };
  }, []);

  function handleClick() {
    socket.emit('add-task', input);
  }

  function handleDelete(uuid) {
    socket.emit('delete-task', uuid);
  }

  function handleNext(uuid) {
    socket.emit('next', uuid)
  }

  function handlePrevious(uuid) {
    socket.emit('previous', uuid)
  }

  return (
    <>
      <div>App</div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleClick}>BUTTON</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.content}
            <button onClick={() => handleDelete(task.uuid)}>x</button>
            <button onClick={() => handleNext(task.uuid)}>Next</button>
            <button onClick={() => handlePrevious(task.uuid)}>Previous</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;