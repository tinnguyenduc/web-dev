const todos = [];

const getTodos = (req, res) => {
  res.status(200).json(todos);
};

const addTodo = (req, res) => {
  const { todo } = req.body;

  if (!todo) {
    res.status(400).json({ error: "missing todo" });
  } else {
    todos.push(todo);
    res.status(200).json(todos);
  }
};

const getTodoAtIndex = (req, res) => {
  const { index } = req.params;

  if (todos.length < index) {
    res.status(400).json({ error: "cannot get todo at this index" });
  } else {
    res.status(200).json({ todo: todos[index] });
  }
};

const updateTodoAtIndex = (req, res) => {
  const { todo } = req.query;
  const { index } = req.params;

  if (todos.length < index) {
    res.status(400).json({ error: "cannot get todo at this index" });
  } else if (!todo) {
    res.status(400).json({ error: "missing todo" });
  } else {
    todos[index] = todo;
    res.status(200).json(todos);
  }
};

const deleteAtIndex = (req, res) => {
  const { index } = req.params;

  if (todos.length < index || todos.length === 0) {
    res.status(400).json({ error: "index is invalid" });
  } else {
    todos.splice(index, 1);
    res.status(200).json({ message: "todo removed", data: todos });
  }
};

module.exports = {
  getTodos,
  addTodo,
  getTodoAtIndex,
  updateTodoAtIndex,
  deleteAtIndex,
};
