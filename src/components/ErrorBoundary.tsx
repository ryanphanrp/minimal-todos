"use client";

import React, { Component, ReactNode } from 'react';
import { motion } from "motion/react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div 
          className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Something went wrong
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Don't worry, your todos are still safe in localStorage. Try refreshing the page.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={this.handleReset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </motion.div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left max-w-2xl">
              <summary className="cursor-pointer font-medium mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </motion.div>
      );
    }

    return this.props.children;
  }
}