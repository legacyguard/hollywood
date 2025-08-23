import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@/components/ui/icon-library';
import { useSofiaStore } from '@/stores/sofiaStore';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// New guided dialog imports
import { sofiaRouter } from '@/lib/sofia-router';
import { SofiaMessage, ActionButton, SofiaCommand, getContextualActions } from '@/lib/sofia-types';
import SofiaActionButtons from './SofiaActionButtons';

interface SofiaChatV2Props {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  variant?: 'floating' | 'embedded' | 'fullscreen';
}

const SofiaChatV2: React.FC<SofiaChatV2Props> = ({
  isOpen = false,
  onClose,
  className = '',
  variant = 'floating'
}) => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isTyping,
    context,
    addMessage,
    setTyping,
  } = useSofiaStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Initialize with guided welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0 && context && isOpen) {
      initializeGuidedDialog();
    }
  }, [isOpen, messages.length, context]);

  const initializeGuidedDialog = async () => {
    if (!context || !userId) return;

    setIsProcessing(true);
    setTyping(true);

    try {
      // Create welcome command
      const welcomeCommand: SofiaCommand = {
        id: crypto.randomUUID(),
        command: 'show_sofia',
        category: 'ui_action',
        context,
        timestamp: new Date()
      };

      // Process through router
      const result = await sofiaRouter.processCommand(welcomeCommand);
      
      // Simulate typing delay
      setTimeout(() => {
        const welcomeMessage: SofiaMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.payload.message || getDefaultWelcome(),
          timestamp: new Date(),
          actions: result.payload.actions || getContextualActions(context),
          responseType: 'welcome',
          metadata: {
            cost: result.cost,
            source: 'predefined'
          }
        };

        addMessage(welcomeMessage);
        setTyping(false);
        setIsProcessing(false);
      }, 1000);

    } catch (error) {
      console.error('[Sofia] Error initializing dialog:', error);
      const errorMessage: SofiaMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, an error occurred during initialization. Please try again.',
        timestamp: new Date(),
        responseType: 'error',
        metadata: { cost: 'free', source: 'predefined' }
      };
      addMessage(errorMessage);
      setTyping(false);
      setIsProcessing(false);
    }
  };

  const handleActionClick = async (action: ActionButton) => {
    if (!context || !userId) return;

    // Add user action as message
    const userMessage: SofiaMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: `🎯 ${action.text}`,
      timestamp: new Date(),
      metadata: { cost: 'free', source: 'predefined' }
    };
    addMessage(userMessage);

    // Show confirmation for premium actions
    if (action.requiresConfirmation) {
      const confirmed = await showConfirmation(action);
      if (!confirmed) {
        const cancelMessage: SofiaMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Rozumiem, zrušené. Čo môžem urobiť ešte?',
          timestamp: new Date(),
          actions: getContextualActions(context),
          responseType: 'information',
          metadata: { cost: 'free', source: 'predefined' }
        };
        addMessage(cancelMessage);
        return;
      }
    }

    setIsProcessing(true);
    setTyping(true);

    try {
      // Create command
      const command: SofiaCommand = {
        id: crypto.randomUUID(),
        command: action.id,
        category: action.category,
        parameters: action.payload,
        context,
        timestamp: new Date()
      };

      // Process through router
      const result = await sofiaRouter.processCommand(command);

      // Handle different result types
      await handleCommandResult(result, action);

    } catch (error) {
      console.error('[Sofia] Error processing action:', error);
      handleError('I apologize, an error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
      setTyping(false);
    }
  };

  const handleCommandResult = async (result: any, action: ActionButton) => {
    switch (result.type) {
      case 'navigation':
        // Navigate to route
        if (result.payload.route) {
          navigate(result.payload.route);
          if (onClose) onClose(); // Close chat on navigation
          
          // Add confirmation message
          const navMessage: SofiaMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `Presmerúvam vás na ${getRouteName(result.payload.route)}...`,
            timestamp: new Date(),
            responseType: 'confirmation',
            metadata: { cost: result.cost, source: 'predefined' }
          };
          addMessage(navMessage);
        }
        break;

      case 'ui_action':
        // Handle UI actions
        handleUIAction(result.payload);
        break;

      case 'response':
        // Add Sofia's response
        setTimeout(() => {
          const responseMessage: SofiaMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: result.payload.message,
            timestamp: new Date(),
            actions: result.payload.actions,
            responseType: 'information',
            metadata: { cost: result.cost, source: 'predefined' }
          };
          addMessage(responseMessage);
        }, 800);
        break;

      case 'error':
        handleError(result.payload.message);
        break;
    }
  };

  const handleUIAction = (payload: any) => {
    switch (payload.action) {
      case 'open_uploader':
        // Trigger document uploader
        const event = new CustomEvent('sofia:open_uploader', { detail: payload });
        window.dispatchEvent(event);
        
        const uploaderMessage: SofiaMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: payload.message || 'Otváram nahrávač dokumentov...',
          timestamp: new Date(),
          responseType: 'confirmation',
          metadata: { cost: 'free', source: 'predefined' }
        };
        addMessage(uploaderMessage);
        break;

      case 'show_progress_modal':
        // Show progress modal
        const progressEvent = new CustomEvent('sofia:show_progress', { detail: payload.data });
        window.dispatchEvent(progressEvent);
        break;

      default:
        console.warn('[Sofia] Unknown UI action:', payload.action);
    }
  };

  const handleTextInput = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !context || !userId || isProcessing) return;

    const userMessage: SofiaMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      metadata: { cost: 'free', source: 'predefined' }
    };
    addMessage(userMessage);
    setInputValue('');
    setIsProcessing(true);
    setTyping(true);

    try {
      // Create free-form command
      const command: SofiaCommand = {
        id: crypto.randomUUID(),
        command: userMessage.content,
        category: 'ai_query', // Will be routed appropriately
        context,
        timestamp: new Date()
      };

      // Process through router
      const result = await sofiaRouter.processCommand(command);
      await handleCommandResult(result, {} as ActionButton);

    } catch (error) {
      console.error('[Sofia] Error processing text input:', error);
      handleError('I apologize, I don\'t understand. Please try one of the suggested options.');
    } finally {
      setIsProcessing(false);
      setTyping(false);
    }
  };

  const handleError = (message: string) => {
    const errorMessage: SofiaMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: message,
      timestamp: new Date(),
      actions: context ? getContextualActions(context) : [],
      responseType: 'error',
      metadata: { cost: 'free', source: 'predefined' }
    };
    addMessage(errorMessage);
  };

  const showConfirmation = async (action: ActionButton): Promise<boolean> => {
    return new Promise((resolve) => {
      const confirmMessage = `${action.text}\n\n${action.description}\n\nPokračovať?`;
      const confirmed = window.confirm(confirmMessage);
      resolve(confirmed);
    });
  };

  const getDefaultWelcome = (): string => {
    if (!context) return 'Dobrý deň! Som Sofia a som tu, aby som vám pomohla.';
    
    const name = context.userName || 'tam';
    return `Dobrý deň, ${name}! Som Sofia a som tu, aby som vám pomohla chrániť vašu rodinu. Ako vám môžem dnes pomôcť?`;
  };

  const getRouteName = (route: string): string => {
    const routeNames: Record<string, string> = {
      '/vault': 'váš trezor',
      '/guardians': 'správu strážcov',
      '/legacy': 'vytváranie závetu',
      '/': 'dashboard'
    };
    return routeNames[route] || route;
  };

  const renderMessage = (message: SofiaMessage) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon name="bot" className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div className={`max-w-[85%] ${message.role === 'user' ? 'order-first' : ''}`}>
        <div
          className={`p-4 rounded-lg ${
            message.role === 'user'
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {message.role === 'assistant' ? (
            <div className="prose prose-sm dark:prose-invert max-w-none [&>*:last-child]:mb-0">
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm">{message.content}</p>
          )}
        </div>
        
        {/* Action Buttons for assistant messages */}
        {message.role === 'assistant' && message.actions && (
          <SofiaActionButtons
            actions={message.actions}
            onActionClick={handleActionClick}
            isDisabled={isProcessing}
          />
        )}
        
        <div className={`text-xs text-muted-foreground mt-2 flex items-center gap-2 ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        }`}>
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          
          {/* Cost/Source indicator */}
          {message.metadata && message.role === 'assistant' && (
            <span className="opacity-60">
              {message.metadata.cost === 'premium' && '⭐'}
              {message.metadata.cost === 'low_cost' && '⚡'}
              {message.metadata.cost === 'free' && '🆓'}
            </span>
          )}
        </div>
      </div>
      
      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <Icon name="user" className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  );

  const renderTypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 mb-6"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon name="bot" className="w-4 h-4 text-primary" />
      </div>
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </motion.div>
  );

  if (!context) {
    return null; // Don't render if no context is available
  }

  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Icon name="bot" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Sofia</h3>
            <p className="text-sm text-muted-foreground">Váš digitálny sprievodca</p>
          </div>
        </div>
        
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <Icon name="x" className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(renderMessage)}
          <AnimatePresence>
            {isTyping && renderTypingIndicator()}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Input - simplified, actions are primary */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleTextInput} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Alebo napíšte vlastnú otázku..."
            disabled={isProcessing}
            className="flex-1 text-sm"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            size="sm"
            variant="outline"
          >
            {isProcessing ? (
              <Icon name="loader-2" className="w-4 h-4 animate-spin" />
            ) : (
              <Icon name="send" className="w-4 h-4" />
            )}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Tip: Použite tlačidlá hore pre najrýchlejšie odpovede 🚀
        </p>
      </div>
    </div>
  );

  // Render variants
  if (variant === 'embedded') {
    return (
      <Card className={`h-[600px] ${className}`}>
        {chatContent}
      </Card>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          >
            <div className="container mx-auto h-full max-w-4xl p-4">
              <Card className="h-full">
                {chatContent}
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Default floating variant
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`fixed bottom-4 right-4 w-96 h-[600px] z-50 ${className}`}
        >
          <Card className="h-full shadow-lg border-primary/20">
            {chatContent}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SofiaChatV2;