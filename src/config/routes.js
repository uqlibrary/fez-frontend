import React from 'react';
import { locale } from 'locale';
import { getSearchUrl, pathConfig } from './pathConfig';
import { default as formLocale } from 'locale/publicationForm';

export const fullPath = process.env.FULL_PATH || 'https://fez-staging.library.uq.edu.au';
export const pidRegExp = 'UQ:[a-z0-9]+';
export const numericIdRegExp = '[0-9]+';
export const versionRegExp = `${pidRegExp}\\s[0-9]{4}-[0-9]{2}-[0-9]{2}\\s[0-9]{2}:[0-9]{2}:[0-9]{2}|[a-z0-9-]+`;
export const isFileUrl = route => new RegExp('\\/view\\/UQ:[a-z0-9]+\\/.*').test(route);
export const fileRegexConfig = new RegExp(/\/view\/UQ:\w+\/\w+\.\w+/i);

const isAdmin = authorDetails => {
    return authorDetails && (!!authorDetails.is_administrator || !!authorDetails.is_super_administrator);
};

const isSuperAdmin = authorDetails => {
    return authorDetails && !!authorDetails.is_super_administrator;
};

// a duplicate list of routes for
export const flattedPathConfig = [
    '/admin/add',
    '/admin/authors',
    '/admin/bulk-updates',
    '/admin/change-display-type',
    '/admin/collection',
    '/admin/community',
    '/admin/master-journal-list-ingest',
    '/admin/masquerade',
    '/admin/unpublished',
    '/admin/users',
    '/admin/add',
    '/admin/edit',
    '/admin/delete',
    '/admin/favourite-search',
    '/admin/masquerade',
    '/admin/unpublished',
    '/author-identifiers/google-scholar/link',
    '/author-identifiers/orcid/link',
    '/batch-import',
    '/about',
    '/dashboard',
    '/data-collections/add',
    '/data-collections/mine',
    '/editorial-appointments',
    '/journal/view',
    '/journals/search',
    '/journals/results',
    '/journals/compare',
    '/journals/favourites',
    '/rhdsubmission',
    '/sbslodge_new',
    '/tool/lookup',
    '/records/claim',
    '/records/add/find',
    '/records/add/new',
    '/records/add/results',
    '/records/incomplete',
    '/records/mine',
    '/records/possible',
    '/records/search',
    '/view',
    '/communitylist',
];

// TODO: will we even have roles?
export const roles = {
    researcher: 'researcher',
    admin: 'admin',
    digiteam: 'digiteam',
};

export const notFound = 'not-found';

