/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useState } from 'react';
import { useAccountContext, useRecordContext } from 'context';
import { contentIndicators, publicationTypes } from 'config';

export const usePublicationSubtype = (displayType = null, isAdmin = false) => {
    const { record } = useRecordContext();
    return (publicationTypes({}, isAdmin)[displayType || record.rek_display_type] || {}).subtypes || [];
};

export const useContentIndicators = (displayType = null) => {
    const { record } = useRecordContext();
    return contentIndicators(displayType || (record && record.rek_display_type));
};

export const userIsResearcher = () => {
    const { account } = useAccountContext();
    return (account.aut_org_username || account.aut_student_username || false) === account.id;
};

export const userIsAuthor = () => {
    const { account } = useAccountContext();
    const { record } = useRecordContext();

    return (
        account &&
        record.fez_record_search_key_author_id &&
        !!record.fez_record_search_key_author_id.some(authors => {
            return parseInt(authors.rek_author_id, 10) === parseInt(account.aut_id, 10);
        })
    );
};

export const useConfirmationState = () => {
    const [isOpen, setIsOpen] = useState(false);

    const showConfirmation = useCallback(() => {
        setIsOpen(true);
    }, []);

    const hideConfirmation = useCallback(() => {
        setIsOpen(false);
    }, []);

    return [isOpen, showConfirmation, hideConfirmation];
};

export { userIsAdmin } from './userIsAdmin';
export { useIsUserSuperAdmin } from './useIsUserSuperAdmin';
export { useRecordsSelector } from './useRecordsSelector';
export { useWidth } from './useWidth';
export { withIsMobileView, useIsMobileView } from './useIsMobileView';
