// components/ui/multi-select.jsx
"use client";

import { forwardRef, useState } from "react";

export const MultiSelector = ({ values = [], onValuesChange, children, className, ...props }) => {
  return (
    <div className={`multi-selector ${className}`} {...props}>
      {children}
    </div>
  );
};

export const MultiSelectorTrigger = ({ children, ...props }) => (
  <button type="button" {...props} className="multi-selector-trigger">
    {children}
  </button>
);

export const MultiSelectorInput = ({ ...props }) => <input {...props} className="multi-selector-input" />;

export const MultiSelectorContent = ({ children, ...props }) => (
  <div {...props} className="multi-selector-content">
    {children}
  </div>
);

export const MultiSelectorList = ({ children, ...props }) => (
  <div {...props} className="multi-selector-list">
    {children}
  </div>
);

export const MultiSelectorItem = forwardRef(({ value, selected, onSelect, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-value={value}
      {...props}
      className={`multi-selector-item cursor-pointer p-1 ${selected ? "bg-blue-500 text-white" : ""}`}
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
});
