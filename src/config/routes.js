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

// a duplicate list of routes for not found page
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
    '/admin/edit',
    '/admin/delete',
    '/admin/favourite-search',
    '/admin/masquerade',
    '/admin/unpublished',
    '/admin/journal/edit',
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
    const pid = ':pid';
    const id = ':id';
    const version = ':version';

    const publicPages = [
        {
            path: pathConfig.index,
            element: <components.Index />,
            exact: true,
            pageTitle: locale.pages.index.title,
        },
        {
            path: pathConfig.about,
            element: <components.StandardPage {...locale.pages.about} />,
        },
        {
            path: pathConfig.records.view(':pid'),
            element: <components.ViewRecord />,
            exact: true,
            pageTitle: locale.pages.viewRecord.title,
        },
        {
            path: pathConfig.records.feedback(':pid'),
            element: <components.FeedbackRecord />,
            pageTitle: locale.pages.feedbackRecord.title,
        },
        {
            path: pathConfig.records.search,
            element: <components.SearchRecords />,
            exact: true,
            pageTitle: locale.pages.searchRecords.title,
        },
        {
            path: pathConfig.journal.view(id),
            element: <components.ViewJournal />,
            access: [roles.admin],
            pageTitle: locale.pages.journal.view.title,
        },
        {
            path: pathConfig.communityList,
            element: <components.CommunityList />,
            exact: true,
            pageTitle: locale.pages.communityList.title,
        },

        ...(authorDetails && isSuperAdmin(authorDetails)
            ? [
                  {
                      path: pathConfig.records.version(pid, version),
                      element: <components.ViewRecord />,
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
                      element: <components.Index />,
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
                      element: isHdrStudent ? (
                          <components.ThesisSubmission isHdrThesis />
                      ) : (
                          <components.StandardPage {...locale.pages.thesisSubmissionDenied} />
                      ),
                      pageTitle: formLocale.thesisSubmission.hdrTitle,
                  },
                  {
                      path: pathConfig.sbsSubmission,
                      element: isHdrStudent ? (
                          <components.SbsSubmission />
                      ) : (
                          <components.StandardPage {...locale.pages.thesisSubmissionDenied} />
                      ),
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
                path: '/*',
                element: <components.Orcid />,
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
                      element: <components.Index />,
                      exact: true,
                      pageTitle: locale.pages.index.title,
                  },
                  {
                      path: pathConfig.dashboard,
                      element: <components.Dashboard />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.dashboard.title,
                  },
                  {
                      path: pathConfig.records.mine,
                      element: <components.MyRecords />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.myResearch.pageTitle,
                  },
                  {
                      path: pathConfig.dataset.mine,
                      element: <components.MyDataCollections />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.myDatasets.pageTitle,
                  },
                  {
                      path: pathConfig.dataset.add,
                      element: <components.AddDataCollection />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.addDataset.pageTitle,
                  },
                  {
                      path: pathConfig.records.possible,
                      element: <components.PossiblyMyRecords />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.claimPublications.title,
                  },
                  {
                      path: pathConfig.records.incomplete,
                      element: <components.MyIncompleteRecords />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.incompletePublications.title,
                  },
                  {
                      path: pathConfig.records.incompleteFix(pid),
                      element: <components.MyIncompleteRecord disableInitialGrants disableDeleteAllGrants />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.incompletePublication.title,
                  },
                  {
                      path: pathConfig.records.claim,
                      element: <components.ClaimRecord />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.forms.claimPublicationForm.title,
                  },
                  {
                      path: pathConfig.records.fix(pid),
                      element: <components.FixRecord />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.fixRecord.title,
                  },
                  {
                      path: pathConfig.records.add.find,
                      element: <components.AddMissingRecord addRecordStep={components.FindRecords} />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.addRecord.title,
                  },
                  {
                      path: pathConfig.records.add.results,
                      element: <components.AddMissingRecord addRecordStep={components.RecordsSearchResults} />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.addRecord.title,
                  },
                  {
                      path: pathConfig.records.add.new,
                      element: <components.AddMissingRecord addRecordStep={components.NewRecord} />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.addRecord.title,
                  },
                  ...(authorDetails
                      ? [
                            {
                                path: pathConfig.authorIdentifiers.orcid.link,
                                element: <components.Orcid />,
                                access: [roles.researcher, roles.admin],
                                exact: true,
                                pageTitle: locale.pages.orcidLink.title,
                            },
                        ]
                      : []),
                  {
                      path: pathConfig.editorialAppointments.list,
                      element: <components.MyEditorialAppointments />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.editorialAppointments.title,
                  },
                  {
                      path: pathConfig.journal.view(id),
                      element: <components.ViewJournal />,
                      access: [roles.researcher, roles.admin],
                      exact: true,
                      pageTitle: locale.pages.journal.view.title,
                  },
                  {
                      path: pathConfig.journals.search,
                      element: <components.SearchJournals />,
                      exact: true,
                      pageTitle: locale.pages.searchJournals.title,
                  },
                  {
                      path: pathConfig.journals.compare,
                      element: <components.JournalComparison />,
                      pageTitle: locale.components.journalComparison.title,
                  },
                  {
                      path: pathConfig.journals.favourites,
                      element: <components.FavouriteJournals />,
                      pageTitle: locale.components.favouriteJournals.title,
                  },
              ]
            : []),

        ...(authorDetails && isSuperAdmin(authorDetails)
            ? [
                  {
                      path: pathConfig.admin.community,
                      element: <components.CommunityForm />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.community.title,
                  },
                  {
                      path: pathConfig.admin.collection,
                      element: <components.CollectionForm />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.collection.title,
                  },
              ]
            : []),
        ...(account && account.canMasquerade && account.canMasqueradeType === 'full'
            ? [
                  {
                      path: pathConfig.admin.dashboard,
                      element: <components.AdminDashboard />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.adminDashboard.title,
                  },
              ]
            : []),
        ...(authorDetails && isAdmin(authorDetails)
            ? [
                  {
                      path: pathConfig.admin.add,
                      element: <components.Admin createMode />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.adminAdd.title,
                  },
                  {
                      path: pathConfig.admin.edit(pid),
                      element: <components.Admin />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.record.title,
                  },
                  {
                      path: pathConfig.admin.delete(pid),
                      element: <components.DeleteRecord />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.deleteRecord.title,
                      // regExPath: pathConfig.admin.delete(`(${pidRegExp})`),
                  },
                  {
                      path: pathConfig.admin.editCommunity(pid),
                      element: <components.Admin />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.community.title,
                  },
                  {
                      path: pathConfig.admin.editCollection(pid),
                      element: <components.Admin />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.collection.title,
                  },
                  {
                      path: pathConfig.admin.editRecord(pid),
                      element: <components.Admin />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.record.title,
                  },
                  {
                      path: pathConfig.admin.favouriteSearch,
                      element: <components.FavouriteSearch />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.favouriteSearch.title,
                  },
                  {
                      path: pathConfig.admin.doi(pid),
                      element: <components.Doi />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.record.title,
                  },
                  {
                      path: pathConfig.admin.changeDisplayType(pid),
                      element: <components.ChangeDisplayType />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.record.title,
                  },
                  {
                      path: pathConfig.admin.bulkUpdates,
                      element: <components.BulkUpdates />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.bulkUpdates.title,
                  },
                  {
                      path: pathConfig.journal.view(id),
                      element: <components.ViewJournal />,
                      access: [roles.admin],
                      pageTitle: locale.pages.journal.view.title,
                  },
                  {
                      path: pathConfig.admin.manageAuthors,
                      element: <components.ManageAuthors />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.authors.title,
                  },
                  {
                      path: pathConfig.admin.manageUsers,
                      element: <components.ManageUsers />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.users.title,
                  },
                  {
                      path: pathConfig.admin.journalEdit(id),
                      element: <components.JournalAdmin />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.edit.journal.title,
                  },
                  {
                      path: pathConfig.admin.controlledVocabularies,
                      element: <components.ControlledVocabularies />,
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
                      element: <components.Masquerade />,
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
                      element: <components.SearchRecords isAdvancedSearch />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.unpublished.title,
                  },
                  {
                      path: pathConfig.admin.thirdPartyTools,
                      element: <components.ThirdPartyLookupTool />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.components.thirdPartyLookupTools.title,
                  },
                  {
                      path: pathConfig.digiteam.batchImport,
                      element: <components.BatchImport />,
                      exact: true,
                      access: [roles.digiteam],
                      pageTitle: locale.components.digiTeam.batchImport.title,
                  },
                  {
                      path: pathConfig.admin.masterJournalListIngest,
                      element: <components.MasterJournalListIngest />,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.components.MasterJournalListIngest.title,
                  },
              ]
            : []),
        ...publicPages,
        {
            path: '*',
            element: <components.PageNotFound />,
            pageTitle: locale.pages.pageNotFound.title,
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
        ...(account && account.canMasquerade && account.canMasqueradeType === 'full'
            ? [
                  {
                      linkTo: pathConfig.admin.dashboard,
                      ...locale.menu.adminDashboard,
                  },
              ]
            : []),
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
