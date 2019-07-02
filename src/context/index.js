import { useContext } from 'react';

import AccountContext from './AccountContext';
import FormValuesContext from './FormValuesContext';
import RecordContext from './RecordContext';
import TabbedContext from './TabbedContext';

export const useAccountContext = () => useContext(AccountContext);
export const useFormValuesContext = () => useContext(FormValuesContext);
export const useRecordContext = () => useContext(RecordContext);
export const useTabbedContext = () => useContext(TabbedContext);

export {
    AccountContext,
    FormValuesContext,
    RecordContext,
    TabbedContext,
};
