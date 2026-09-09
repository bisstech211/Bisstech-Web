import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App';
import './index.css';

// Respects prefers-reduced-motion globally for all Framer Motion animations.
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion={reducedMotionQuery ? 'always' : 'never'}>
        <App />
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>,
);