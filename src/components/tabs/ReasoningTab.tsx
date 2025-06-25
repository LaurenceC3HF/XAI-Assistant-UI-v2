import React from 'react';
import { XAIExplanation } from '../../types';
import { VisualCard } from '../visualizations/VisualCard';
import { DAGVisual } from '../visualizations/DAGVisual';
import { SHAPVisual } from '../visualizations/SHAPVisual';
import { BrainCircuit } from 'lucide-react';

interface ReasoningTabProps {
  explanation: XAIExplanation;
}

export const ReasoningTab: React.FC<ReasoningTabProps> = ({ explanation }) => {
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
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {explanation.reasoning?.text}
            </p>
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
