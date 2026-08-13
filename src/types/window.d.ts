
interface WidgetLib {
  scanWidgets: () => void;
}

declare global {
  interface Window {
    widgetLib?: WidgetLib;
  }
}

export {};
