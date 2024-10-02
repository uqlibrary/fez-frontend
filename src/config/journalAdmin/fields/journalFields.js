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
    files: () => [
        {
            groups: [['fez_datastream_info']],
        },
        {
            title: 'Files',
            groups: [['files']],
        },
    ],
};

export const validateAdminJournal = () => ({});
