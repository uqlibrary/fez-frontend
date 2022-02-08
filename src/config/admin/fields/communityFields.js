// /import commonFields from './commonFields';

export default {
    // ...commonFields,
    // eslint-disable-next-line no-unused-vars
    files: ({ isDataset } = { isDataset: false }) => [
        {
            title: 'Files',
            groups: [['files']],
        },
    ],
    bibliographic: () => [
        {
            title: 'Community Title',
            groups: [['rek_title']],
        },
        {
            title: 'Community Description',
            groups: [['rek_description']],
        },
        {
            title: 'Keyword(s)',
            groups: [['fez_record_search_key_keywords']],
        },
    ],
    notes: () => [
        {
            title: 'Additional notes',
            groups: [['additionalNotes']],
        },
        {
            title: 'Internal notes',
            groups: [['internalNotes']],
        },
    ],
};

export const validateCommunity = () => ({});
