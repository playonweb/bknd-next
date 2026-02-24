import { Todo } from '@/lib/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="neu-flat rounded-2xl p-4 flex items-center justify-between gap-4 transition-all hover:-translate-y-1">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => onToggle(todo)}
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
        onClick={() => onDelete(todo.id)}
        className="text-red-400 opacity-60 hover:opacity-100 hover:text-red-500 transition-all text-xl pr-2"
      >
        ×
      </button>
    </li>
  );
}
