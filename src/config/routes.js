import React from 'react';
import { locale } from 'locale';
import { default as formLocale } from 'locale/publicationForm';
import param from 'can-param';
import { DEFAULT_QUERY_PARAMS } from 'config/general';
import { createHash } from 'crypto';

export const fullPath = process.env.FULL_PATH || 'https://fez-staging.library.uq.edu.au';
export const pidRegExp = 'UQ:[a-z0-9]+';
export const isFileUrl = route => new RegExp('\\/view\\/UQ:[a-z0-9]+\\/.*').test(route);

const getSearchUrl = ({ searchQuery = { all: '' }, activeFacets = {} }, searchUrl = '/records/search') => {
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

const isAdmin = authorDetails => {
    return authorDetails && (!!authorDetails.is_administrator || !!authorDetails.is_super_administrator);
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
    dashboard: '/dashboard',
    contact: '/contact',
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
    },
    dataset: {
        mine: '/data-collections/mine',
        // legacy: `${fullPath}/workflow/new.php?xdis_id=371&pid=UQ:289097&cat=select_workflow&wft_id=315`,
        add: '/data-collections/add',
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
        contributor: contributor => getSearchUrl({ searchQuery: { rek_contributor: { value: contributor } } }),
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
        institutionalStatus: institutionalStatus => getSearchUrl({ searchQuery: { all: institutionalStatus } }),
    },
    admin: {
        add: '/admin/add',
        changeDisplayType: pid => `/admin/change-display-type/${pid}`,
        collection: '/admin/collection',
        community: '/admin/community',
        delete: pid => `/admin/delete/${pid}`,
        doi: pid => `/admin/doi/${pid}`,
        edit: pid => `/admin/edit/${pid}`,
        editCollection: pid => `/collections/${pid}/edit`,
        editCommunity: pid => `/communities/${pid}/edit`,
        editRecord: pid => `/records/${pid}/edit`,
        favouriteSearch: '/admin/favourite-search',
        legacyEspace: `${fullPath}/my_upo_tools.php`,
        masquerade: '/admin/masquerade',
        thirdPartyTools: '/tool/lookup',
        unpublished: '/admin/unpublished',
    },
    authorIdentifiers: {
        orcid: {
            link: '/author-identifiers/orcid/link',
            absoluteLink: `${window.location.origin}${
                process.env.BRANCH === 'development' ? window.location.pathname : ''
            }/author-identifiers/orcid/link`,
            // unlink: '/author-identifiers/orcid/link'
        },
        googleScholar: {
            link: '/author-identifiers/google-scholar/link',
            // unlink: '/author-identifiers/google-scholar/link'
        },
    },
    authorStatistics: {
        url: id => `https://app.library.uq.edu.au/#/authors/${id}`,
    },
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide',
    digiteam: {
        batchImport: '/batch-import',
    },
};

// a duplicate list of routes for
export const flattedPathConfig = [
    '/admin/add',
    '/admin/change-display-type',
    '/admin/collection',
    '/admin/community',
    '/admin/masquerade',
    '/admin/unpublished',
    '/admin/add',
    '/admin/edit',
    '/admin/delete',
    '/admin/favourite-search',
    '/admin/masquerade',
    '/admin/unpublished',
    '/author-identifiers/google-scholar/link',
    '/author-identifiers/orcid/link',
    '/batch-import',
    '/contact',
    '/dashboard',
    '/data-collections/add',
    '/data-collections/mine',
    '/contact',
    '/rhdsubmission',
    '/sbslodge_new',
    '/tool/lookup',
    '/records/search',
    '/records/mine',
    '/records/possible',
    '/records/incomplete',
    '/records/claim',
    '/records/add/find',
    '/records/add/new',
    '/records/add/results',
    '/records/claim',
    '/records/incomplete',
    '/records/mine',
    '/records/possible',
    '/records/search',
    '/rhdsubmission',
    '/sbslodge_new',
    '/view',
];

export const fileRegexConfig = new RegExp(/\/view\/UQ:\w+\/\w+\.\w+/i);

