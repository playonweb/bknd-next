'use client'

import { useState, useEffect } from 'react';
import { bknd } from '@/lib/bknd';
import { Todo } from '@/lib/types';
import { TodoItem } from '@/components/TodoItem';
import { TodoInput } from '@/components/TodoInput';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
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

  const addTodo = async (title: string) => {
    const tempId = Date.now().toString();
    const todo: Todo = { id: tempId, title, completed: false };
    
    setTodos((prev) => [...prev, todo]);

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

        <TodoInput onAdd={addTodo} />

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
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggle={toggleTodo} 
              onDelete={deleteTodo} 
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
