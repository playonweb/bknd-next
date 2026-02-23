import { useState } from 'react';

interface TodoInputProps {
  onAdd: (title: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title);
    setTitle('');
  };

  return (
    <div className="flex gap-4">
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className="neu-pressed w-full rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#a3b1c6] transition-all bg-transparent text-[#4a5568]"
        placeholder="What needs to be done?" 
        type="text" 
      />
      <button 
        onClick={handleAdd}
        className="neu-flat rounded-full w-14 h-14 flex items-center justify-center hover:neu-convex active:neu-pressed transition-all shrink-0 text-xl font-bold text-[#4a5568]"
      >
        +
      </button>
    </div>
  );
}
