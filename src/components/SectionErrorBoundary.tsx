import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; label?: string; }
interface State { crashed: boolean; }

/**
 * Lightweight error boundary for non-critical page sections.
 * If a section throws during render, hide it silently so the rest of
 * the page stays visible. A console.error is still emitted for debugging.
 */
class SectionErrorBoundary extends Component<Props, State> {
  state: State = { crashed: false };

  static getDerivedStateFromError(): State {
    return { crashed: true };
  }

  componentDidCatch(err: unknown, info: unknown) {
    console.error(`[SectionErrorBoundary] "${this.props.label ?? 'section'}" crashed:`, err, info);
  }

  render() {
    if (this.state.crashed) return null;
    return this.props.children;
  }
}

export default SectionErrorBoundary;
