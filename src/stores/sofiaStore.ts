import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SofiaMessage, SofiaContext } from '@/lib/sofia-types';

interface SofiaStore {
  // Chat state
  messages: SofiaMessage[];
  isTyping: boolean;
  isVisible: boolean;
  
  // User context for Sofia
  context: SofiaContext | null;
  
  // Actions
  addMessage: (message: SofiaMessage) => void;
  setMessages: (messages: SofiaMessage[]) => void;
  updateMessages: (updateFn: (messages: SofiaMessage[]) => SofiaMessage[]) => void;
  setTyping: (typing: boolean) => void;
  toggleVisibility: () => void;
  showSofia: () => void;
  hideSofia: () => void;
  updateContext: (context: Partial<SofiaContext>) => void;
  setContext: (context: SofiaContext) => void;
  clearMessages: () => void;
  
  // Helper getters
  getLastUserMessage: () => SofiaMessage | undefined;
  getMessageCount: () => number;
}

export const useSofiaStore = create<SofiaStore>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      isTyping: false,
      isVisible: false,
      context: null,

      // Actions
      addMessage: (message: SofiaMessage) => {
        set((state) => ({
          messages: [...state.messages, message]
        }));
      },

      setMessages: (messages: SofiaMessage[]) => {
        set({ messages });
      },

      updateMessages: (updateFn: (messages: SofiaMessage[]) => SofiaMessage[]) => {
        set((state) => ({
          messages: updateFn(state.messages)
        }));
      },

      setTyping: (typing: boolean) => {
        set({ isTyping: typing });
      },

      toggleVisibility: () => {
        set((state) => ({ isVisible: !state.isVisible }));
      },

      showSofia: () => {
        set({ isVisible: true });
      },

      hideSofia: () => {
        set({ isVisible: false });
      },

      updateContext: (newContext: Partial<SofiaContext>) => {
        set((state) => ({
          context: state.context
            ? { ...state.context, ...newContext }
            : newContext as SofiaContext
        }));
      },

      setContext: (context: SofiaContext) => {
        set({ context });
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      // Helper getters
      getLastUserMessage: () => {
        const { messages } = get();
        const userMessages = messages.filter(msg => msg.role === 'user');
        return userMessages[userMessages.length - 1];
      },

      getMessageCount: () => {
        const { messages } = get();
        return messages.length;
      }
    }),
    {
      name: 'sofia-store',
      // Only persist messages and context, not UI state
      partialize: (state) => ({
        messages: state.messages,
        context: state.context
      })
    }
  )
);

// Utility hook for getting current user context
export function useUserContext() {
  const context = useSofiaStore(state => state.context);
  const updateContext = useSofiaStore(state => state.updateContext);
  
  return { context, updateContext };
}