export const getRoutesConfig = ({
    components = {},
    account = null,
    authorDetails = null,
    forceOrcidRegistration = false,
    isHdrStudent = false,
}) => {
    const pid = `:pid(${pidRegExp})`;
    const id = `:id(${numericIdRegExp})`;
    const version = `:version(${versionRegExp})`;
    const publicPages = [
        {
            path: pathConfig.index,
            component: components.Index,
            exact: true,
            pageTitle: locale.pages.index.title,
        },

        {
            path: pathConfig.about,
            render: () => components.StandardPage({ ...locale.pages.about }),
        },
        {
            path: pathConfig.records.view(`:pid(${pidRegExp}|${notFound})`),
            component: components.NewViewRecord,
            exact: true,
            pageTitle: locale.pages.viewRecord.title,
            regExPath: pathConfig.records.view(`(${pidRegExp}|${notFound})`),
        },
        {
            path: pathConfig.records.search,
            component: components.SearchRecords,
            exact: true,
            pageTitle: locale.pages.searchRecords.title,
        },
        {
            path: pathConfig.journal.view(id),
            component: components.ViewJournal,
            access: [roles.admin],
            pageTitle: locale.pages.journal.view.title,
        },
        {
            path: pathConfig.communityList,
            component: components.CommunityList,
            exact: true,
            pageTitle: locale.pages.communityList.title,
        },
        {
            path: pathConfig.collectionList.path(pid),
            component: components.CollectionList,
            exact: true,
            pageTitle: locale.pages.collectionList.title,
        },

        ...(authorDetails && isSuperAdmin(authorDetails)
            ? [
                  {
                      path: pathConfig.records.version(pid, version),
                      component: components.NewViewRecord,
                      access: [roles.admin],
                      exact: true,
                      pageTitle: locale.pages.viewRecord.version.title,
                  },
              ]
            : []),
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
                  ...(authorDetails
                      ? [
                            {
                                path: pathConfig.authorIdentifiers.orcid.link,
                                component: components.Orcid,
                                access: [roles.researcher, roles.admin],
                                exact: true,
                                pageTitle: locale.pages.orcidLink.title,
                            },
                        ]
                      : []),
                  {
                      path: pathConfig.authorIdentifiers.googleScholar.link,
                      component: components.GoogleScholar,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.googleScholarLink.title,
                  },
                  {
                      path: pathConfig.editorialAppointments.list,
                      component: components.MyEditorialAppointments,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.editorialAppointments.title,
                  },
                  {
                      path: pathConfig.journal.view(id),
                      component: components.ViewJournal,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.journal.view.title,
                  },
                  {
                      path: pathConfig.journals.search,
                      component: components.SearchJournals,
                      exact: true,
                      pageTitle: locale.pages.searchJournals.title,
                  },
                  {
                      path: pathConfig.journals.results,
                      component: components.JournalsResults,
                      pageTitle: locale.pages.journals.results.title,
                  },
                  {
                      path: pathConfig.journals.compare,
                      component: components.JournalComparison,
                      pageTitle: locale.pages.journals.compare.title,
                  },
                  {
                      path: pathConfig.journals.favourites,
                      component: components.FavouriteJournals,
                      pageTitle: locale.pages.journals.favourites.title,
                  },
              ]
            : []),

        ...(authorDetails && isSuperAdmin(authorDetails)
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
              ]
            : []),
        ...(authorDetails && isAdmin(authorDetails)
            ? [
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
                  {
                      path: pathConfig.admin.bulkUpdates,
                      component: components.BulkUpdates,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.bulkUpdates.title,
                  },
                  {
                      path: pathConfig.journal.view(id),
                      component: components.ViewJournal,
                      access: [roles.admin],
                      pageTitle: locale.pages.journal.view.title,
                  },
                  {
                      path: pathConfig.admin.manageAuthors,
                      component: components.ManageAuthors,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.authors.title,
                  },
                  {
                      path: pathConfig.admin.manageUsers,
                      component: components.ManageUsers,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.users.title,
                  },
                  {
                      path: pathConfig.admin.controlledVocabularies,
                      component: components.ControlledVocabularies,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.controlledVocabularies.title,
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
                  {
                      path: pathConfig.admin.masterJournalListIngest,
                      component: components.MasterJournalListIngest,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.components.MasterJournalListIngest.title,
                  },
              ]
            : []),
        ...publicPages,
        {
            component: components.NotFound,
            pageTitle: locale.pages.notFound.title,
        },
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
            linkTo: pathConfig.communityList,
            ...locale.menu.communityList,
            public: true,
        },
        {
            linkTo: pathConfig.help,
            ...locale.menu.help,
            public: true,
        },
        {
            linkTo: pathConfig.about,
            ...locale.menu.about,
            public: true,
        },
    ];
    const userPages =
        (account && [
            {
                linkTo: pathConfig.journals.search,
                ...locale.menu.journals.search,
            },
        ]) ||
        [];

    // eslint-disable-next-line camelcase
    const isAuthor = author?.aut_id;
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
            ...userPages,
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
                      linkTo: pathConfig.editorialAppointments.list,
                      ...locale.menu.myEditorialAppointments,
                  },
                  {
                      linkTo: pathConfig.authorStatistics.url(account.id),
                      ...locale.menu.authorStatistics,
                  },
                  //   {
                  //       linkTo: pathConfig.communityList,
                  //       ...locale.menu.communityList,
                  //       public: true,
                  //   },
                  {
                      divider: true,
                      path: '/234234234242',
                  },
              ]
            : []),
        ...userPages,
        ...(authorDetails && isSuperAdmin(authorDetails)
            ? [
                  //   {
                  //       linkTo: pathConfig.admin.community,
                  //       ...locale.menu.communityForm,
                  //   },
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
                      linkTo: pathConfig.admin.manageAuthors,
                      ...locale.menu.manageAuthors,
                  },
                  {
                      linkTo: pathConfig.admin.manageUsers,
                      ...locale.menu.manageUsers,
                  },
                  {
                      linkTo: pathConfig.admin.controlledVocabularies,
                      ...locale.menu.controlledVocabularies,
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
                      linkTo: pathConfig.admin.masterJournalListIngest,
                      ...locale.menu.masterJournalListIngest,
                  },
                  {
                      linkTo: pathConfig.admin.bulkUpdates,
                      ...locale.menu.bulkUpdates,
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
