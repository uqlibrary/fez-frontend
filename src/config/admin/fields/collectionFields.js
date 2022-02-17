import commonFields from './commonFields';

export default {
    ...commonFields,
    admin: () => [
        {
            title: 'Member of Communities',
            groups: [['communities']],
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
        {
            title: 'Reason for Edit',
            groups: [['reasonForEdit']],
        },
    ],
};

export const validateCollection = () => ({});
