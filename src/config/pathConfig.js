import {defaultQueryParams} from 'config/general';
import param from 'can-param';

const fullPath = process.env.FULL_PATH && process.env.FULL_PATH || 'https://fez-staging.library.uq.edu.au';
export const pidRegExp = 'UQ:[a-z0-9]+';

const getSearchUrl = ({searchQuery = {all: ''}, activeFacets = {}}, searchUrl = '/records/search') => {
    const params = {
        ...defaultQueryParams,
        searchQueryParams: {
            ...searchQuery
        },
        activeFacets: {
            ...defaultQueryParams.activeFacets,
            ...activeFacets
        }
    };

    if (searchQuery && !searchQuery.hasOwnProperty('all')) {
        params.searchMode = 'advanced';
    }

    return `${searchUrl}?${param(params)}`;
};

export const pathConfig = {
    index: '/',
    dashboard: '/dashboard',
    contact: '/contact',
    hdrSubmission: '/rhdsubmission',
    sbsSubmission: '/habslodge',
    records: {
        mine: '/records/mine',
        possible: '/records/possible',
        claim: '/records/claim',
        search: '/records/search',
        view: (pid, includeFullPath = false) => (`${includeFullPath ? fullPath : ''}/view/${pid}`),
        fix: (pid) => (`/records/${pid}/fix`),
        add: {
            find: '/records/add/find',
            results: '/records/add/results',
            new: '/records/add/new',
        }
    },
    dataset: {
        mine: '/data-collections/mine',
        // legacy: `${fullPath}/workflow/new.php?xdis_id=371&pid=UQ:289097&cat=select_workflow&wft_id=315`,
        add: '/data-collections/add'
    },
    // TODO: update how we get files after security is implemented in fez file api
    // (this is used in metadata to reflect legacy file urls for citation_pdf_url - Google Scholar)
    file: {
        url: (pid, fileName) => (`${fullPath}/view/${pid}/${fileName}`)
    },
    // TODO: review institutional status and herdc status links when we start administrative epic
    list: {
        author: (author, authorId) => getSearchUrl(
            authorId ? {
                searchQuery: {
                    'rek_author_id': {
                        'value': authorId,
                        'label': `${authorId} (${author})`
                    }
                }
            } : {
                searchQuery: {
                    'rek_author': {
                        'value': author
                    }
                }
            }
        ),
        journalName: (journalName) => getSearchUrl({searchQuery: {'rek_journal_name': {'value': journalName}}}),
        bookTitle: (bookTitle) => getSearchUrl({searchQuery: {'rek_book_title': {'value': bookTitle}}}),
        collection: (collectionId) => getSearchUrl({searchQuery: {'rek_ismemberof': {'value': [collectionId]}}}),
        contributor: (contributor) => getSearchUrl({searchQuery: {'rek_contributor': {'value': contributor}}}),
        conferenceName: (conferenceName) => getSearchUrl({searchQuery: {'rek_conference_name': {'value': conferenceName}}}),
        orgUnitName: (orgUnitName) => getSearchUrl({searchQuery: {'rek_org_unit_name': {'value': orgUnitName}}}),
        publisher: (publisher) => getSearchUrl({searchQuery: {'rek_publisher': {'value': publisher}}}),
        series: (series) => getSearchUrl({searchQuery: {'rek_series': {'value': series}}}),
        license: (license) => getSearchUrl({searchQuery: {all: license}}),
        jobNumber: (jobNumber) => getSearchUrl({searchQuery: {all: jobNumber}}),
        proceedingsTitle: (proceedingsTitle) => getSearchUrl({searchQuery: {all: proceedingsTitle}}),
        // Exact match on Any Field
        keyword: (keyword) => getSearchUrl({searchQuery: {all: `"${keyword}"`}}),
        herdcStatus: (herdcStatus) => getSearchUrl({searchQuery: {all: herdcStatus}}),
        institutionalStatus: (institutionalStatus) => getSearchUrl({searchQuery: {all: institutionalStatus}})
    },
    admin: {
        masquerade: '/admin/masquerade',
        thirdPartyTools: '/tool/lookup',
        legacyEspace: `${fullPath}/my_upo_tools.php`,
        unpublished: '/admin/unpublished'
    },
    authorIdentifiers: {
        orcid: {
            link: '/author-identifiers/orcid/link',
            absoluteLink: `${window.location.origin}${process.env.BRANCH === 'development' ? window.location.pathname : ''}${!!window.location.hash ? '#' : ''}/author-identifiers/orcid/link`
            // unlink: '/author-identifiers/orcid/link'
        },
        googleScholar: {
            link: '/author-identifiers/google-scholar/link',
            // unlink: '/author-identifiers/google-scholar/link'
        }
    },
    authorStatistics: {
        url: (id) => `https://app.library.uq.edu.au/#/authors/${id}`
    },
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide'
};
