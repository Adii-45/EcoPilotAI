import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Leaf } from "lucide-react";
import { Button } from "./ui/Button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ""
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-6 font-sans">
          <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Leaf size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong</h1>
            <p className="text-slate-500 mb-8">
              We've encountered an unexpected error. Our team has been notified.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl text-left text-xs font-mono text-slate-500 mb-8 overflow-auto max-h-32">
              {this.state.errorMsg}
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full py-4 rounded-xl"
            >
              Return Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
