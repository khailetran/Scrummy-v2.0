import React, { useState, useEffect } from 'react';
import { socket } from './socket';

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
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

    function onReceiveMessage(newMessage) {
      console.log('onReceiveMessage', newMessage);
      setMessages((messages) => [...messages, newMessage]);
    }

    function onDeleteMessage(uuid) {
      setMessages((messages) => messages.filter((message) => message.uuid !== uuid));
    }

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('add-task', onReceiveMessage);
    socket.on('delete-task', onDeleteMessage);

    // Clean up the event listeners when the component unmounts
    // (prevents duplicate event registration)
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('add-task', onReceiveMessage);
      socket.off('delete-task', onDeleteMessage);
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
      <div>App</div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleClick}>BUTTON</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.content}
            <button onClick={() => handleDelete(message.uuid)}>x</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
