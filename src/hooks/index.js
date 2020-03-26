/* eslint-disable react-hooks/rules-of-hooks */
import { useRecordContext, useAccountContext } from 'context';
import { publicationTypes } from 'config';
import { USER_IDS_WITH_LEGACY_LINK } from 'config/admin/adminInterface';

export const usePublicationSubtype = (displayType = null) => {
    const { record } = useRecordContext();
    return publicationTypes()[displayType || record.rek_display_type].subtypes || [];
};

export const userIsAdmin = () => {
    const { account } = useAccountContext();
    return !!account.is_administrator;
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

export const userHasNewAdminEdit = () => {
    const { account } = useAccountContext();
    return !!account && USER_IDS_WITH_LEGACY_LINK.includes(account.id);
};
