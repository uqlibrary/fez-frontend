import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getInitialFormValues } from './helpers';

export const useJournal = () => {
    const { journalToView, isJournalLocked, loadingJournalToView, journalToViewError, journalLoadingError, error } =
        useSelector(state => state.get('viewJournalReducer'));

    const { authorDetails, author } = useSelector(state => state.get('accountReducer'));
    const values = useMemo(() => {
        const initialFormValues =
            (!!journalToView && journalToView.jnl_jid && getInitialFormValues(journalToView)) || {};
        return {
            journalToViewLoading: loadingJournalToView,
            authorDetails: authorDetails ?? /* istanbul ignore next */ null,
            author,
            journalToView,
            journalToViewError,
            journalLoadingError,
            ...initialFormValues,
            locked: isJournalLocked,
            error,
        };
    }, [
        author,
        authorDetails,
        isJournalLocked,
        journalLoadingError,
        journalToView,
        journalToViewError,
        loadingJournalToView,
        error,
    ]);
    return { ...values };
};
