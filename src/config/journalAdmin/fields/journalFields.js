export default {
    admin: () => [
        {
            groups: [
                ['jnl_title'],
                ['jnl_abbrev_title'],
                ['jnl_publisher'],
                ['jnl_is_refereed', 'jnl_start_year', 'jnl_frequency'],
                ['jnl_formats'],
                ['jnl_description'],
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
    readAndPublish: () => [
        {
            groups: [['readAndPublishPublisher'], ['capped', 'discounted', 's2o']],
        },
        {
            groups: [['readAndPublishLastUpdated']],
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
    listed: () => [
        {
            groups: [['listed']],
        },
    ],
};

export const validateAdminJournal = () => ({});
