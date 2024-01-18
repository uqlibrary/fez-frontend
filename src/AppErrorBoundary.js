import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/react';

class AppErrorBoundary extends React.Component {
    static getDerivedStateFromError(error) {
        console.error(error);
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    static propTypes = {
        children: PropTypes.node,
    };
    componentDidCatch(error, errorInfo) {
        if (process.env.ENABLE_LOG) {
            Sentry.withScope(scope => {
                scope.setExtras(errorInfo);
                Sentry.captureException(error);
            });
        }
    }

    render() {
        return this.props.children;
    }
}

export default AppErrorBoundary;
