import commonFields from './commonFields';

export default {
    ...commonFields,
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
    admin: () => [
        {
            title: 'Member of Communities',
            groups: [['communities']],
        },
    ],
};

export const validateCollection = () => ({});
