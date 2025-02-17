export default {
    bibliographic: () => [
        {
            title: 'Title',
            groups: [['rek_title']],
        },
        {
            title: 'Bibliographic',
            groups: [['rek_date'], ['rek_description']],
        },
        {
            title: 'Model',
            groups: [['fez_record_search_key_model']],
        },
        {
            title: 'Measured variable',
            groups: [['fez_record_search_key_measured_variable']],
        },
        {
            title: 'Instrument type',
            groups: [['fez_record_search_key_instrument_type']],
        },
    ],
    authors: () => [
        {
            title: 'Manufacturer',
            groups: [['authors']],
        },
    ],
    admin: () => [
        {
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Instrument information',
            groups: [['contactName', 'contactNameId'], ['contactEmail'], ['ownerIdentifier', 'ownerIdentifierType']],
        },
        {
            title: 'Additional information',
            groups: [['fez_record_search_key_start_date'], ['fez_record_search_key_end_date']],
        },
    ],
    files: () => [
        {
            groups: [['fez_datastream_info']],
        },
        {
            title: 'Files',
            groups: [['files']],
        },
        {
            title: 'Copyright agreement',
            groups: [['rek_copyright']],
        },
    ],
    identifiers: () => [
        {
            title: 'Manage identifiers',
            groups: [['fez_record_search_key_doi'], ['alternateIdentifiers']],
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
    ntro: () => [],
};

export const validateInstrument = (
    { bibliographicSection: bs, adminSection: ais, authorsSection: as },
    { validationErrorsSummary: summary },
) => ({
    bibliographicSection: {
        ...((!((bs || {}).fez_record_search_key_publisher || {}).rek_publisher && {
            fez_record_search_key_publisher: {
                rek_publisher: summary.rek_publisher,
            },
        }) ||
            {}),
    },
    adminSection: {
        ...((!(ais || {}).contactName && {
            contactName: summary.contactName,
        }) ||
            {}),
        ...((!(ais || {}).contactEmail && {
            contactEmail: summary.contactEmail,
        }) ||
            {}),
    },
    authorsSection: {
        ...(((as || {}).authors || []).length === 0 && {
            authors: summary.authors,
        }),
    },
});
