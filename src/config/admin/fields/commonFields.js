export default {
    files: ({ isDataset } = { isDataset: false }) => [
        {
            groups: [['fez_datastream_info']],
        },
        {
            title: 'Files',
            groups: [['files']],
        },
        {
            title: 'Advisory statement',
            groups: [['advisoryStatement']],
        },
        {
            title: 'Sensitive Handling Note',
            groups: [['sensitiveHandlingNote']],
        },
        {
            title: isDataset ? 'Deposit agreement' : 'Copyright agreement',
            groups: [['rek_copyright']],
        },
    ],
    grantInformation: () => [
        {
            title: 'Grant information',
            groups: [['grants']],
        },
    ],
    identifiers: (
        {
            displayAll,
            displayIdentifiers,
            displayIsmn,
            displayIsrc,
            displayLocation,
            displayPubmed,
            displayPubmedCentral,
        } = {
            displayAll: false,
            displayIdentifiers: false,
            displayIsmn: false,
            displayIsrc: false,
            displayLocation: false,
            displayPubmed: true,
            displayPubmedCentral: false,
        },
    ) => [
        {
            title: 'Manage identifiers',
            groups: [
                ['fez_record_search_key_doi'],
                ...(displayIsmn ? [['fez_record_search_key_ismn']] : []),
                ...(displayIsrc ? [['fez_record_search_key_isrc']] : []),
                ...(displayAll
                    ? [
                          ['fez_record_search_key_isi_loc', 'rek_wok_doc_type'],
                          ['fez_record_search_key_scopus_id', 'rek_scopus_doc_type'],
                          ['fez_record_search_key_openalex_id', 'rek_openalex_doc_type'],
                      ]
                    : []),
                ...(displayPubmed ? [['fez_record_search_key_pubmed_id', 'rek_pubmed_doc_type']] : []),
                ...(displayPubmedCentral ? [['fez_record_search_key_pubmed_central_id']] : []),
            ],
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
                      groups: [['locations']],
                  },
              ]
            : []),
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
        {
            title: 'Cultural Institute (CI) Notice',
            groups: [['rek_ci_notice_attribution_incomplete']],
        },
    ],
};
