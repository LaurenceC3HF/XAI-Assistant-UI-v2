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
      <VisualCard>
        <div className="flex items-center mb-4">
          <BrainCircuit className="w-6 h-6 text-yellow-400 mr-3" />
          <h3 className="text-lg font-semibold text-yellow-300">
            Situational Awareness Level 2: Comprehension
          </h3>
        </div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {explanation.reasoning?.text}
        </p>
      </VisualCard>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DAGVisual dagData={explanation.reasoning?.dag} />
        <SHAPVisual shapData={explanation.reasoning?.shap} />
      </div>
    </div>
  );
};