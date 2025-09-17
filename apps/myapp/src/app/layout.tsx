import "./system.css";

import type { PropsWithChildren } from "react";
import { Providers } from "@/providers";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="relative antialiased bg-background text-foreground">
				<Providers>
					<div className="flex flex-col min-h-[100dvh]">
						<main className="grow">{children}</main>
					</div>
				</Providers>
			</body>
		</html>
	);
};

export default Layout;
