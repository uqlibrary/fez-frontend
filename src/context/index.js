import { useContext } from 'react';

import AccountContext from './AccountContext';
import EditableContext from './EditableContext';
import FormErrorsContext from './FormErrorsContext';
import LocallyStoredReducerContext from './LocallyStoredReducerContext';
import OrcidSyncContext from './OrcidSyncContext';
import RecordContext from './RecordContext';
import RecordsSelectorContext from './RecordsSelectorContext';
import TabbedContext from './TabbedContext';
import ScrollToSectionContext from './ScrollToSectionContext';
import JournalContext from './JournalContext';

export const useAccountContext = () => useContext(AccountContext);
export const useEditableContext = () => useContext(EditableContext);
export const useFormErrorsContext = () => useContext(FormErrorsContext);
export const useLocallyStoredReducerContext = () => useContext(LocallyStoredReducerContext);
export const useOrcidSyncContext = () => useContext(OrcidSyncContext);
export const useRecordContext = () => useContext(RecordContext);
export const useRecordsSelectorContext = () => useContext(RecordsSelectorContext);
export const useTabbedContext = () => useContext(TabbedContext);
export const useScrollToSectionContext = () => useContext(ScrollToSectionContext);
export const useJournalContext = () => useContext(JournalContext);

export {
    AccountContext,
    EditableContext,
    FormErrorsContext,
    LocallyStoredReducerContext,
    OrcidSyncContext,
    RecordContext,
    RecordsSelectorContext,
    ScrollToSectionContext,
    TabbedContext,
    JournalContext,
};
