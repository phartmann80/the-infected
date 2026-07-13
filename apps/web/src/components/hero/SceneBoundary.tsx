'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type SceneBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type SceneBoundaryState = {
  failed: boolean;
};

export class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Hero 3D scene failed and fell back to poster layer.', error, errorInfo);
    }
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
