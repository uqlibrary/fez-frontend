import commonFields from './commonFields';

export default {
    ...commonFields,
    admin: () => [
        {
            title: 'Community details',
            groups: [['rek_title'], ['rek_description'], ['fez_record_search_key_keywords']],
        },
    ],
};

export const validateCommunity = () => ({});
