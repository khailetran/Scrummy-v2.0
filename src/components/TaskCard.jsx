import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid black;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const TaskCard = ({ uuid, author, content }) => {
  return (
    <Card>
      <span>{content}</span>
      <span>author: {author}</span>
      <button>delete</button>
      <button>{'move left'}</button>
      <button>{'move right'}</button>
    </Card>
  );
};

export default TaskCard;
