import React from "react";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {}

const Button = React.forwardRef<HTMLDivElement, BoxProps>(
	({ className, children, ...props }, ref) => (
		<div
			ref={ref}
			className="bg-black text-white p-2 rounded tracking-tighter cursor-pointer"
			{...props}
		>
			{children}
		</div>
	),
);

export { Button };
