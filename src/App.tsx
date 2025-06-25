import React from 'react';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { ChatPanel } from './components/ChatPanel';
import { useXAI } from './hooks/useXAI';
import { useChat } from './hooks/useChat';
import { defaultScenario } from './data/scenarios';
import { ChatMessage } from './types';

function App() {
  const {
    currentExplanation,
    activeTab,
    confidence,
    suggestedPrompts,
    setActiveTab,
    updateExplanation
  } = useXAI(defaultScenario);

  const {
    chatHistory,
    isLoading,
    error,
    sendMessage,
    logEvent,
    chatContainerRef,
    clearError
  } = useChat(defaultScenario);

  const handleHistoryClick = (item: ChatMessage) => {
    if (item.type === 'ai_response' && item.details.response) {
      updateExplanation(item.details.response);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 font-inter overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <MainContent 
          explanation={currentExplanation}
          activeTab={activeTab}
          scenario={defaultScenario}
        />
      </div>

      {/* Chat Panel */}
      <ChatPanel
        chatHistory={chatHistory}
        isLoading={isLoading}
        error={error}
        suggestedPrompts={suggestedPrompts}
        onSendMessage={sendMessage}
        onHistoryClick={handleHistoryClick}
        onClearError={clearError}
        chatContainerRef={chatContainerRef}
      />

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
          }
          
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #475569;
            border-radius: 3px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background-color: #64748b;
          }
          
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          
          @keyframes fadeIn {
            from { 
              opacity: 0; 
              transform: translateY(10px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          .font-inter {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
          }

          /* Ensure proper text rendering */
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `
      }} />
    </div>
  );
}

export default App;