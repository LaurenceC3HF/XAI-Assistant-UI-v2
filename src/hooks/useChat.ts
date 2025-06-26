import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, XAIExplanation } from '../types';
import { useInteractionLog } from './useInteractionLog';
import { generateScriptedResponse } from '../utils/scriptedResponses';

export const useChat = (initialScenario: any) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { logInteraction } = useInteractionLog();

  const logEvent = useCallback(
    (type: ChatMessage['type'], details: ChatMessage['details']) => {
      const newMessage: ChatMessage = {
        timestamp: new Date().toISOString(),
        type,
        details
      };
      setChatHistory(prev => [...prev, newMessage]);
      logInteraction({
        eventType: type,
        timestamp: newMessage.timestamp,
        metadata: details
      });
    },
    [logInteraction]
  );

  const sendMessage = useCallback(async (message: string): Promise<XAIExplanation | null> => {
    if (!message.trim() || isLoading) return null;
    
    setError(null);
    logEvent('user_query', { query: message });
    setIsLoading(true);

    try {
      // Simulate realistic processing time
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const response = generateScriptedResponse(message);
      logEvent('ai_response', { question: message, response });
      return response;
    } catch (err) {
      const errorMessage = 'Unable to process query. Please try again.';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, logEvent]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return {
    chatHistory,
    isLoading,
    error,
    sendMessage,
    logEvent,
    chatContainerRef,
    clearError: () => setError(null)
  };
};