import React from 'react';
import { AlternativeOutcome } from '../../types';
import { VisualCard } from './VisualCard';
import { GitBranch, AlertTriangle, Info } from 'lucide-react';

interface AlternativeOutcomesProps {
  alternatives?: AlternativeOutcome[];
}

export const AlternativeOutcomes: React.FC<AlternativeOutcomesProps> = ({ alternatives }) => {
  if (!alternatives || alternatives.length === 0) return null;

  const getIcon = (index: number) => {
    const icons = [AlertTriangle, Info, GitBranch];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-5 h-5" />;
  };

  const getIconColor = (index: number) => {
    const colors = ['text-amber-400', 'text-blue-400', 'text-purple-400'];
    return colors[index % colors.length];
  };

  return (
    <VisualCard>
      <div className="flex items-center mb-6">
        <GitBranch className="w-6 h-6 text-purple-400 mr-3" />
        <h3 className="text-lg font-semibold text-purple-300">
          Alternative Scenario Outcomes
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alternatives.map((alt, i) => (
          <div
            key={i}
            className="group bg-slate-900/60 border border-slate-700/50 rounded-lg p-4 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all duration-300"
          >
            <div className="flex items-start mb-3">
              <div className={`flex-shrink-0 mr-3 ${getIconColor(i)} group-hover:scale-110 transition-transform duration-200`}>
                {getIcon(i)}
              </div>
              <h4 className="font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">
                {alt.title}
              </h4>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
              {alt.details}
            </p>
          </div>
        ))}
      </div>
    </VisualCard>
  );
};