import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: Array<string | undefined | null | false>) {
	return twMerge(clsx(inputs));
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card({ className, ...props }, ref) {
	return (
		<div
			ref={ref}
			className={cn("rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm", className)}
			{...props}
		/>
	);
});

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardHeader(
	{ className, ...props },
	ref
) {
	return <div ref={ref} className={cn("flex flex-col gap-1.5 p-6 pb-4", className)} {...props} />;
});

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(function CardTitle(
	{ className, ...props },
	ref
) {
	return <h3 ref={ref} className={cn("text-lg font-semibold tracking-tight text-slate-950", className)} {...props} />;
});

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	function CardDescription({ className, ...props }, ref) {
		return <p ref={ref} className={cn("text-sm text-slate-500", className)} {...props} />;
	}
);

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardContent(
	{ className, ...props },
	ref
) {
	return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
});

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardFooter(
	{ className, ...props },
	ref
) {
	return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />;
});

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";
