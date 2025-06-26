import React from 'react';
import { useInteractionLog } from '../hooks/useInteractionLog';

interface ExperimenterPanelProps {
  onClose: () => void;
}

export const ExperimenterPanel: React.FC<ExperimenterPanelProps> = ({ onClose }) => {
  const { log } = useInteractionLog();
  const counts = log.reduce<Record<string, number>>((acc, evt) => {
    acc[evt.eventType] = (acc[evt.eventType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg w-96 text-white">
        <h2 className="text-xl font-bold mb-4">Experimenter View</h2>
        <ul className="mb-4 space-y-1">
          {Object.entries(counts).map(([type, count]) => (
            <li key={type} className="flex justify-between border-b border-slate-600 pb-1">
              <span>{type}</span>
              <span>{count}</span>
            </li>
          ))}
        </ul>
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
