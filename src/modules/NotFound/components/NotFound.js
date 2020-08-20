import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { useAccountContext } from 'context';
import { AUTH_URL_LOGIN } from 'config';
import { locale } from 'locale';
import { flattedPathConfig, fileRegexConfig } from 'config/routes';
import { getFavouriteSearchAlias } from 'actions';

export const NotFound = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const { account } = useAccountContext();

    const existingAlias = useSelector(state => state.get('favouriteSearchReducer').existingAlias);
    const existingAliasChecking = useSelector(state => state.get('favouriteSearchReducer').existingAliasChecking);

    const isValidRoute = flattedPathConfig.indexOf(location.pathname) >= 0;
    const isValidFileRoute = fileRegexConfig.test(location.pathname);

    React.useEffect(() => {
        if (!!account && !isValidRoute && !isValidFileRoute && !existingAlias) {
            dispatch(getFavouriteSearchAlias({ fvs_alias: location.pathname.slice(1) }));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, existingAlias]);

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

    if (!!existingAlias) {
        history.push(existingAlias.fvs_search_parameters);
    }

    if (!!account.id && !isValidFileRoute && !isValidRoute && !existingAliasChecking) {
        return <StandardPage standardPageId="not-found" {...locale.pages.notFound} />;
    }

    return <div id="empty" />;
};

export default React.memo(NotFound);
