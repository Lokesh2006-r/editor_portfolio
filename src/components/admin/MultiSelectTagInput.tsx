import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';

interface MultiSelectTagInputProps {
  name: string;
  label: string;
  initialTags?: string[];
  suggestedTags?: string[];
}

export const MultiSelectTagInput: React.FC<MultiSelectTagInputProps> = ({
  name,
  label,
  initialTags = [],
  suggestedTags = [],
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-mono text-zinc-300 mb-1">{label}</label>
      
      {/* Hidden input to pass data to native FormData */}
      <input type="hidden" name={name} value={tags.join(', ')} />

      <div 
        className="min-h-[38px] bg-[#18181e] border border-white/10 rounded px-2 py-1.5 flex flex-wrap gap-1.5 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/50 cursor-text"
        onClick={() => setIsOpen(true)}
      >
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="flex items-center gap-1 bg-white/5 border border-white/10 text-xs px-2 py-1 rounded text-zinc-200"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="text-zinc-400 hover:text-red-400 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={tags.length === 0 ? "Type or select..." : ""}
          className="flex-1 bg-transparent min-w-[80px] text-xs text-white focus:outline-none placeholder:text-zinc-600"
        />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-zinc-500 hover:text-white px-1"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && suggestedTags.length > 0 && (
        <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-[#1a1a20] border border-white/10 rounded-md shadow-xl p-1 no-scrollbar">
          {suggestedTags
            .filter((st) => !tags.includes(st) && st.toLowerCase().includes(inputValue.toLowerCase()))
            .map((suggested) => (
              <button
                key={suggested}
                type="button"
                onClick={() => {
                  addTag(suggested);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5 hover:text-red-500 rounded transition-colors flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                {suggested}
              </button>
            ))}
          {inputValue.trim() && !tags.includes(inputValue.trim()) && !suggestedTags.some(st => st.toLowerCase() === inputValue.trim().toLowerCase()) && (
            <button
              type="button"
              onClick={() => {
                addTag(inputValue);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-red-500 bg-red-600/10 hover:bg-red-600/20 rounded transition-colors flex items-center gap-2"
            >
              <Plus className="w-3 h-3" />
              Add "{inputValue.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};
