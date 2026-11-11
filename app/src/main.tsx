import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './tokens.css';
import './styles.css';
import App from './App';

// Theme follows the phone setting; ?theme=dark or ?theme=light forces one (demo / QA).
const forced = new URLSearchParams(window.location.search).get('theme');
if (forced === 'dark' || forced === 'light') document.documentElement.setAttribute('data-theme', forced);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
