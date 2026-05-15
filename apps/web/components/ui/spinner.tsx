import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "white" | "gray";
  className?: string;
}

export function Spinner({ size = "md", variant = "primary", className = "" }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 text-sm",
    md: "w-6 h-6 text-base",
    lg: "w-8 h-8 text-xl",
    xl: "w-12 h-12 text-3xl",
  };

  const variants = {
    primary: "text-primary",
    white: "text-white",
    gray: "text-gray-400",
  };

  return (
    <div className={`inline-flex items-center justify-center animate-spin ${variants[variant]} ${className}`}>
      <i className={`bi bi-arrow-repeat ${sizes[size]}`}></i>
    </div>
  );
}
