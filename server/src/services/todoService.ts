import { Todo } from '../models/Todo';
import crypto from 'crypto';

const todos: Todo[] = [];

export const getAllTodos = (): Todo[] => {
  return todos;
};

export const getTodoById = (id: string): Todo | undefined => {
  return todos.find(todo => todo.id === id);
};

export const createTodo = (title: string): Todo => {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  return todo;
};

export const updateTodo = (id: string, updates: { title?: string; completed?: boolean }): Todo | undefined => {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return undefined;

  if (updates.title !== undefined) {
    todos[index].title = updates.title;
  }
  if (updates.completed !== undefined) {
    todos[index].completed = updates.completed;
  }

  return todos[index];
};

export const deleteTodo = (id: string): boolean => {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return false;

  todos.splice(index, 1);
  return true;
};
