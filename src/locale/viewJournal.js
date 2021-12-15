import { APP_URL } from '../config';

export default {
    viewJournal: {
        authorCountWorks: {
            heading: 'Recently published UQ authors',
            ariaLabel: 'Click to explore articles in UQ eSpace',
            externalUrl:
                APP_URL +
                'records/search?activeFacets[ranges][Year+published][from]=2016&activeFacets[ranges][Year+published][to]=2021&searchQueryParams[mtj_jnl_id][value]=[id]&searchMode=advanced&activeFacets[ranges][Author%20Id]=[1%20TO%20*]',
        },
        readAndPublish: {
            heading: 'Read and publish agreement',
            ariaLabel: 'Click to view read and publish agreement',
            prefixText: 'This title may be subject to a ',
            postfixText: ' : Article Processing Charges may be prepaid or discounted',
            linkText: 'read & publish agreement',
            externalUrl: 'https://web.library.uq.edu.au/read-and-publish-agreements',
        },
    },
};