// TODO: will we even have roles?
export const roles = {
    researcher: 'researcher',
    admin: 'admin',
    digiteam: 'digiteam',
};

export const getRoutesConfig = ({
    components = {},
    account = null,
    authorDetails = null,
    forceOrcidRegistration = false,
    isHdrStudent = false,
    isExistingAlias = false,
    existingAlias = {},
}) => {
    const pid = `:pid(${pidRegExp})`;
    const publicPages = [
        {
            path: pathConfig.index,
            component: components.Index,
            exact: true,
            pageTitle: locale.pages.index.title,
        },
        {
            path: pathConfig.contact,
            render: () => components.StandardPage({ ...locale.pages.contact }),
            pageTitle: locale.pages.contact.title,
        },
        {
            path: pathConfig.records.view(pid),
            component: components.NewViewRecord,
            exact: true,
            pageTitle: locale.pages.viewRecord.title,
            regExPath: pathConfig.records.view(`(${pidRegExp})`),
        },
        {
            path: pathConfig.records.search,
            component: components.SearchRecords,
            exact: true,
            pageTitle: locale.pages.searchRecords.title,
        },
        ...(!account
            ? [
                  {
                      path: pathConfig.dashboard,
                      component: components.Index,
                      exact: true,
                      pageTitle: locale.pages.index.title,
                  },
              ]
            : []),
    ];
    const thesisSubmissionPages = [
        ...(account
            ? [
                  {
                      path: pathConfig.hdrSubmission,
                      render: isHdrStudent
                          ? props => <components.ThesisSubmission isHdrThesis {...props} />
                          : () => components.StandardPage({ ...locale.pages.thesisSubmissionDenied }),
                      pageTitle: formLocale.thesisSubmission.hdrTitle,
                  },
                  {
                      path: pathConfig.sbsSubmission,
                      render: isHdrStudent
                          ? () => <components.SbsSubmission />
                          : () => components.StandardPage({ ...locale.pages.thesisSubmissionDenied }),
                      pageTitle: formLocale.thesisSubmission.sbsTitle,
                  },
              ]
            : []),
    ];

    if (forceOrcidRegistration) {
        return [
            ...publicPages,
            ...thesisSubmissionPages,
            {
                component: components.Orcid,
                pageTitle: locale.pages.orcidLink.title,
            },
        ];
    }

    return [
        ...thesisSubmissionPages,
        ...(account
            ? [
                  {
                      path: pathConfig.index,
                      component: components.Index,
                      exact: true,
                      pageTitle: locale.pages.index.title,
                  },
                  {
                      path: pathConfig.dashboard,
                      component: components.Dashboard,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.dashboard.title,
                  },
                  {
                      path: pathConfig.records.mine,
                      component: components.MyRecords,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.myResearch.pageTitle,
                  },
                  {
                      path: pathConfig.dataset.mine,
                      component: components.MyDataCollections,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.myDatasets.pageTitle,
                  },
                  {
                      path: pathConfig.dataset.add,
                      component: components.AddDataCollection,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.addDataset.pageTitle,
                  },
                  {
                      path: pathConfig.records.possible,
                      component: components.PossiblyMyRecords,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.claimPublications.title,
                  },
                  {
                      path: pathConfig.records.incomplete,
                      component: components.MyIncompleteRecords,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.incompletePublications.title,
                  },
                  {
                      path: pathConfig.records.incompleteFix(pid),
                      render: props => (
                          <components.MyIncompleteRecord {...props} disableInitialGrants disableDeleteAllGrants />
                      ),
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.incompletePublication.title,
                  },
                  {
                      path: pathConfig.records.claim,
                      component: components.ClaimRecord,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.forms.claimPublicationForm.title,
                  },
                  {
                      path: pathConfig.records.fix(pid),
                      component: components.FixRecord,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.fixRecord.title,
                      regExPath: pathConfig.records.fix(`(${pidRegExp})`),
                  },
                  {
                      path: pathConfig.records.add.find,
                      render: props => components.AddMissingRecord({ ...props, addRecordStep: components.FindRecords }),
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.addRecord.title,
                  },
                  {
                      path: pathConfig.records.add.results,
                      render: props =>
                          components.AddMissingRecord({
                              ...props,
                              addRecordStep: components.RecordsSearchResults,
                          }),
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.addRecord.title,
                  },
                  {
                      path: pathConfig.records.add.new,
                      render: props => components.AddMissingRecord({ ...props, addRecordStep: components.NewRecord }),
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.addRecord.title,
                  },
                  {
                      path: pathConfig.authorIdentifiers.orcid.link,
                      component: components.Orcid,
                      exact: true,
                      pageTitle: locale.pages.orcidLink.title,
                  },
                  {
                      path: pathConfig.authorIdentifiers.googleScholar.link,
                      component: components.GoogleScholar,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.googleScholarLink.title,
                  },
              ]
            : []),
        ...(authorDetails && isAdmin(authorDetails)
            ? [
                  {
                      path: pathConfig.admin.community,
                      component: components.CommunityForm,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.community.title,
                  },
                  {
                      path: pathConfig.admin.collection,
                      component: components.CollectionForm,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.collection.title,
                  },
                  {
                      path: pathConfig.admin.add,
                      render: props => <components.Admin {...props} createMode />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.adminAdd.title,
                  },
                  {
                      path: pathConfig.admin.edit(pid),
                      component: components.Admin,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.record.title,
                  },
                  {
                      path: pathConfig.admin.delete(pid),
                      component: components.DeleteRecord,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.deleteRecord.title,
                      regExPath: pathConfig.admin.delete(`(${pidRegExp})`),
                  },
                  {
                      path: pathConfig.admin.editCommunity(pid),
                      component: components.Admin,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.community.title,
                  },
                  {
                      path: pathConfig.admin.editCollection(pid),
                      component: components.Admin,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.collection.title,
                  },
                  {
                      path: pathConfig.admin.editRecord(pid),
                      component: components.Admin,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.record.title,
                  },
                  {
                      path: pathConfig.admin.favouriteSearch,
                      component: components.FavouriteSearch,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.favouriteSearch.title,
                  },
                  {
                      path: pathConfig.admin.doi(pid),
                      component: components.Doi,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.record.title,
                  },
                  {
                      path: pathConfig.admin.changeDisplayType(pid),
                      component: components.ChangeDisplayType,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.record.title,
                  },
              ]
            : []),
        ...(account && account.canMasquerade
            ? [
                  {
                      path: pathConfig.admin.masquerade,
                      component: components.Masquerade,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.masquerade.title,
                  },
              ]
            : []),
        ...(authorDetails && isAdmin(authorDetails)
            ? [
                  {
                      path: pathConfig.admin.unpublished,
                      render: props => components.SearchRecords({ ...props, isAdvancedSearch: true }),
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.unpublished.title,
                  },
                  {
                      path: pathConfig.admin.thirdPartyTools,
                      component: components.ThirdPartyLookupTool,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.components.thirdPartyLookupTools.title,
                  },
                  {
                      path: pathConfig.digiteam.batchImport,
                      component: components.BatchImport,
                      exact: true,
                      access: [roles.digiteam],
                      pageTitle: locale.components.digiTeam.batchImport.title,
                  },
              ]
            : []),
        ...publicPages,
        ...(isExistingAlias
            ? [
                  {
                      path: `/${existingAlias.fvs_alias}`,
                      render: props => components.SearchRecords({ ...props, existingAlias: existingAlias }),
                      exact: true,
                      access: [roles.admin],
                      pageTitle: existingAlias.fvs_description,
                  },
              ]
            : [
                  {
                      component: components.NotFound,
                      pageTitle: locale.pages.notFound.title,
                  },
              ]),
    ];
};

