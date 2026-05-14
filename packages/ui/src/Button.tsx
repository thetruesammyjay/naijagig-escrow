import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
}

function cn(...inputs: Array<string | undefined | null | false>) {
	return twMerge(clsx(inputs));
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: "bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-950",
	secondary: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-400",
	ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400",
	danger: "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-600"
};

const sizeClasses: Record<ButtonSize, string> = {
	sm: "h-9 px-3 text-sm",
	md: "h-11 px-4 text-sm",
	lg: "h-12 px-5 text-base"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ className, variant = "primary", size = "md", type = "button", isLoading = false, disabled, children, ...props },
	ref
) {
	return (
		<button
			ref={ref}
			type={type}
			disabled={disabled || isLoading}
			className={cn(
				"inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
				variantClasses[variant],
				sizeClasses[size],
				className
			)}
			{...props}
		>
			{isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
			{children}
		</button>
	);
});

Button.displayName = "Button";
