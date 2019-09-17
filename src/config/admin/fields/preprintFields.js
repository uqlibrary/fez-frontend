import commonFields from './commonFields';

export default {
    ...commonFields,
    bibliographic: () => [
        {
            title: 'Title',
            groups: [['rek_title']],
        },
        {
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_publisher'],
                ['rek_date', 'fez_record_search_key_refereed_source'],
                ['rek_description'],
            ],
        },
        {
            title: 'Keyword(s)',
            groups: [['fez_record_search_key_keywords']],
        },
        {
            title: 'Subject',
            groups: [['subjects']],
        },
    ],
    authors: () => [
        {
            title: 'Creators',
            groups: [['authors']],
        },
        {
            title: 'Contributors',
            groups: [['editors']],
        },
    ],
    additionalInformation: () => [
        {
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Additional information',
            groups: [
                ['fez_record_search_key_herdc_code', 'fez_record_search_key_herdc_status'],
                ['fez_record_search_key_institutional_status', 'fez_record_search_key_oa_status', 'contentIndicators'],
                ['additionalNotes'],
            ],
        },
    ],
    ntro: () => [],
};
