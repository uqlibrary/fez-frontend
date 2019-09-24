export default {
    admin: () => [
        {
            groups: [['internalNotes'], ['rek_herdc_notes']],
        },
    ],
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
        isDataset
            ? {
                title: 'Deposit agreement',
                groups: [['depositAgreement']],
            }
            : {
                title: 'Copyright agreement',
                groups: [['rek_copyright']],
            },
    ],
    grantInformation: () => [
        {
            title: 'Grant information',
            groups: [['grants']],
        },
    ],
    identifiers: ({ displayIdentifiers, displayLocation } = { displayIdentifiers: false, displayLocation: false }) => [
        {
            title: 'Manage identifiers',
            groups: [
                ['fez_record_search_key_doi'],
                ['fez_record_search_key_isi_loc', 'rek_wok_doc_type'],
                ['fez_record_search_key_scopus_id', 'rek_scopus_doc_type'],
                ['fez_record_search_key_pubmed_id', 'rek_pubmed_doc_type'],
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
                    groups: [['fez_record_search_key_location']],
                },
            ]
            : []),
    ],
};
