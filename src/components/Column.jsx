import React from 'react';
import TaskCard from './TaskCard';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
`;

const Header = styled.div`
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
`;

const Column = ({ header, columnTasks }) => {
  return (
    <Container>
      <Header>{header}</Header>
      <div>
        {columnTasks.map((task) => (
          <TaskCard key={task.uuid} {...task} />
        ))}
      </div>
    </Container>
  );
};

export default Column;
