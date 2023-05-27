import React, { useState, useEffect } from 'react';
import { socket } from './socket';

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);

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
      setMessages(messages => [...messages, newMessage]);
    }

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive-message', onReceiveMessage);

    // Clean up the event listeners when the component unmounts
    // (prevents duplicate event registration)
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive-message', onReceiveMessage);
    };
  }, []);

  function handleClick() {
    console.log('You clicked the button!');
    socket.emit('greeting-from-client', input);
  }

  return (
    <>
      <div>App</div>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleClick}>BUTTON</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </>
  );
};

export default App;
