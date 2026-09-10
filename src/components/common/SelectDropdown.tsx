import React, { useState, useRef, useEffect, useId, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface SelectDropdownProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  error?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  id: customId,
  required = false,
  disabled = false,
  className = '',
  triggerClassName = '',
  menuClassName = '',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const generatedId = useId();
  const selectId = customId || generatedId;
  const listboxId = `${selectId}-listbox`;
  const labelId = label ? `${selectId}-label` : undefined;

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Adjust highlighted index when opening or changing value
  useEffect(() => {
    if (isOpen) {
      const selectedIdx = options.findIndex((opt) => opt.value === value);
      setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, value, options]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const activeElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            handleSelect(options[highlightedIndex].value);
          }
        } else {
          setIsOpen(true);
        }
        break;
      }
      case 'Escape':
      case 'Tab': {
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          id={labelId}
          htmlFor={selectId}
          className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Accessible Trigger Button */}
      <button
        ref={buttonRef}
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={labelId}
        className={`w-full flex items-center justify-between text-left py-3.5 px-4 bg-stone-50 border rounded-2xl text-base transition-all duration-200 outline-none cursor-pointer min-h-[48px] ${
          isOpen
            ? 'border-gold ring-2 ring-gold/30 bg-white shadow-sm'
            : error
            ? 'border-rose-400 ring-1 ring-rose-200 bg-rose-50/20'
            : 'border-stone-200 hover:border-gold/60 focus:border-gold focus:ring-2 focus:ring-gold/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-stone-100' : ''} ${triggerClassName}`}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0">
          {selectedOption?.icon && (
            <span className="text-stone-500 shrink-0">{selectedOption.icon}</span>
          )}
          {selectedOption ? (
            <span className="text-charcoal font-medium truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-stone-400 font-normal truncate">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          size={18}
          className={`text-stone-400 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-gold' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Floating Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            aria-activedescendant={
              highlightedIndex >= 0 ? `${selectId}-opt-${highlightedIndex}` : undefined
            }
            tabIndex={-1}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-50 left-0 right-0 mt-2 p-1.5 bg-white rounded-2xl border border-stone-200 shadow-xl max-h-64 overflow-y-auto outline-none ${menuClassName}`}
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value;
              const isHighlighted = idx === highlightedIndex;

              return (
                <li
                  key={option.value}
                  id={`${selectId}-opt-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                    isSelected
                      ? 'bg-gold/15 text-charcoal font-bold'
                      : isHighlighted
                      ? 'bg-[#fff8e2] text-charcoal'
                      : 'text-stone-700 hover:bg-[#fff8e2] hover:text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <div className="flex flex-col truncate">
                      <span className="truncate">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-stone-400 font-normal">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check size={16} className="text-gold-dark shrink-0 ml-2" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};

export default SelectDropdown;
