'use client'

import { useState, useEffect } from 'react';
import { useApi, useAuth } from 'bknd/client';
import { Todo } from '@/lib/types';
import { TodoItem } from '@/components/TodoItem';
import { TodoInput } from '@/components/TodoInput';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const bknd = useApi();
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const response = await bknd.data.readMany<any>('todos');
        if (response && response.ok) {
          setTodos(response.data || []);
        } else {
          setTodos([]);
        }
      } catch (error: any) {
        setTodos([]);
        if (error.status === 401 || error.status === 403) {
           console.log('User not authorized or authenticated');
        } else {
           console.warn('Error fetching todos:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [bknd]);

  const addTodo = async (title: string) => {
    const tempId = Date.now().toString();
    const todo: Todo = { id: tempId, title, completed: false };
    
    setTodos((prev) => [...prev, todo]);

    try {
      const res = await bknd.data.createOne<any>('todos', { 
        title: todo.title, 
        completed: false 
      });
      
      if (res && res.data?.id) {
        setTodos((prev) => prev.map(t => t.id === tempId ? { ...t, id: res.data.id } : t));
      }
    } catch (err) {
      console.error('Failed to create todo in bknd:', err);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    const updatedStatus = !todo.completed;
    setTodos((prev) => prev.map(t => t.id === todo.id ? { ...t, completed: updatedStatus } : t));
    
    try {
      await bknd.data.updateOne('todos', todo.id, { 
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
      await bknd.data.deleteOne('todos', id);
    } catch (err) {
      console.error('Failed to delete todo in bknd', err);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen p-8 flex justify-center bg-[#e0e5ec]">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <div className="neu-flat rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold tracking-wide text-[#4a5568]">
              Neu ToDo
            </h1>
            <button 
              onClick={() => logout()}
              className="neu-flat rounded-xl px-4 py-2 text-sm font-bold text-red-500 hover:text-red-600 transition-all hover:scale-105 active:scale-95 active:neu-pressed"
            >
              Logout
            </button>
          </div>

          <div className="flex items-center gap-3 px-2 py-1 bg-white/10 rounded-2xl">
            <div className="w-10 h-10 rounded-full neu-flat flex items-center justify-center text-lg font-bold text-[#4a5568]">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider opacity-40 text-[#4a5568]">Logged in as</span>
              <span className="text-sm font-semibold text-[#4a5568]">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="neu-flat rounded-3xl p-8 flex flex-col gap-6">
          <TodoInput onAdd={addTodo} />

          <ul className="flex flex-col gap-4 mt-2">
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
          
          <div className="pt-6 border-t border-[#a3b1c6]/30 mt-2 flex flex-col items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-30 text-[#4a5568]">Management</p>
              <a href="/admin" className="text-sm font-bold text-[#4a5568] opacity-60 hover:opacity-100 transition-all flex items-center gap-2">
                  <span>⚙️</span> Access Admin Panel
              </a>
          </div>
        </div>
      </div>
    </div>
  );
}

