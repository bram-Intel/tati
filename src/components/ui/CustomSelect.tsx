"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  label?: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomSelect({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === value))
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const triggerId = id || generatedId;
  const listboxId = `${triggerId}-listbox`;

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setActiveIndex((prev) => (prev + 1) % options.length);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
      }
    } else if (event.key === "Enter" || event.key === " ") {
      if (open) {
        event.preventDefault();
        const choice = options[activeIndex];
        if (choice) {
          onChange(choice.value);
          setOpen(false);
        }
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="tati-dropdown" data-open={open ? "true" : "false"}>
      <button
        id={triggerId}
        type="button"
        className="tati-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={label}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} className="tati-dropdown-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className="tati-dropdown-menu"
        >
          {options.map((opt, idx) => {
            const selected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected}
                className="tati-dropdown-option"
                data-selected={selected ? "true" : "false"}
                data-highlighted={idx === activeIndex ? "true" : "false"}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {selected && <Check size={14} color="var(--raspberry)" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
