// import React from 'react'
import Column from './Column';

const ScrumBoard = ({ tasks }) => {
  // Should render 4 columns because there are 4 subarrays in `tasks`
  return (
    <div>
      {tasks.map((column) => (
        <Column tasks={column} />
      ))}
    </div>
  );
};

export default ScrumBoard;
