export default {
    admin: () => [
        {
            groups: [
                ['jnl_title'],
                ['jnl_abbrev_title'],
                ['jnl_publisher'],
                ['refereed', 'publicationYear', 'publicationFrequency'],
                ['publicationFormats'],
                ['description'],
            ],
        },
        {
            title: 'Advisory statement',
            groups: [['advisoryStatement']],
        },
    ],
    bibliographic: () => [
        {
            title: 'ISSN',
            groups: [['issns']],
        },
    ],
    uqData: () => [
        {
            groups: [['uqData']],
        },
    ],
    readAndPublish: () => [
        {
            groups: [['readAndPublish']],
        },
    ],
    doaj: () => [
        {
            groups: [['doaj']],
        },
    ],
    listed: () => [
        {
            groups: [['listed']],
        },
    ],
};

export const validateAdminJournal = () => ({});
