import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  color: black;
  font-size: 1rem;
  border: 1px solid black;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
`;

const Button = styled.button`
  background-color: #fea6f6;
  font-size: 2rem;
  border-radius: 2rem;
  border: 1px solid black;
  box-shadow: 2px 2px black;
  height: 3rem;
  width: 3rem;
`;

const CreateCard = ({ handleAddTask }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const content = input.trim();
    if (!content) return;
    handleAddTask(content);
    setInput('');
  };

  return (
    <Container>
      <Input
        type="text"
        placeholder="add a task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />
      <Button onClick={handleSubmit}>+</Button>
    </Container>
  );
};

export default CreateCard;
