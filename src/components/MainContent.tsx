import React from 'react';
import { XAIExplanation, TabType, COAScenario } from '../types';
import { InsightTab } from './tabs/InsightTab';
import { ReasoningTab } from './tabs/ReasoningTab';
import { ProjectionTab } from './tabs/ProjectionTab';

interface MainContentProps {
  explanation: XAIExplanation;
  activeTab: TabType;
  scenario: COAScenario;
}

export const MainContent: React.FC<MainContentProps> = ({ 
  explanation, 
  activeTab, 
  scenario 
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'insight':
        return <InsightTab explanation={explanation} scenario={scenario} />;
      case 'reasoning':
        return <ReasoningTab explanation={explanation} />;
      case 'projection':
        return <ProjectionTab explanation={explanation} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
            {explanation.response || "Select an analysis from the chat history"}
          </h2>
          {explanation.confidence && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">Confidence Level:</span>
              <div className="flex items-center bg-slate-800/50 rounded-full px-3 py-1">
                <div className="w-16 bg-slate-700 rounded-full h-2 mr-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${explanation.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-white">
                  {explanation.confidence}%
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`}>
          {renderTabContent()}
        </div>
      </div>
    </main>
  );
};