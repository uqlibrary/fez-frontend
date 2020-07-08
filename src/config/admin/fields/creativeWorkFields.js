import commonFields from './commonFields';

export default {
    ...commonFields,
    identifiers: (
        { displayAll, displayIdentifiers, displayLocation, displayIsmn, displayIsrc } = {
            displayAll: false,
            displayIdentifiers: false,
            displayLocation: false,
            displayIsmn: false,
            displayIsrc: false,
        },
    ) => [
        {
            title: 'Manage identifiers',
            groups: [
                [
                    'fez_record_search_key_doi',
                    displayIsmn && 'fez_record_search_key_ismn',
                    displayIsrc && 'fez_record_search_key_isrc',
                ].filter(Boolean),
                displayAll && [
                    ['fez_record_search_key_isi_loc', 'rek_wok_doc_type'],
                    ['fez_record_search_key_scopus_id', 'rek_scopus_doc_type'],
                    ['fez_record_search_key_pubmed_id', 'rek_pubmed_doc_type'],
                ],
            ].filter(Boolean),
        },
        {
            title: 'Manage links',
            groups: [['links']],
        },
        ...(displayIdentifiers
            ? [
                  {
                      title: 'Identifiers',
                      groups: [['fez_record_search_key_identifier']],
                  },
              ]
            : []),
        ...(displayLocation
            ? [
                  {
                      title: 'Location',
                      groups: [['fez_record_search_key_location_identifiers']],
                  },
              ]
            : []),
    ],
    bibliographic: (isLote = false, displayEndDate = false) => [
        {
            title: 'Title',
            groups: [['rek_title'], ...(isLote ? [['fez_record_search_key_translated_title']] : [])],
        },
        {
            title: 'Language of work',
            groups: [['languages']],
        },
        {
            title: 'ISBN',
            groups: [['fez_record_search_key_isbn']],
        },
        {
            title: 'ISSN',
            groups: [['issnField']],
        },
        {
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                [
                    'fez_record_search_key_edition',
                    'fez_record_search_key_volume_number',
                    'fez_record_search_key_issue_number',
                ],
                ['fez_record_search_key_series'],
                [
                    'fez_record_search_key_start_page',
                    'fez_record_search_key_end_page',
                    'fez_record_search_key_total_pages',
                ],
                ['rek_date', displayEndDate && 'fez_record_search_key_end_date_biblio'].filter(Boolean),
                ['fez_record_search_key_date_available'],
                ['rek_description'],
                ['fez_record_search_key_original_format'],
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
        {
            title: 'Related publications', // Succeeds
            groups: [['fez_record_search_key_isderivationof']],
        },
    ],
    authors: () => [
        {
            title: 'Authors',
            groups: [['authors']],
        },
        {
            title: 'Editors',
            groups: [['editors']],
        },
    ],
    admin: () => [
        {
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Additional information',
            groups: [
                ['rek_subtype'],
                [
                    'fez_record_search_key_herdc_code',
                    'fez_record_search_key_herdc_status',
                    'fez_record_search_key_institutional_status',
                ],
                ['fez_record_search_key_refereed_source', 'contentIndicators'],
                ['fez_record_search_key_oa_status', 'fez_record_search_key_oa_status_type'],
                ['additionalNotes'],
            ],
        },
        {
            title: 'Notes',
            groups: [['internalNotes'], ['rek_herdc_notes']],
        },
    ],
    ntro: (displayAudienceSize = false, displayIsrc = false, displayIsmn = false) => {
        return [
            !!displayAudienceSize && {
                title: 'Audience size',
                groups: [['fez_record_search_key_audience_size']],
            },
            {
                title: 'Scale/Significance of work & Creator research statement',
                groups: [['significanceAndContributionStatement']],
            },
            !!displayIsmn && {
                title: 'ISMN',
                groups: [['fez_record_search_key_ismn']],
            },
            !!displayIsrc && {
                title: 'ISRC',
                groups: [['fez_record_search_key_isrc']],
            },
            {
                title: 'Quality indicators',
                groups: [['qualityIndicators']],
            },
        ].filter(Boolean);
    },
};

export const validateCreativeWork = (
    { bibliographicSection: bs, filesSection: fs, authorsSection: as },
    { validationErrorsSummary: summary },
) => ({
    bibliographicSection: {
        ...((!((bs || {}).fez_record_search_key_place_of_publication || {}).rek_place_of_publication && {
            fez_record_search_key_place_of_publication: {
                rek_place_of_publication: summary.rek_place_of_publication,
            },
        }) ||
            {}),
    },
    filesSection: {
        ...((fs || {}).rek_copyright !== 'on' && {
            rek_copyright: summary.rek_copyright,
        }),
    },
    authorsSection: {
        ...(((as || {}).authors || []).length === 0 && {
            authors: summary.authors,
        }),
    },
});
