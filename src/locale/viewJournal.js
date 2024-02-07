import { APP_URL } from 'config/general';

export default {
    viewJournal: {
        authorCountWorks: {
            heading: 'Recently published UQ authors',
            ariaLabel: 'Click to explore articles in UQ eSpace',
            externalUrl:
                APP_URL +
                'records/search?activeFacets[ranges][Year+published][from]=' +
                (new Date().getFullYear() - 5) +
                '&activeFacets[ranges][Year+published][to]=' +
                new Date().getFullYear() +
                '&searchQueryParams[mtj_jnl_id][value]=[id]&searchMode=advanced&activeFacets[ranges][Author%20Id]=[1%20TO%20*]',
        },
        readAndPublish: {
            heading: 'Read and publish agreement',
            ariaLabel: 'Click to view read and publish agreement',
            prefixText: 'Yes<discount>, via <publisher> ',
            postfixText: '',
            linkText: 'Read and Publish Agreement',
            externalUrl: 'https://web.library.uq.edu.au/read-and-publish-agreements',
            caulLink: {
                heading: 'Limited amount available',
                ariaLabel: 'Click to view CAUL information on number of remaining pre-paid APCs',
                linkText: 'Check current status',
                externalUrl: 'https://caul.libguides.com/read-and-publish/home',
            },
        },
    },
};
