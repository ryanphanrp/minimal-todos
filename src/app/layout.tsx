import "@/styles/globals.css";
import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <TodoProvider>
            {children}
          </TodoProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}