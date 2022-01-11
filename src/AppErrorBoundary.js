import React from 'react';
import PropTypes from 'prop-types';
import Raven from 'raven-js';

class AppErrorBoundary extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    };

    componentDidMount() {
        if (process.env.ENABLE_LOG) {
            Raven.config('https://2e8809106d66495ba3023139b1bcfbe5@sentry.io/301681', {
                environment: process.env.BRANCH,
                release: process.env.GIT_SHA,
                whitelistUrls: [/library\.uq\.edu\.au/],
            }).install();
        }
    }

    componentDidCatch(error, errorInfo) {
        if (process.env.ENABLE_LOG) Raven.captureException(error, { extra: errorInfo });
    }

    render() {
        return this.props.children;
    }
}

export default AppErrorBoundary;
