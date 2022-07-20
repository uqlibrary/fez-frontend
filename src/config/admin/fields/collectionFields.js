import commonFields from './commonFields';

export default {
    ...commonFields,
    admin: () => [
        {
            title: 'Member of Communities',
            groups: [['communities']],
        },
        {
            title: 'Collection Display Default',
            groups: [['fez_record_search_key_collection_view_type']],
        },
        {
            title: 'Cultural Institute (CI) Notice',
            groups: [['fez_record_search_key_ci_attr_incomplete']],
        },
    ],
    bibliographic: () => [
        {
            title: 'Collection Title',
            groups: [['rek_title']],
        },
        {
            title: 'Collection Description',
            groups: [['rek_description']],
        },
        {
            title: 'Keyword(s)',
            groups: [['fez_record_search_key_keywords']],
        },
    ],
    notes: () => [
        {
            title: 'Internal Notes',
            groups: [['internalNotes']],
        },
    ],
    reason: () => [
        {
            title: 'Reason for Edit',
            groups: [['reason']],
        },
    ],
};

export const validateCollection = () => ({});
