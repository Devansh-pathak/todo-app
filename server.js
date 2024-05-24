const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = './todos.json';

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Helper function to read and write todos
const readTodos = () => {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

const writeTodos = (todos) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
};

// Initialize the todos file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  writeTodos([]);
}

// Routes
app.get('/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const todos = readTodos();
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.json(newTodo);
});

app.delete('/todos/:id', (req, res) => {
  const todos = readTodos();
  const newTodos = todos.filter(todo => todo.id !== parseInt(req.params.id));
  writeTodos(newTodos);
  res.json({ message: 'Todo deleted' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
