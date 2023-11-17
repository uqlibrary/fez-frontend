export default {
    admin: () => [
        {
            groups: [
                ['jnl_title'],
                ['abbreviatedTitle'],
                ['publisher'],
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
    doaj: () => [
        {
            groups: [['doaj']],
        },
    ],
    indexed: () => [
        {
            groups: [['indexed']],
        },
    ],
};

export const validateAdminJournal = () => ({});
