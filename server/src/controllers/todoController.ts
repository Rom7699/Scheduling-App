import { Request, Response } from 'express';
import * as todoService from '../services/todoService';

export const getTodos = async (_req: Request, res: Response) => {
  try {
    const todos = todoService.getAllTodos();
    res.status(200).json({ data: todos, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const todo = todoService.getTodoById(req.params.id);

    if (!todo) {
      return res.status(404).json({ data: null, error: 'Todo not found' });
    }

    res.status(200).json({ data: todo, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ data: null, error: 'Title is required and must be a non-empty string' });
    }

    const todo = todoService.createTodo(title.trim());
    res.status(201).json({ data: todo, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { title, completed } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      return res.status(400).json({ data: null, error: 'Title must be a non-empty string' });
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ data: null, error: 'Completed must be a boolean' });
    }

    if (title === undefined && completed === undefined) {
      return res.status(400).json({ data: null, error: 'At least one field (title or completed) is required' });
    }

    const updates: { title?: string; completed?: boolean } = {};
    if (title !== undefined) updates.title = title.trim();
    if (completed !== undefined) updates.completed = completed;

    const todo = todoService.updateTodo(req.params.id, updates);

    if (!todo) {
      return res.status(404).json({ data: null, error: 'Todo not found' });
    }

    res.status(200).json({ data: todo, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const deleted = todoService.deleteTodo(req.params.id);

    if (!deleted) {
      return res.status(404).json({ data: null, error: 'Todo not found' });
    }

    res.status(200).json({ data: { message: 'Todo deleted successfully' }, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
};
