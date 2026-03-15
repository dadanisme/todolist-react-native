import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '@/types/todo';

const STORAGE_KEY = 'todos';

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
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        setTodos(JSON.parse(raw));
      }
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((next: Todo[]) => {
    setTodos(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addTodo = useCallback(
    (title: string) => {
      const todo: Todo = {
        id: Date.now().toString(),
        title,
        completed: false,
        createdAt: Date.now(),
      };
      persist([todo, ...todos]);
    },
    [todos, persist],
  );

  const updateTodo = useCallback(
    (id: string, title: string) => {
      persist(todos.map((t) => (t.id === id ? { ...t, title } : t)));
    },
    [todos, persist],
  );

  const deleteTodo = useCallback(
    (id: string) => {
      persist(todos.filter((t) => t.id !== id));
    },
    [todos, persist],
  );

  const toggleTodo = useCallback(
    (id: string) => {
      persist(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    },
    [todos, persist],
  );

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
