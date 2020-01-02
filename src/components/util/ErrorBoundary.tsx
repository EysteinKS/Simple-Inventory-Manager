import React, { Component, ReactNode } from 'react'

type State = {
  hasError: boolean
}

export default class ErrorBoundary extends Component<{}, State> {
  state = {
    hasError: false
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: (Error | null), info: any) {

  }

  render() {
    if (this.state.hasError) return (
      <div>
        
      </div>
    )

    return this.props.children
  }
}
