"use client";

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  options: Option[];
  placeholder?: string;
  wrapperClassName?: string;
  className?: string;
  dropdownClassName?: string;
  hidePlaceholderOption?: boolean;
}

export const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps>(
  ({ options, placeholder = 'Pilih...', wrapperClassName = '', className = '', dropdownClassName = '', hidePlaceholderOption = false, onChange, value, defaultValue, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string | number | readonly string[]>(value !== undefined ? value : defaultValue || '');
    const containerRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    // Expose both internal select ref and custom ref if passed
    useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement);

    // Sync external value changes
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    // Handle click outside to close
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => String(opt.value) === String(internalValue));

    const handleSelect = (val: string) => {
      setInternalValue(val);
      setIsOpen(false);
      
      // Update hidden select directly and trigger change event for react-hook-form
      if (selectRef.current) {
        selectRef.current.value = val;
        // Native event dispatch so that onChange listeners (like react-hook-form) catch it
        const event = new Event("change", { bubbles: true });
        selectRef.current.dispatchEvent(event);
      }

      // If there's a custom onChange passed manually (not via ref), call it too
      if (onChange) {
        const syntheticEvent = {
          target: { value: val, name: props.name },
          currentTarget: { value: val, name: props.name }
        } as unknown as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className={`relative w-full ${wrapperClassName}`} ref={containerRef}>
        {/* Hidden native select for form submission and ref binding */}
        <select 
          ref={selectRef}
          className="hidden" 
          value={internalValue} 
          onChange={(e) => {
            setInternalValue(e.target.value);
            if (onChange) onChange(e);
          }}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Custom UI */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-200 rounded-sm cursor-pointer hover:border-[#3D7A5E] transition-colors select-none ${className}`}
        >
          <span className={selectedOption ? 'text-gray-900 line-clamp-1' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className={`absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-sm shadow-lg max-h-60 overflow-y-auto ${dropdownClassName}`}>
            {!hidePlaceholderOption && (
              <div 
                onClick={() => handleSelect('')}
                className="px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
              >
                {placeholder}
              </div>
            )}
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  String(internalValue) === String(opt.value)
                    ? 'bg-[#3D7A5E]/10 text-[#3D7A5E] font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = 'CustomSelect';
