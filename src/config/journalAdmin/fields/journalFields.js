export default {
    admin: () => [
        {
            groups: [
                ['jnl_title'],
                ['abbreviatedTitle'],
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
