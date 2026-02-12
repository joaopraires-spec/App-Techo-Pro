
import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Removed .tsx extension from import as it is generally discouraged in TypeScript projects
// and can lead to "not a module" errors in some configurations.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
