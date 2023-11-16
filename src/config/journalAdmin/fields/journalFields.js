export default {
    admin: () => [
        {
            groups: [
                ['jnl_title'],
                ['abbreviatedTitle'],
                ['publisher'],
                ['refereed', 'publicationYear', 'publicationFrequency'],
                ['formats'],
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
            groups: [['eSpace']],
        },
    ],
    doaj: () => [
        {
            groups: [['openAccessDoaj']],
        },
    ],
    indexed: () => [
        {
            groups: [['indexedIn']],
        },
    ],
};

export const validateAdminJournal = () => ({});
