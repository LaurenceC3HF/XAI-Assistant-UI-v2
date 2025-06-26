import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { InteractionLogProvider } from './hooks/useInteractionLog';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InteractionLogProvider>
      <App />
    </InteractionLogProvider>
  </StrictMode>
);
