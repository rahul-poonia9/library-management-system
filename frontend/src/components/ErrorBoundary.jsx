import { Component } from 'react';
import { Button } from './ui/button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold">Oops! Something went wrong</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>
            <div className="mt-8 flex space-x-4">
              <Button
                onClick={() => window.location.reload()}
                variant="default"
              >
                Refresh Page
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Go to Home
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 text-left">
                <h2 className="text-lg font-semibold">Error Details:</h2>
                <pre className="mt-2 rounded bg-muted p-4 text-sm">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 