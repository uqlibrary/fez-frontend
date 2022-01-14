import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

class AppErrorBoundary extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    };

    componentDidMount() {
        if (process.env.ENABLE_LOG) {
            Sentry.init({
                dsn: 'https://2e8809106d66495ba3023139b1bcfbe5@sentry.io/301681',
                integrations: [new Integrations.BrowserTracing()],
                environment: process.env.BRANCH,
                release: process.env.GIT_SHA,
                allowUrls: [/library\.uq\.edu\.au/],
                ignoreErrors: ['Object Not Found Matching Id'],
            });
        }
    }

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
