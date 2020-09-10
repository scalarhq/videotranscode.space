import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';

import ErrorScreen from './components/error/Error';

const globalErrorHandler = (error: Error, componentStack: string) => {
  // Do something with the error
  // E.g. log to an error logging client here
};

const ErrorFallback = ({ error, componentStack, resetErrorBoundary }: {
  error?: Error
  componentStack?: string
  resetErrorBoundary: () => void
}) => (
    <ErrorScreen errorObj={error} componentStack={componentStack} />
  );

const GlobalErrorWrapper = () => {
  const [globalError, setGlobalError] = useState({ state: false, message: '' });

  useEffect(() => {
    window.onerror = (message) => {
      console.info(`Caught Error from Worker ${message}`);
      setGlobalError({ state: true, message: message as string });
    };
  }, [window]);

  if (globalError.state) {
    return (<ErrorScreen errorObj={new Error(globalError.message)} />);
  }

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={globalErrorHandler}>
        <App />
      </ErrorBoundary>
    </>
  );
};

export default GlobalErrorWrapper;
