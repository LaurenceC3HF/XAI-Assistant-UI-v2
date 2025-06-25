import React from 'react';
import { VisualCard } from './VisualCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SHAPVisualProps {
  shapData?: Record<string, number>;
}

export const SHAPVisual: React.FC<SHAPVisualProps> = ({ shapData }) => {
  if (!shapData) return null;

  const features = Object.entries(shapData).sort(([, a], [, b]) => Math.abs(b) - Math.abs(a));
  const maxAbsValue = Math.max(...features.map(([, v]) => Math.abs(v)));

  return (
    <VisualCard>
      <div className="flex items-center mb-6">
        <TrendingUp className="w-6 h-6 text-teal-400 mr-3" />
        <h3 className="text-lg font-semibold text-teal-300">
          SHAP Feature Importance
        </h3>
      </div>
      
      <div className="space-y-4">
        {features.map(([feature, value]) => (
          <div key={feature} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {feature}
              </span>
              <div className="flex items-center">
                {value > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span className={`text-sm font-bold ${value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {value.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="relative bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div
                style={{ width: `${(Math.abs(value) / maxAbsValue) * 100}%` }}
                className={`
                  h-full transition-all duration-500 ease-out
                  ${value > 0 
                    ? 'bg-gradient-to-r from-green-500 to-green-400' 
                    : 'bg-gradient-to-r from-red-500 to-red-400'
                  }
                `}
              />
            </div>
          </div>
        ))}
      </div>
    </VisualCard>
  );
};