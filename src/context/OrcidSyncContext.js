import { createContext } from 'react';

export const OrcidSyncContext = createContext({
    showSyncUI: false,
    orcidSyncProps: {},
});

export default OrcidSyncContext;
