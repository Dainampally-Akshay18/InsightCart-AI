/**
 * Chat Memory System
 * Manages chat history and conversation state
 * Stores in-memory + localStorage for persistence
 */

const CHAT_STORAGE_KEY = 'insightcart_chat_history';

/**
 * Initialize chat memory
 * @returns {object} Memory object with methods
 */
export const initializeChatMemory = () => {
  // Load from localStorage if available
  let history = [];
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      history = JSON.parse(stored);
      if (!Array.isArray(history)) history = [];
    }
  } catch (err) {
    console.error('Failed to load chat history:', err);
    history = [];
  }

  return {
    history,
    
    /**
     * Add message to history
     * @param {string} role - 'user' or 'assistant'
     * @param {string} content - Message content
     * @param {object} metadata - Additional data (timestamp, etc)
     */
    addMessage(role, content, metadata = {}) {
      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role,
        content,
        timestamp: new Date().toISOString(),
        ...metadata
      };
      this.history.push(message);
      this.persist();
      return message;
    },

    /**
     * Get last N messages
     * @param {number} count - Number of messages to return
     * @returns {array}
     */
    getLastMessages(count = 10) {
      return this.history.slice(-count);
    },

    /**
     * Get conversation context for LLM
     * Formats messages for consumption by LangChain
     * @param {number} maxMessages - Max messages to include
     * @returns {array} Messages formatted for LLM
     */
    getConversationContext(maxMessages = 20) {
      return this.getLastMessages(maxMessages).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    },

    /**
     * Search messages
     * @param {string} query - Search query
     * @returns {array} Matching messages
     */
    search(query) {
      const lowerQuery = query.toLowerCase();
      return this.history.filter(msg =>
        msg.content.toLowerCase().includes(lowerQuery)
      );
    },

    /**
     * Clear all history
     */
    clearHistory() {
      this.history = [];
      localStorage.removeItem(CHAT_STORAGE_KEY);
    },

    /**
     * Persist to localStorage
     */
    persist() {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(this.history));
      } catch (err) {
        console.error('Failed to persist chat history:', err);
      }
    },

    /**
     * Get summary of conversation
     * @returns {object} Summary stats
     */
    getSummary() {
      const userMessages = this.history.filter(m => m.role === 'user').length;
      const assistantMessages = this.history.filter(m => m.role === 'assistant').length;

      return {
        totalMessages: this.history.length,
        userMessages,
        assistantMessages,
        isEmpty: this.history.length === 0,
        lastMessage: this.history.length > 0 ? this.history[this.history.length - 1] : null
      };
    }
  };
};

/**
 * Custom React hook for chat memory
 */
import { useState, useEffect, useCallback } from 'react';

export const useChatMemory = () => {
  const [memory, setMemory] = useState(null);
  const [summary, setSummary] = useState(null);

  // Initialize memory on mount
  useEffect(() => {
    const mem = initializeChatMemory();
    setMemory(mem);
    setSummary(mem.getSummary());
  }, []);

  const addMessage = useCallback((role, content, metadata = {}) => {
    if (!memory) return null;
    const msg = memory.addMessage(role, content, metadata);
    setSummary(memory.getSummary());
    return msg;
  }, [memory]);

  const clearHistory = useCallback(() => {
    if (!memory) return;
    memory.clearHistory();
    setSummary(memory.getSummary());
  }, [memory]);

  const getContext = useCallback((maxMessages = 20) => {
    if (!memory) return [];
    return memory.getConversationContext(maxMessages);
  }, [memory]);

  return {
    memory,
    summary,
    addMessage,
    clearHistory,
    getContext,
    messages: memory?.history || []
  };
};
