// Debug utilities for development environment
export class DebugUtils {
  private static isDev = import.meta.env.DEV;
  private static debugMode = localStorage.getItem('hobby-hunter-debug') === 'true';

  // Enable/disable debug mode
  static toggleDebugMode(): boolean {
    const newMode = !this.debugMode;
    this.debugMode = newMode;
    localStorage.setItem('hobby-hunter-debug', newMode.toString());
    
    if (newMode) {
      this.addDebugStyles();
      console.log('🐛 Debug mode enabled');
    } else {
      this.removeDebugStyles();
      console.log('🐛 Debug mode disabled');
    }
    
    return newMode;
  }

  // Check if debug mode is active
  static isDebugMode(): boolean {
    return this.isDev && this.debugMode;
  }

  // Add visual debugging styles
  private static addDebugStyles(): void {
    if (!this.isDev) return;

    const existingStyle = document.getElementById('debug-styles');
    if (existingStyle) return;

    const style = document.createElement('style');
    style.id = 'debug-styles';
    style.textContent = `
      /* Debug Mode Styles */
      * {
        outline: 1px solid rgba(255, 0, 0, 0.1) !important;
      }
      
      div {
        outline-color: rgba(0, 255, 0, 0.2) !important;
      }
      
      section {
        outline-color: rgba(0, 0, 255, 0.3) !important;
        outline-width: 2px !important;
      }
      
      [class*="grid"] {
        outline-color: rgba(255, 255, 0, 0.4) !important;
        outline-width: 2px !important;
      }
      
      [class*="flex"] {
        outline-color: rgba(255, 0, 255, 0.3) !important;
      }
      
      /* Debug info overlay */
      body::before {
        content: "🐛 DEBUG MODE ACTIVE";
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        font-family: monospace;
        z-index: 10000;
        pointer-events: none;
      }
    `;
    
    document.head.appendChild(style);
  }

  // Remove debug styles
  private static removeDebugStyles(): void {
    const style = document.getElementById('debug-styles');
    if (style) {
      style.remove();
    }
  }

  // Log component render with timing
  static logRender(componentName: string, props?: any): void {
    if (!this.isDev || !this.debugMode) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`🎨 [${timestamp}] Rendering: ${componentName}`, props);
  }

  // Log data fetching
  static logDataFetch(operation: string, data?: any): void {
    if (!this.isDev || !this.debugMode) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`📡 [${timestamp}] Data: ${operation}`, data);
  }

  // Log errors with context
  static logError(error: Error, context?: string): void {
    if (!this.isDev) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.error(`❌ [${timestamp}] Error${context ? ` in ${context}` : ''}:`, error);
  }

  // Performance monitoring
  static startTimer(label: string): void {
    if (!this.isDev || !this.debugMode) return;
    console.time(`⏱️ ${label}`);
  }

  static endTimer(label: string): void {
    if (!this.isDev || !this.debugMode) return;
    console.timeEnd(`⏱️ ${label}`);
  }

  // Component lifecycle tracking
  static trackMount(componentName: string): void {
    if (!this.isDev || !this.debugMode) return;
    console.log(`🟢 Mounted: ${componentName}`);
  }

  static trackUnmount(componentName: string): void {
    if (!this.isDev || !this.debugMode) return;
    console.log(`🔴 Unmounted: ${componentName}`);
  }

  // Store state changes
  static logStateChange(storeName: string, action: string, newState?: any): void {
    if (!this.isDev || !this.debugMode) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`🏪 [${timestamp}] ${storeName}: ${action}`, newState);
  }

  // Initialize debug mode if enabled
  static init(): void {
    if (!this.isDev) return;

    // Check if debug mode should be enabled
    if (this.debugMode) {
      this.addDebugStyles();
    }

    // Add global debug functions
    if (typeof window !== 'undefined') {
      (window as any).hobbyHunterDebug = {
        toggle: () => this.toggleDebugMode(),
        enable: () => {
          this.debugMode = true;
          localStorage.setItem('hobby-hunter-debug', 'true');
          this.addDebugStyles();
        },
        disable: () => {
          this.debugMode = false;
          localStorage.setItem('hobby-hunter-debug', 'false');
          this.removeDebugStyles();
        },
        status: () => this.debugMode
      };

      console.log('🔧 Debug utilities available: window.hobbyHunterDebug');
      console.log('   • toggle() - Toggle debug mode');
      console.log('   • enable() - Enable debug mode');
      console.log('   • disable() - Disable debug mode');
      console.log('   • status() - Check debug status');
    }
  }

  // Visual component boundary indicator
  static addComponentBoundary(element: HTMLElement, componentName: string): void {
    if (!this.isDev || !this.debugMode) return;

    element.setAttribute('data-component', componentName);
    element.style.position = 'relative';
    
    // Add component name label
    const label = document.createElement('div');
    label.textContent = componentName;
    label.style.cssText = `
      position: absolute;
      top: -20px;
      left: 0;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 2px 6px;
      font-size: 10px;
      font-family: monospace;
      border-radius: 2px;
      z-index: 9999;
      pointer-events: none;
    `;
    element.appendChild(label);
  }
}

// Auto-initialize debug utils
DebugUtils.init();