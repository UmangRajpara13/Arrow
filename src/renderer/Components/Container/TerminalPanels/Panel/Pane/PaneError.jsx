import React, { Component } from 'react'

export class PaneError extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        // console.log('render Fallback UI')
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        // console.log(error, errorInfo);
        // logErrorToMyService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1 style={{ color: 'var(--foreground)' }}>
                Something went wrong.
            </h1>;
        }

        return this.props.children;
    }
}

export default PaneError