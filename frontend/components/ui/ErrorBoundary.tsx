"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorDisplay } from "./ErrorDisplay";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <ErrorDisplay 
              onRetry={this.handleReset}
              title="System Anomaly"
              message="An unexpected error occurred within the digital matrix. The archive is attempting to stabilize."
            />
          </div>
        )
      );
    }

    return this.props.children;
  }
}
