/**
 * Event Bus System
 * Simple event emitter for global component communication
 */

type EventCallback = (...args: any[]) => void

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map()
  
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    
    this.events.get(event)!.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.off(event, callback)
    }
  }
  
  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        this.events.delete(event)
      }
    }
  }
  
  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args)
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error)
        }
      })
    }
  }
  
  once(event: string, callback: EventCallback): () => void {
    const onceCallback = (...args: any[]) => {
      callback(...args)
      this.off(event, onceCallback)
    }
    
    return this.on(event, onceCallback)
  }
  
  clear(): void {
    this.events.clear()
  }
}

// Export singleton instance
export const eventBus = new EventBus()

// Define event types
export const EVENTS = {
  MILESTONE_UNLOCKED: 'milestone:unlocked',
  TREE_GROWTH: 'tree:growth',
  SOFIA_MODE_CHANGE: 'sofia:modeChange',
  DOCUMENT_CREATED: 'document:created',
  DOCUMENT_SHARED: 'document:shared',
  ANIMATION_COMPLETE: 'animation:complete',
} as const

export type EventType = typeof EVENTS[keyof typeof EVENTS]

// Helper hooks for React components
import { useEffect } from 'react'

export function useEventBus(
  event: EventType | string,
  handler: EventCallback,
  deps: any[] = []
) {
  useEffect(() => {
    const unsubscribe = eventBus.on(event, handler)
    return unsubscribe
  }, deps)
}

export function useEventEmitter() {
  return {
    emit: (event: EventType | string, ...args: any[]) => eventBus.emit(event, ...args),
    on: (event: EventType | string, callback: EventCallback) => eventBus.on(event, callback),
    off: (event: EventType | string, callback: EventCallback) => eventBus.off(event, callback),
  }
}
