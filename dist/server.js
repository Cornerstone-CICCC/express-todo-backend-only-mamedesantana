"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
const todos = [
    { id: 1, title: "Buy groceries", completed: false },
    { id: 2, title: "Study Express", completed: true }
];
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.get("/todos", (req, res) => {
    res.status(200).json(todos);
});
app.get("/todos/:id", (req, res) => {
    const id = Number(req.params.id);
    const todo = todos.find(todo => todo.id === id);
    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(todo);
});
app.post("/todos", (req, res) => {
    const { title, completed } = req.body;
    if (!title || typeof completed !== "boolean") {
        return res.status(400).json({
            error: "Title and completed are required"
        });
    }
    const newTodo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        title,
        completed
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});
app.put("/todos/:id", (req, res) => {
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
app.delete("/todos/:id", (req, res) => {
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
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
