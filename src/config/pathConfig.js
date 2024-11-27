import param from 'can-param';
import { DEFAULT_QUERY_PARAMS } from 'config/general';
import { createHash } from 'crypto';

export const fullPath = process.env.FULL_PATH || 'https://fez-staging.library.uq.edu.au';

export const getSearchUrl = ({ searchQuery = { all: '' }, activeFacets = {} }, searchUrl = '/records/search') => {
    const params = {
        ...DEFAULT_QUERY_PARAMS,
        searchQueryParams: {
            ...searchQuery,
        },
        activeFacets: {
            ...DEFAULT_QUERY_PARAMS.activeFacets,
            ...activeFacets,
        },
    };

    if (searchQuery && !searchQuery.hasOwnProperty('all')) {
        params.searchMode = 'advanced';
    }

    return `${searchUrl}?${param(params)}`;
};

export const getDatastreamVersionQueryString = (fileName, checksum) => {
    if (!checksum) {
        return '';
    }

    const hash = createHash('md5')
        .update(`${fileName}${checksum.trim()}`)
        .digest('hex');

    return hash;
};

export const pathConfig = {
    index: '/',
    communityCollections: {
        communityListUrl: '/communities',
        collectionsListUrl: '/collections',
        communityListAPI: 'communities',
        collectionListAPI: 'communities',
    },
    communityList: '/communities',
    dashboard: '/dashboard',
    about: '/about',
    hdrSubmission: '/rhdsubmission',
    sbsSubmission: '/habslodge',
    records: {
        add: {
            // the ordering below should not be changed. It's used in AddMissingRecord::getStepperIndex
            find: '/records/add/find',
            results: '/records/add/results',
            new: '/records/add/new',
        },
        claim: '/records/claim',
        fix: pid => `/records/${pid}/fix`,
        incomplete: '/records/incomplete',
        incompleteFix: pid => `/records/${pid}/incomplete`,
        mine: '/records/mine',
        possible: '/records/possible',
        search: '/records/search',
        view: (pid, includeFullPath = false) => `${includeFullPath ? fullPath : ''}/view/${pid}`,
        version: (pid, version) => `/view/${pid}/${version}`,
    },
    dataset: {
        mine: '/data-collections/mine',
        // legacy: `${fullPath}/workflow/new.php?xdis_id=371&pid=UQ:289097&cat=select_workflow&wft_id=315`,
        add: '/data-collections/add',
    },
    editorialAppointments: {
        list: '/editorial-appointments',
    },
    // TODO: update how we get files after security is implemented in fez file api
    // (this is used in metadata to reflect legacy file urls for citation_pdf_url - Google Scholar)
    file: {
        url: (pid, fileName, checksum = '') => {
            let version = getDatastreamVersionQueryString(fileName, checksum);
            if (version) {
                version = `?dsi_version=${version}`;
            }

            return `${fullPath}/view/${pid}/${fileName}${version}`;
        },
    },
    // TODO: review institutional status and herdc status links when we start administrative epic
    list: {
        author: (author, authorId) =>
            getSearchUrl(
                authorId
                    ? {
                          searchQuery: {
                              rek_author_id: {
                                  value: authorId,
                                  label: `${authorId} (${author})`,
                              },
                          },
                      }
                    : {
                          searchQuery: {
                              rek_author: {
                                  value: author,
                              },
                          },
                      },
            ),
        journalName: journalName => getSearchUrl({ searchQuery: { rek_journal_name: { value: journalName } } }),
        bookTitle: bookTitle => getSearchUrl({ searchQuery: { rek_book_title: { value: bookTitle } } }),
        collection: collectionId => getSearchUrl({ searchQuery: { rek_ismemberof: { value: [collectionId] } } }),
        contributor: (contributor, contributorId) =>
            getSearchUrl(
                contributorId
                    ? {
                          searchQuery: {
                              rek_contributor_id: {
                                  value: contributorId,
                                  label: `${contributorId} (${contributor})`,
                              },
                          },
                      }
                    : {
                          searchQuery: {
                              rek_contributor: {
                                  value: contributor,
                              },
                          },
                      },
            ),
        conferenceName: conferenceName =>
            getSearchUrl({ searchQuery: { rek_conference_name: { value: conferenceName } } }),
        orgUnitName: orgUnitName => getSearchUrl({ searchQuery: { rek_org_unit_name: { value: orgUnitName } } }),
        publisher: publisher => getSearchUrl({ searchQuery: { rek_publisher: { value: publisher } } }),
        series: series => getSearchUrl({ searchQuery: { rek_series: { value: series } } }),
        license: license => getSearchUrl({ searchQuery: { all: license } }),
        jobNumber: jobNumber => getSearchUrl({ searchQuery: { all: jobNumber } }),
        proceedingsTitle: proceedingsTitle => getSearchUrl({ searchQuery: { all: proceedingsTitle } }),
        // Exact match on Any Field
        keyword: keyword =>
            getSearchUrl({
                searchQuery: { all: '' },
                activeFacets: {
                    filters: {
                        Keywords: keyword,
                    },
                },
            }),
        herdcStatus: herdcStatus => getSearchUrl({ searchQuery: { all: herdcStatus } }),
        subject: (subject, subjectLookup) =>
            getSearchUrl({
                searchQuery: { all: '' },
                activeFacets: {
                    filters: {
                        'Subject (lookup)': subjectLookup,
                    },
                },
            }),
        institutionalStatus: institutionalStatus => getSearchUrl({ searchQuery: { all: institutionalStatus } }),
    },
    admin: {
        dashboard: '/admin/dashboard',
        add: '/admin/add',
        changeDisplayType: pid => `/admin/change-display-type/${pid}`,
        bulkUpdates: '/admin/bulk-updates',
        collection: '/admin/collection',
        community: '/admin/community',
        delete: pid => `/admin/delete/${pid}`,
        doi: pid => `/admin/doi/${pid}`,
        edit: pid => `/admin/edit/${pid}`,
        editCollection: pid => `/collections/${pid}/edit`,
        editCommunity: pid => `/communities/${pid}/edit`,
        editRecord: pid => `/records/${pid}/edit`,
        favouriteSearch: '/admin/favourite-search',
        masquerade: '/admin/masquerade',
        thirdPartyTools: '/tool/lookup',
        unpublished: '/admin/unpublished',
        manageAuthors: '/admin/authors',
        manageUsers: '/admin/users',
        masterJournalListIngest: '/admin/master-journal-list-ingest',
        journalEdit: id => `/admin/journal/edit/${id}`,
        controlledVocabularies: '/admin/controlled-vocabularies',
    },
    authorIdentifiers: {
        orcid: {
            link: '/author-identifiers/orcid/link',
            absoluteLink: `${window.location.origin}${
                process.env.BRANCH === 'development' ? window.location.pathname : ''
            }/author-identifiers/orcid/link`,
            // unlink: '/author-identifiers/orcid/link'
        },
    },
    authorStatistics: {
        url: id => `https://app.library.uq.edu.au/#/authors/${id}`,
    },
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide',
    digiteam: {
        batchImport: '/batch-import',
    },
    journal: {
        view: id => `/journal/view/${id}`,
    },
    journals: {
        search: '/journals/search/',
        compare: '/journals/compare/',
        favourites: '/journals/favourites/',
    },
};
