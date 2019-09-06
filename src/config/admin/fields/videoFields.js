import commonFields from './commonFields';

export default {
    ...commonFields,
    admin: () => [
        {
            groups: [['internalNotes']],
        },
    ],
    identifiers: () => [
        {
            title: 'Manage links',
            groups: [['links']],
        },
    ],
    bibliographic: (isLote = false) => [
        {
            groups: [
                ['rek_title'],
                ...(isLote
                    ? [
                        ['languageOfTitle'],
                        ['fez_record_search_key_native_script_title'],
                        ['fez_record_search_key_translated_title'],
                        ['fez_record_search_key_roman_script_title'],
                    ]
                    : []),
                ['languages'],
            ],
        },
    ],
    authors: () => [
        {
            title: 'Author',
            groups: [['authors']],
        },
        {
            title: 'Editor',
            groups: [['editors']],
        },
    ],
    additionalInformation: () => [],
    ntro: () => [],
};
