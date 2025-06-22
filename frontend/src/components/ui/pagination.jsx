import * as React from "react";

export function Pagination({ children, className = "" }) {
  return <nav className={`flex items-center justify-between ${className}`}>{children}</nav>;
}

export function PaginationContent({ children, className = "" }) {
  return <ul className={`inline-flex items-center -space-x-px ${className}`}>{children}</ul>;
}

export function PaginationItem({ children, className = "" }) {
  return <li className={className}>{children}</li>;
}

export function PaginationLink({ children, onClick, isActive, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded ${isActive ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-100"} ${className}`}
    >
      {children}
    </button>
  );
}

export function PaginationPrevious({ onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded bg-white text-blue-500 hover:bg-blue-100 ${className}`}
    >
      Previous
    </button>
  );
}

export function PaginationNext({ onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded bg-white text-blue-500 hover:bg-blue-100 ${className}`}
    >
      Next
    </button>
  );
} 