export { accounts, authorsSearch, currentAuthor, authorDetails, uqrdav10, uqagrinb } from './account';
export {
    collectionRecord,
    collectionRecordWithExtraData,
    collectionSearchList,
    collectionsByCommunity,
    collectionSearchResultsImages,
    communityRecord,
    communityRecordWithExtraData,
    communitySearchList,
    externalDoiSearchResultList,
    externalPubMedSearchResultsList,
    externalTitleScopusResultsList,
    externalTitleSearchResultsList,
    incompleteNTROlist,
    incompleteNTROrecord,
    incompleteNTRORecordUQ352045,
    incompleteNTRORecordUQe09e0b8,
    internalTitleSearchList,
    internalTitleSearchListNoResults,
    lookupToolIncites,
    myDatasetList,
    myRecordsList,
    possibleUnclaimedList,
    publicationTypeListAudio,
    publicationTypeListBook,
    publicationTypeListBookChapter,
    publicationTypeListBookEdited,
    publicationTypeListConferencePaper,
    publicationTypeListConferenceProceedings,
    publicationTypeListCreativeWork,
    publicationTypeListDataCollection,
    publicationTypeListDepartmentTechnicalReport,
    publicationTypeListDesign,
    publicationTypeListDigilibImage,
    publicationTypeListGenericDocument,
    publicationTypeListImage,
    publicationTypeListJournal,
    publicationTypeListJournalArticle,
    publicationTypeListManuscript,
    publicationTypeListNewspaperArticle,
    publicationTypeListPatent,
    publicationTypeListPreprint,
    publicationTypeListReferenceEntry,
    publicationTypeListResearchReport,
    publicationTypeListSeminarPaper,
    publicationTypeListThesis,
    publicationTypeListVideo,
    publicationTypeListWorkingPaper,
    record,
    recordVersionLegacy,
    recordVersion,
    recordsTypeList,
    recordWithDatastreams,
    recordWithLotOfAuthors,
    recordWithoutAuthorIds,
    recordWithTiffAndThumbnail,
    recordWithProblematicAuthorAffiliations,
    recordWithRDM,
    recordWithRDMMediatedAccess,
    recordBookWithAuthorAffiliations,
    unpublishedSearchList,
    UQ716942uqagrinb,
    UQ353708,
    UQ339703,
    recordWithIncorrectAffiliation,
    recordWithOrphanedAffiliation,
} from './records';

export { vocabulariesList } from './vocabularies';
export { vocabList } from './vocab';
export { childVocabList } from './childVocab';
export { hindexResponse, trendingPublications, currentAuthorStats } from './academicStats';
export { searchKeyList } from './searchKeys';
export { authorOrcidDetails, orcidSyncStatus, orcidSyncResponse, orcidSyncNullResponse } from './orcid';
export { batchImportDirectories } from './batchImportDirectories';
export { sherpaRomeo } from './sherpaRomeo';
export { ulrichs } from './ulrichs';
export { mockRecordToFix } from './testing/records';
export { journalLookup } from './journalLookup';
export { keywordsSearch } from './journals/search/keyword/bio';
export { journalDetails } from './journal';
export { journalDoaj } from './journalDoaj';
export { communityList } from './communityList'
export { collectionList } from './collectionList'
export { journalsList } from './journals';
export { journalList } from './journalList';

export { bulkUpdatesList } from './bulkUpdates';

// Favourite search mock data
export { default as favouriteSearchList } from './favouriteSearch/favouriteSearchList';
export { default as favouriteSearchItem } from './favouriteSearch/favouriteSearchItem';

// Detailed History Mock Data
export { detailedHistory } from './detailedHistory';

// My editorial appointments mock data
export { default as myEditorialAppointmentsList } from './myEditorialAppointments/myEditorialAppointmentsList';
export { default as myEditorialAppointmentItem } from './myEditorialAppointments/myEditorialAppointmentItem';

export { userList } from './testing/usersList';
export { organisationalUnits } from './organisationalUnits';
export { suggestedOrganisationalUnits } from './suggestedOrganisationalUnits';


export { adminDashboardConfig, adminDashboardToday, adminDashboardQuickLinks, adminDashboardSystemAlerts, adminDashboardReportWorksData, adminDashboardReportSystemAlertsData } from './adminDashboard';