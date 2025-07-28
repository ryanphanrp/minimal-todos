import "@/styles/globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TodoProvider } from "@/lib/store";

export const metadata: Metadata = {
	title: "Minimal Todo",
	description: "A minimal todo application built with Next.js and React 19",
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
};

const jetBrainsMono = JetBrains_Mono({
	variable: "--font-jet-brains-mono",
	weight: ["400"],
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${jetBrainsMono.className} font-sans`}>
				<ErrorBoundary>
					<TodoProvider>{children}</TodoProvider>
				</ErrorBoundary>
			</body>
		</html>
	);
}