export const getMenuConfig = (account, author, authorDetails, disabled, hasIncompleteWorks = false) => {
    const homePage = [
        {
            linkTo: pathConfig.index,
            ...locale.menu.index,
            public: true,
        },
    ];
    const publicPages = [
        {
            linkTo: pathConfig.records.search,
            ...locale.menu.search,
            public: true,
        },
        {
            linkTo: pathConfig.help,
            ...locale.menu.help,
            public: true,
        },
        {
            linkTo: pathConfig.contact,
            ...locale.menu.contact,
            public: true,
        },
    ];
    const isAuthor = author && Object.keys(author).length > 1;
    const incompletePage =
        (hasIncompleteWorks && [
            {
                linkTo: pathConfig.records.incomplete,
                ...locale.menu.incompleteRecords,
            },
        ]) ||
        [];

    if (disabled) {
        return [
            ...homePage,
            ...(account && isAuthor
                ? [
                      {
                          linkTo: pathConfig.dashboard,
                          primaryText: locale.menu.myDashboard.primaryText,
                          secondaryText: account.mail,
                      },
                      {
                          divider: true,
                          path: '/234234234242',
                      },
                  ]
                : []),
            ...publicPages,
        ];
    }

    return [
        ...homePage,
        ...(account && isAuthor
            ? [
                  {
                      linkTo: pathConfig.dashboard,
                      primaryText: locale.menu.myDashboard.primaryText,
                      secondaryText: account.mail,
                  },
                  {
                      linkTo: pathConfig.records.mine,
                      ...locale.menu.myResearch,
                  },
                  {
                      linkTo: pathConfig.records.possible,
                      ...locale.menu.claimPublication,
                  },
                  ...incompletePage,
                  {
                      linkTo: pathConfig.records.add.find,
                      ...locale.menu.addMissingRecord,
                  },
                  {
                      linkTo: pathConfig.dataset.mine,
                      ...locale.menu.myDatasets,
                  },
                  {
                      linkTo: pathConfig.dataset.add,
                      ...locale.menu.addMissingDataset,
                  },
                  {
                      linkTo: pathConfig.authorStatistics.url(account.id),
                      ...locale.menu.authorStatistics,
                  },
                  {
                      divider: true,
                      path: '/234234234242',
                  },
              ]
            : []),
        ...(authorDetails && isAdmin(authorDetails)
            ? [
                  {
                      linkTo: pathConfig.admin.community,
                      ...locale.menu.communityForm,
                  },
                  {
                      linkTo: pathConfig.admin.collection,
                      ...locale.menu.collectionForm,
                  },
              ]
            : []),
        ...(account && account.canMasquerade
            ? [
                  {
                      linkTo: pathConfig.admin.masquerade,
                      ...locale.menu.masquerade,
                  },
              ]
            : []),
        ...(authorDetails && isAdmin(authorDetails)
            ? [
                  {
                      linkTo: pathConfig.admin.add,
                      ...locale.menu.adminAdd,
                  },
                  {
                      // maybe this should be in some admin bit? tbd
                      linkTo: pathConfig.admin.thirdPartyTools,
                      ...locale.menu.thirdPartyLookupTools,
                  },
                  {
                      linkTo: getSearchUrl(
                          { searchQuery: { rek_status: { value: -4 } } },
                          pathConfig.admin.unpublished,
                      ),
                      ...locale.menu.unpublished,
                  },
                  {
                      linkTo: pathConfig.admin.legacyEspace,
                      ...locale.menu.legacyEspace,
                  },
                  {
                      linkTo: pathConfig.digiteam.batchImport,
                      ...locale.menu.digiteam.batchImport,
                  },
                  {
                      linkTo: pathConfig.admin.favouriteSearch,
                      ...locale.menu.favouriteSearch,
                  },
              ]
            : []),
        ...((account && account.canMasquerade) || isAdmin(authorDetails)
            ? [
                  {
                      divider: true,
                      path: '/234234234242',
                  },
              ]
            : []),
        ...publicPages,
    ];
};

export const ORCID_REDIRECT_URL = `${window.location.origin}${window.location.pathname}${
    !!window.location.hash ? '#' : ''
}${pathConfig.authorIdentifiers.orcid.link}`;
