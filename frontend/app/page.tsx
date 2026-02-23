'use client'

import { useState, useEffect } from 'react';
import { bknd } from '@/lib/bknd';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const response = await bknd.data.get<any>('/collections/todos/records');
        if (response && response.items) {
          setTodos(response.items);
        }
      } catch (error) {
        console.warn('Backend not fully configured yet, showing empty list', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodoTitle.trim()) return;
    const tempId = Date.now().toString();
    const todo: Todo = { id: tempId, title: newTodoTitle, completed: false };
    
    setTodos((prev) => [...prev, todo]);
    setNewTodoTitle('');

    try {
      const res = await bknd.data.post<any>('/collections/todos/records', { 
        title: todo.title, 
        completed: false 
      });
      
      if (res && res.id) {
        setTodos((prev) => prev.map(t => t.id === tempId ? { ...t, id: res.id } : t));
      }
    } catch (err) {
      console.error('Failed to create todo in bknd:', err);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    const updatedStatus = !todo.completed;
    setTodos((prev) => prev.map(t => t.id === todo.id ? { ...t, completed: updatedStatus } : t));
    
    try {
      await bknd.data.patch(`/collections/todos/records/${todo.id}`, { 
        completed: updatedStatus 
      });
    } catch (err) {
      console.error('Failed to update todo in bknd', err);
      // Revert if error
      setTodos((prev) => prev.map(t => t.id === todo.id ? { ...t, completed: todo.completed } : t));
    }
  };

  const deleteTodo = async (id: string) => {
    setTodos((prev) => prev.filter(t => t.id !== id));
    
    try {
      await bknd.data.delete(`/collections/todos/records/${id}`);
    } catch (err) {
      console.error('Failed to delete todo in bknd', err);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen p-8 flex justify-center bg-[#e0e5ec]">
      <div className="w-full max-w-lg neu-flat rounded-3xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center mb-4 tracking-wide text-[#4a5568]">
          Neu ToDo
        </h1>

        {/* Input Section */}
        <div className="flex gap-4">
          <input 
            value={newTodoTitle} 
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            className="neu-pressed w-full rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#a3b1c6] transition-all bg-transparent text-[#4a5568]"
            placeholder="What needs to be done?" 
            type="text" 
          />
          <button 
            onClick={addTodo}
            className="neu-flat rounded-full w-14 h-14 flex items-center justify-center hover:neu-convex active:neu-pressed transition-all shrink-0 text-xl font-bold text-[#4a5568]"
          >
            +
          </button>
        </div>

        {/* List Section */}
        <ul className="flex flex-col gap-4 mt-6">
          {isLoading && (
            <li className="text-center italic opacity-70 text-[#4a5568]">
              Loading your tasks...
            </li>
          )}
          
          {!isLoading && todos.length === 0 && (
            <li className="text-center italic opacity-70 text-[#4a5568]">
              No tasks yet. Enjoy your day!
            </li>
          )}

          {todos.map(todo => (
            <li 
              key={todo.id}
              className="neu-flat rounded-2xl p-4 flex items-center justify-between gap-4 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 flex-1">
                <button 
                  onClick={() => toggleTodo(todo)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all border-2 border-transparent ${
                    todo.completed ? 'neu-pressed text-green-500 border-green-400' : 'neu-convex text-transparent border-[#a3b1c6]'
                  }`}
                >
                  ✓
                </button>
                <span 
                  className={`font-medium text-lg truncate transition-all text-[#4a5568] ${
                    todo.completed ? 'line-through opacity-50' : ''
                  }`}
                >
                  {todo.title}
                </span>
              </div>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="text-red-400 opacity-60 hover:opacity-100 hover:text-red-500 transition-all text-xl pr-2"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
