import React from "react";

const TodoRow = ({task, index, handleRemove}) => {
  return (
    <li>
      {task}
      <button onClick={() => handleRemove(index)}>Remove</button>
    </li>
  );
};

export default TodoRow;
