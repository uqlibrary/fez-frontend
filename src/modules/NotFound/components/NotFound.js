import React from 'react';
import { useLocation } from 'react-router';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { useAccountContext } from 'context';
import { AUTH_URL_LOGIN } from 'config';
import { locale } from 'locale';
import { flattedPathConfig, fileRegexConfig } from 'config/routes';

export const NotFound = () => {
    const location = useLocation();
    const { account } = useAccountContext();

    const isValidRoute = flattedPathConfig.indexOf(location.pathname) >= 0;
    const isValidFileRoute = fileRegexConfig.test(location.pathname);

    if ((isValidRoute || isValidFileRoute) && account) {
        return <StandardPage standardPageId="permission-denied" {...locale.pages.permissionDenied} />;
    }

    if ((isValidRoute || isValidFileRoute) && !account) {
        // istanbul ignore next
        if (
            process.env.NODE_ENV !== 'test' &&
            process.env.NODE_ENV !== 'cc' &&
            process.env.NODE_ENV !== 'development'
        ) {
            // istanbul ignore next
            window.location.assign(`${AUTH_URL_LOGIN}?url=${window.btoa(window.location.href)}`);
        }
        return <StandardPage standardPageId="authentication-required" {...locale.pages.authenticationRequired} />;
    }

    return (
        !!account.id &&
        !isValidFileRoute &&
        !isValidRoute && <StandardPage standardPageId="not-found" {...locale.pages.notFound} />
    );
};

export default React.memo(NotFound);
