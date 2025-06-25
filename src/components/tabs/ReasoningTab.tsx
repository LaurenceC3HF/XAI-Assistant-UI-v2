import React, { useState } from 'react';
import { XAIExplanation } from '../../types';
import { VisualCard } from '../visualizations/VisualCard';
import { DAGVisual } from '../visualizations/DAGVisual';
import { SHAPVisual } from '../visualizations/SHAPVisual';
import { BrainCircuit, ChevronDown } from 'lucide-react';

interface ReasoningTabProps {
  explanation: XAIExplanation;
}

export const ReasoningTab: React.FC<ReasoningTabProps> = ({ explanation }) => {
  const [showWhy, setShowWhy] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);

  // Example: you would provide real data from your XAI backend here
  const whyBullets = explanation.reasoning?.why || [
    "Flight Deviation: Unusual pattern detected (matches 85% of known threats)",
    "ATC Non-Response: Communication silence for 5 min (high risk)",
    "Speed Increase: Sudden acceleration detected (possible hostile intent)",
  ];

  const whatIfBullets = explanation.reasoning?.whatIf || [
    "If ATC responded, confidence drops to 45%",
    "If flight pattern matches normal, no alert would be triggered"
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top row: Summary and SHAP visual side by side */}
      <div className="flex flex-row gap-6 w-full">
        <div className="flex-1 min-w-0">
          <VisualCard>
            <div className="flex items-center mb-4">
              <BrainCircuit className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-lg font-semibold text-yellow-300">
                Summary
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-2">
              {explanation.reasoning?.text}
            </p>
            {/* Why? Expandable Panel */}
            <div className="border-t border-slate-700/50 pt-3 mt-3">
              <button
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-semibold mb-1"
                onClick={() => setShowWhy(v => !v)}
                aria-expanded={showWhy}
                aria-controls="why-panel"
              >
                <ChevronDown className={`w-4 h-4 mr-2 transform transition-transform ${showWhy ? 'rotate-180' : ''}`} />
                Why?
              </button>
              {showWhy && (
                <ul id="why-panel" className="list-disc ml-7 text-slate-300 text-sm space-y-1">
                  {whyBullets.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              )}
            </div>
            {/* What If? Expandable Panel */}
            <div className="border-t border-slate-700/50 pt-3 mt-3">
              <button
                className="flex items-center text-green-400 hover:text-green-300 transition-colors font-semibold mb-1"
                onClick={() => setShowWhatIf(v => !v)}
                aria-expanded={showWhatIf}
                aria-controls="whatif-panel"
              >
                <ChevronDown className={`w-4 h-4 mr-2 transform transition-transform ${showWhatIf ? 'rotate-180' : ''}`} />
                What If?
              </button>
              {showWhatIf && (
                <ul id="whatif-panel" className="list-disc ml-7 text-slate-300 text-sm space-y-1">
                  {whatIfBullets.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              )}
            </div>
          </VisualCard>
        </div>
        <div className="flex-1 min-w-0">
          <SHAPVisual shapData={explanation.reasoning?.shap} />
        </div>
      </div>
      {/* Full-width horizontally expanded DAG visual below */}
      <div className="w-full">
        <DAGVisual dagData={explanation.reasoning?.dag} />
      </div>
    </div>
  );
};
