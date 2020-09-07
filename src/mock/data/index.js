export { accounts, authorsSearch, currentAuthor, authorDetails, uqrdav10, uqagrinb } from './account';
export {
    collectionRecord,
    collectionSearchList,
    collectionsByCommunity,
    communityRecord,
    communitySearchList,
    externalDoiSearchResultList,
    externalPubMedSearchResultsList,
    externalTitleScopusResultsList,
    externalTitleSearchResultsList,
    incompleteNTROlist,
    incompleteNTROrecord,
    incompleteNTRORecordUQ352045,
    internalTitleSearchList,
    internalTitleSearchListNoResults,
    lookupToolIncites,
    myDatasetList,
    myRecordsList,
    possibleUnclaimedList,
    publicationTypeListAudio,
    publicationTypeListBook,
    publicationTypeListBookChapter,
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
    recordsTypeList,
    recordWithDatastreams,
    recordWithoutAuthorIds,
    recordWithTiffAndThumbnail,
    unpublishedSearchList,
    UQ716942uqagrinb,
} from './records';

export { vocabulariesList } from './vocabularies';
export { quickTemplates } from './acml';
export { hindexResponse, trendingPublications, currentAuthorStats } from './academicStats';
export { searchKeyList } from './searchKeys';
export { authorOrcidDetails, orcidSyncStatus, orcidSyncResponse, orcidSyncNullResponse } from './orcid';
export { newsFeed } from './newsFeed';
export { batchImportDirectories } from './batchImportDirectories';
export { sherpaRomeo } from './sherpaRomeo';
export { ulrichs } from './ulrichs';
export { mockRecordToFix } from './testing/records';

export { bulkUpdatesList } from './bulkUpdates';

// Favourite search mock data
export { default as favouriteSearchList } from './favouriteSearch/favouriteSearchList';
export { default as favouriteSearchItem } from './favouriteSearch/favouriteSearchItem';
