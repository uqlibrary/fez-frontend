import { useContext } from 'react';

import AccountContext from './AccountContext';
import FormErrorsContext from './FormErrorsContext';
import FormValuesContext from './FormValuesContext';
import OrcidSyncContext from './OrcidSyncContext';
import RecordContext from './RecordContext';
import TabbedContext from './TabbedContext';
import ScrollToSectionContext from './ScrollToSectionContext';

export const useAccountContext = () => useContext(AccountContext);
export const useFormErrorsContext = () => useContext(FormErrorsContext);
export const useFormValuesContext = () => useContext(FormValuesContext);
export const useOrcidSyncContext = () => useContext(OrcidSyncContext);
export const useRecordContext = () => useContext(RecordContext);
export const useTabbedContext = () => useContext(TabbedContext);
export const useScrollToSectionContext = () => useContext(ScrollToSectionContext);

export {
    AccountContext,
    FormErrorsContext,
    FormValuesContext,
    OrcidSyncContext,
    RecordContext,
    ScrollToSectionContext,
    TabbedContext,
};
