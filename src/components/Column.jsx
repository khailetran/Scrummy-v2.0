import React from 'react';
import TaskCard from './TaskCard';
import styled from 'styled-components';

const Container = styled.div``;

const Header = styled.div``;

const Column = ({ header, columnTasks }) => {
  return (
    <div>
      <span>{header}</span>
      <div>
        {columnTasks.map((task) => (
          <TaskCard key={task.uuid} {...task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
