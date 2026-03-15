import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '@/types/todo';

const STORAGE_KEY = 'todos';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function persistTodos(todos: Todo[]) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos)).catch(console.error);
}

interface TodoContextValue {
  todos: Todo[];
  loaded: boolean;
  addTodo: (title: string) => void;
  updateTodo: (id: string, title: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
}

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setTodos(JSON.parse(raw));
          } catch {
            // corrupted data, start fresh
          }
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const addTodo = useCallback((title: string) => {
    setTodos((prev) => {
      const next = [
        { id: generateId(), title, completed: false, createdAt: Date.now() },
        ...prev,
      ];
      persistTodos(next);
      return next;
    });
  }, []);

  const updateTodo = useCallback((id: string, title: string) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, title } : t));
      persistTodos(next);
      return next;
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persistTodos(next);
      return next;
    });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      persistTodos(next);
      return next;
    });
  }, []);

  return (
    <TodoContext.Provider value={{ todos, loaded, addTodo, updateTodo, deleteTodo, toggleTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
}
