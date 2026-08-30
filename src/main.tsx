/**
 * ================================================================================
 * File: src/main.tsx
 * Description: Client entry point bootstrapping the React DOM root for AASRA.
 * ================================================================================
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
