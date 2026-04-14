'use client';

import { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function PromptInput({ onSubmit, isLoading, placeholder }: PromptInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="input-line flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 focus-within:border-emerald-400/50 transition-colors">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder={placeholder || "Describe your hardware device..."} 
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/60 text-white" 
          disabled={isLoading} 
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()} 
          className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all shadow-lg shadow-emerald-500/25"
        >
          {isLoading ? (
            <div className="flex gap-1">
              <span className="loading-dot w-1 h-1 bg-white rounded-full"></span>
              <span className="loading-dot w-1 h-1 bg-white rounded-full"></span>
              <span className="loading-dot w-1 h-1 bg-white rounded-full"></span>
            </div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}