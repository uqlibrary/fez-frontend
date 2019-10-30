/* eslint-disable react-hooks/rules-of-hooks */
import { useRecordContext, useAccountContext } from 'context';
import { publicationTypes } from 'config';
import {
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_CREATIVE_WORK,
    PUBLICATION_TYPE_DESIGN,
    PUBLICATION_TYPE_IMAGE,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_MANUSCRIPT,
    PUBLICATION_TYPE_RESEARCH_REPORT,
} from 'config/general';

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

export const publicationTypeHasAdvisoryStatement = record => {
    const publicationTypesWithAdvisoryStatement = [
        PUBLICATION_TYPE_AUDIO_DOCUMENT,
        PUBLICATION_TYPE_BOOK_CHAPTER,
        PUBLICATION_TYPE_BOOK,
        PUBLICATION_TYPE_DESIGN,
        PUBLICATION_TYPE_CREATIVE_WORK,
        PUBLICATION_TYPE_RESEARCH_REPORT,
        PUBLICATION_TYPE_JOURNAL_ARTICLE,
        PUBLICATION_TYPE_IMAGE,
        PUBLICATION_TYPE_MANUSCRIPT,
    ];
    return publicationTypesWithAdvisoryStatement.includes(record.rek_display_type);
};
