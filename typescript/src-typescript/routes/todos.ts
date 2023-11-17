import { Router } from "express";
const router = Router();

//typescript imports
import { Todo } from "../models/todos";
type requestBody = { text: string };
type requestParams = { todoId: string };

let todos: Todo[] = [];

router.get("/", (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.post("/todo", (req, res, next) => {
  // const body = req.body as { text: string };
  const body = req.body as requestBody;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };

  todos.push(newTodo);
  res.status(201).json({ message: "added Todo", todo: newTodo, todos: todos });
});

router.put("/todo/:todoId", (req, res, next) => {
  const body = req.body as requestBody;
  const params = req.body as requestParams;

  const tid = params.todoId;
  const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
  if (todoIndex >= 0) {
    todos[todoIndex] = { id: todos[todoIndex].id, text: body.text };
    return res.status(200).json({ message: "updated todo item" });
  } else {
    res.status(404).json({ message: "could not find a todo" });
  }
});

router.delete("/todo/:todoId", (req, res, next) => {
  const params = req.body as requestParams;

  todos = todos.filter((todoItem) => todoItem.id !== params.todoId);
  res.status(200).json({ message: "item deleted" });
});

export default router;
