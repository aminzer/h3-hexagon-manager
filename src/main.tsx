import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const reactRootElement = document.getElementById('root');

if (!reactRootElement) {
  throw new Error('Failed to boot application');
}

createRoot(reactRootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
