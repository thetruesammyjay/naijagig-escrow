import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "outline";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant;
	size?: BadgeSize;
}

function cn(...inputs: Array<string | undefined | null | false>) {
	return twMerge(clsx(inputs));
}

const variantClasses: Record<BadgeVariant, string> = {
	default: "bg-slate-100 text-slate-800",
	success: "bg-emerald-100 text-emerald-800",
	warning: "bg-amber-100 text-amber-900",
	danger: "bg-rose-100 text-rose-800",
	outline: "border border-slate-200 text-slate-700"
};

const sizeClasses: Record<BadgeSize, string> = {
	sm: "h-5 px-2 text-[11px]",
	md: "h-6 px-2.5 text-xs"
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
	{ className, variant = "default", size = "md", ...props },
	ref
) {
	return (
		<span
			ref={ref}
			className={cn(
				"inline-flex items-center rounded-full font-medium leading-none",
				variantClasses[variant],
				sizeClasses[size],
				className
			)}
			{...props}
		/>
	);
});

Badge.displayName = "Badge";
