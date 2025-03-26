declare global {
    interface Window {
      botpressWebChat?: {
        toggleChat: () => void;
        sendEvent: (event: { type: string; channel: string; payload: any }) => void;
      };
    }
  }
  