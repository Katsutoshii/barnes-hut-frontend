import React from "react";

type Props = {};
type State = {
  error: Error;
};

export default class ErrorBoundary extends React.Component<
  Props,
  State
> {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error != null) {
      // You can render any custom fallback UI
      return (
        <h1 className="error-text">{`Something went wrong: ${error.message}`}</h1>
      );
    }

    return this.props.children;
  }
}
