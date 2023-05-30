import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 2px solid black;
  background-color: white;
  box-shadow: 5px 5px black;
  margin: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  cursor: pointer;
  border: 1px solid black;
  background-color: #a6faff;
  box-shadow: 2px 2px black;
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
`;

const DeleteButton = styled.button`
  cursor: pointer;
  color: #777777;
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  margin-left: auto;
  transition: color 150ms;
  &:hover {
    color: red;
  }
`;

const TaskCard = ({ uuid, author, content }) => {
  return (
    <Card>
      <span>{content}</span>
      <span>{`~ ${author}`}</span>

      <ButtonContainer>
        <Button>&larr;</Button>
        <Button>&rarr;</Button>
        <DeleteButton>delete</DeleteButton>
      </ButtonContainer>
    </Card>
  );
};

export default TaskCard;
