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
            groups: [['advisoryStatementType'], ['advisoryStatement']],
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
