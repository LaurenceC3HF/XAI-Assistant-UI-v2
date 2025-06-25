import React from 'react';
import { XAIExplanation, COAScenario } from '../../types';
import { VisualCard } from '../visualizations/VisualCard';
import { COAComparison } from '../visualizations/COAComparison';
import { Eye } from 'lucide-react';

interface InsightTabProps {
  explanation: XAIExplanation;
  scenario: COAScenario;
}

export const InsightTab: React.FC<InsightTabProps> = ({ explanation, scenario }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <VisualCard>
        <div className="flex items-center mb-4">
          <Eye className="w-6 h-6 text-blue-400 mr-3" />
          <h3 className="text-lg font-semibold text-blue-300">
            Situational Awareness Level 1: Perception
          </h3>
        </div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {explanation.insight?.text}
        </p>
      </VisualCard>
      
      <COAComparison coas={scenario.coursesOfAction} />
    </div>
  );
};