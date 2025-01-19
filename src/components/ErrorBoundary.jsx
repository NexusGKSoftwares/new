import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error information to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI here
      return (
        <div role="alert">
          <h2>Something went wrong.</h2>
          <p>We're sorry, but something went wrong. Please try again later.</p>
        </div>
      );
    }

    // If no error occurs, render the children as usual
    return this.props.children;
  }
}

export default ErrorBoundary;
