'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logErrorClient } from '@/lib/logger-client';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    logErrorClient({
      message: error.message,
      stack: error.stack || (errorInfo as any).componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black/90 text-white p-4 text-center">
          <div className="max-w-md p-8 bg-zinc-900 rounded-2xl border border-red-900/50 shadow-2xl backdrop-blur-xl">
            <h1 className="text-3xl font-bold mb-4 text-red-500">System Error</h1>
            <p className="text-gray-400 mb-8">
              A crash occurred on this page. Our RAG Help Bot has been notified and can assist you in figuring out what went wrong.
            </p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-95"
            >
              Try recovering
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
