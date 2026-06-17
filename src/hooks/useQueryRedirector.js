import React from 'react';
import { useLocation } from 'react-router';

export const customRedirector = ({ account = {}, rules = [], location = '' } = {}) => {
    const customKeys = Object.keys(rules);
    const urlParams = new URLSearchParams(location.search);

    for (const key of customKeys) {
        if (urlParams.has(key)) {
            if (
                rules[key].assert({
                    value: urlParams.get(key),
                    condition: rules[key].condition,
                    account,
                })
            ) {
                return rules[key].to;
            }
        }
    }
    return null;
};

export const useQueryRedirector = ({ account, basePath = '/', rules }) => {
    const location = useLocation();

    const customRedirect = React.useMemo(() => {
        // only apply custom redirects to root
        if (location.pathname !== basePath || location.search === '') return null;

        return customRedirector({ account, rules, location });
    }, [location, basePath, account, rules]);

    return { customRedirect };
};
