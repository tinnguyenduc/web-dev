import React, { useState } from 'react';
import TodoRow from './TodoRow';

const TodoList = () => {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleAddTask = () => {
    if (task.trim() !== '') {
      setTaskList([...taskList, task]);
      setTask('');
    }
  };

  const handleRemoveTask = (index) => {
    const updatedList = [...taskList];
    updatedList.splice(index, 1);
    setTaskList(updatedList);
  };

  return (
    <div>
      <h1>Todo App</h1>
      <div>
        <input type="text" value={task} onChange={handleInputChange} />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul>
        {taskList.map((task, index) => (
          <TodoRow key={index} task={task} handleRemove={handleRemoveTask}/>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
