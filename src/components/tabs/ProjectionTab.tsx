import React from 'react';
import { XAIExplanation } from '../../types';
import { VisualCard } from '../visualizations/VisualCard';
import { AlternativeOutcomes } from '../visualizations/AlternativeOutcomes';
import { Activity } from 'lucide-react';

interface ProjectionTabProps {
  explanation: XAIExplanation;
}

export const ProjectionTab: React.FC<ProjectionTabProps> = ({ explanation }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <VisualCard>
        <div className="flex items-center mb-4">
          <Activity className="w-6 h-6 text-purple-400 mr-3" />
          <h3 className="text-lg font-semibold text-purple-300">
            Situational Awareness Level 3: Projection
          </h3>
        </div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {explanation.projection?.text}
        </p>
      </VisualCard>
      
      <AlternativeOutcomes alternatives={explanation.projection?.alternatives} />
    </div>
  );
};