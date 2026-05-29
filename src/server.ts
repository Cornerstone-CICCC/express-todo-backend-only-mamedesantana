import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3000;

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const todos: Todo[] = [
  { id: 1, title: "Buy groceries", completed: false },
  { id: 2, title: "Study Express", completed: true }
];

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/todos", (req: Request, res: Response) => {
  res.status(200).json(todos);
});

app.get("/todos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const todo = todos.find(todo => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(200).json(todo);
});

app.post("/todos", (req: Request, res: Response) => {
  const { title, completed } = req.body;

  if (!title || typeof completed !== "boolean") {
    return res.status(400).json({
      error: "Title and completed are required"
    });
  }

  const newTodo: Todo = {
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    title,
    completed
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

app.put("/todos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;

  if (!title || typeof completed !== "boolean") {
    return res.status(400).json({
      error: "Title and completed are required"
    });
  }

  const todo = todos.find(todo => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todo.title = title;
  todo.completed = completed;

  res.status(200).json(todo);
});

app.delete("/todos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = todos.findIndex(todo => todo.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const deletedTodo = todos.splice(index, 1);

  res.status(200).json({
    message: "Todo deleted successfully",
    todo: deletedTodo[0]
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});