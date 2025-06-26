import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { InteractionEvent } from '../types';

interface InteractionLogContextValue {
  log: InteractionEvent[];
  logInteraction: (event: InteractionEvent) => void;
  exportLog: () => void;
}

const InteractionLogContext = createContext<InteractionLogContextValue | undefined>(undefined);

export const InteractionLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [log, setLog] = useState<InteractionEvent[]>(() => {
    const stored = localStorage.getItem('interactionLog');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('interactionLog', JSON.stringify(log));
  }, [log]);

  const logInteraction = (event: InteractionEvent) => {
    setLog(prev => [...prev, event]);
  };

  const exportLog = () => {
    const data = JSON.stringify(log, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const a = document.createElement('a');
    a.href = url;
    a.download = `interaction-log-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <InteractionLogContext.Provider value={{ log, logInteraction, exportLog }}>
      {children}
    </InteractionLogContext.Provider>
  );
};

export const useInteractionLog = (): InteractionLogContextValue => {
  const context = useContext(InteractionLogContext);
  if (!context) {
    throw new Error('useInteractionLog must be used within InteractionLogProvider');
  }
  return context;
};
