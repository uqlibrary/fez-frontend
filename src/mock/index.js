/* eslint-disable */
import { api, SESSION_COOKIE_NAME, SESSION_USER_GROUP_COOKIE_NAME, sessionApi } from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import * as routes from 'repositories/routes';
import * as mockData from './data';
import * as mockTestingData from './data/testing/records';
import { PUB_LIST_BULK_EXPORT_SIZES, } from 'config/general';
import * as journalsSearch from './data/journals/search';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 200 });
const mockSessionApi = new MockAdapter(sessionApi, { delayResponse: 200 });
const escapeRegExp = input => input.replace('.\\*', '.*').replace(/[\-\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&');
// const standardQueryString = {page: '.*', pageSize: '.*', sortBy: '.*', sortDirection: '.*', facets: {}};
// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');
Cookies.set(SESSION_USER_GROUP_COOKIE_NAME, 'LIBRARYSTAFFB');

// Get user from query string
let user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;

mockData.accounts.uqrdav10 = mockData.uqrdav10.account;
mockData.accounts.uqagrinb = mockData.uqagrinb.account;
mockData.authorDetails.uqrdav10 = mockData.uqrdav10.authorDetails;
mockData.authorDetails.uqagrinb = mockData.uqagrinb.authorDetails;
mockData.currentAuthor.uqrdav10 = {
    data: mockData.uqrdav10.author,
};
mockData.currentAuthor.uqagrinb = {
    data: mockData.uqagrinb.author,
};
if (user && !mockData.accounts[user]) {
    console.warn(
        `API MOCK DATA: User name (${user}) is not found, please use one of the usernames from mock data only...`,
    );
}

// default user is researcher if user is not defined
user = user || 'uqresearcher';
// user = user || 'uqstaff';

// used to ensure s5555555 only gets a 200 for the first req.
let hasSessionExpireTestReqBeenMade = true;
/*
 * Mocking CURRENT_ACCOUNT_API endpoint to check session with different instance of API
 * for thesis submissions for now
 */
mockSessionApi.onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(() => {
    const isSessionExpireTestUser = user === 's5555555';
    // mock account response
    if (['s2222222', 's3333333'].indexOf(user) > -1 ||
        (isSessionExpireTestUser && !hasSessionExpireTestReqBeenMade)) {
        if (isSessionExpireTestUser) hasSessionExpireTestReqBeenMade = true;
        return [200, mockData.accounts[user]];
    } else if (mockData.accounts[user]) {
        return [403, {}];
    }
    return [404, {}];
});

mock.onGet(routes.SEARCH_INTERNAL_RECORDS_API({}, 'export').apiUrl).reply(config => {
    const headers = {
        excel: {
            'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        endnote: {
            'content-type': 'application/vnd.endnote',
        },
    };
    if (PUB_LIST_BULK_EXPORT_SIZES.includes(config.params.per_page)) {
        return [200, {}];
    } else {
        return [200, 'Exported file contents', headers[config.params.export_to]];
    }
});

mock.onGet(routes.CURRENT_ACCOUNT_API().apiUrl)
    .reply(() => {
        // mock account response
        if (user === 'anon') {
            return [401, {}];
        } else if (mockData.accounts[user]) {
            return [200, mockData.accounts[user]];
        }
        return [404, {}];
    })
    .onGet(routes.AUTHOR_DETAILS_API({ userId: user }).apiUrl)
    .reply(() => {
        // mock current author details
        if (user === 'anon') {
            return [401, {}];
        } else if (mockData.authorDetails[user]) {
            return [200, mockData.authorDetails[user]];
        }
        return [404, {}];
    })
    .onGet(routes.CURRENT_AUTHOR_API().apiUrl)
    .reply(() => {
        // mock current author details from fez
        if (user === 'anon') {
            return [401, {}];
        } else if (mockData.currentAuthor[user]) {
            return [200, mockData.currentAuthor[user]];
        }
        return [404, {}];
    })
    .onGet(routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({ userId: user }).apiUrl)
    .reply(200, mockData.hindexResponse)
    .onGet(routes.BATCH_IMPORT_DIRECTORIES_API().apiUrl)
    .reply(200, mockData.batchImportDirectories)
    .onGet(routes.SEARCH_EXTERNAL_RECORDS_API({}).apiUrl)
    .reply(config => {
        if (config.params.source === 'scopus' && config.params.title)
            return [200, mockData.externalTitleScopusResultsList];
        else if (config.params.source === 'wos' && config.params.title)
            return [200, mockData.externalTitleSearchResultsList];
        else if (config.params.source === 'crossref' && config.params.title)
            return [200, mockData.externalTitleSearchResultsList];
        else if (config.params.source === 'crossref' && config.params.doi)
            return [200, mockData.externalDoiSearchResultList];
        else if (config.params.source === 'pubmed' && config.params.id)
            return [200, mockData.externalPubMedSearchResultsList];
    })
    .onGet(routes.CURRENT_USER_RECORDS_API({}).apiUrl)
    .reply(config => {
        // AUTHOR_PUBLICATIONS_STATS_ONLY_API
        if (config.params.rule === 'incomplete') {
            return [200, mockData.incompleteNTROlist];
        } else if (config.params.rule === 'mine' && !!config.params['filters[stats_only]']) {
            return [200, mockData.currentAuthorStats];
        } else if (config.params.rule === 'mine' && config.params['filters[facets][Display+type]'] === 371) {
            // CURRENT_USER_RECORDS_API - myDataset
            const totalRecords = mockData.myDatasetList.data.length;
            const fromRecord = 1;
            const toRecord = 2;
            return [
                200,
                // {total: 0, data: []}
                {
                    ...mockData.myDatasetList,
                    current_page: config.params.page,
                    data: mockData.myDatasetList.data.slice(
                        fromRecord,
                        totalRecords > toRecord ? toRecord : totalRecords,
                    ),
                },
            ];
        } else if (config.params.rule === 'mine') {
            // CURRENT_USER_RECORDS_API - myResearch
            const totalRecords = mockData.myRecordsList.data.length;
            const fromRecord = 5 * (config.params.page - 1);
            const toRecord = 5 * config.params.page;
            return [
                200,
                // {total: 0, data: []}
                {
                    ...mockData.myRecordsList,
                    current_page: config.params.page,
                    data: mockData.myRecordsList.data.slice(
                        fromRecord,
                        totalRecords > toRecord ? toRecord : totalRecords,
                    ),
                },
            ];
        } else if (config.params.rule === 'possible') {
            // POSSIBLE_RECORDS_API
            return [200, mockData.possibleUnclaimedList];
            // return [500, { message: ['error - failed POSSIBLE_RECORDS_API'] }];
        } else if (config.params.rule === 'lookup') {
            // SEARCH_KEY_LOOKUP_API
            return [200, mockData.searchKeyList[config.params.search_key]];
        } else if (!!config.params.key && config.params.key.rek_object_type === 2) {
            // SEARCH_INTERNAL_RECORDS_API - Advanced Search {key: searchQueryParams} for Collections
            return [200, mockData.collectionSearchList];
        } else if (config.params.key && config.params.key.rek_object_type === 1) {
            return [200, mockData.communitySearchList];
        } else if (
            config.params.id ||
            config.params.doi ||
            config.params.hasOwnProperty('all') ||
            config.params.rek_title ||
            (config.params.key &&
                (config.params.key.id ||
                    config.params.key.doi ||
                    config.params.key.title ||
                    config.params.key.all ||
                    config.params.key.rek_title))
        ) {
            // SEARCH_INTERNAL_RECORDS_API - Advanced Search {key: searchQueryParams}
            // return [200, mockData.internalTitleSearchListNoResults];
            return [200, mockData.internalTitleSearchList];
            // return [200, mockData.collectionSearchResultsImages];
        } else if (config.params.key && !!config.params.key.rek_status) {
            return [200, mockData.unpublishedSearchList];
        }
        return [404, ['Request not found']];
        //return [200, mockData.collectionSearchResultsImages];
    })
    .onGet(
        new RegExp(
            escapeRegExp(
                routes.COLLECTIONS_BY_COMMUNITY_LOOKUP_API({
                    communityPid: '.*',
                }).apiUrl,
            ),
        ),
    )
    .reply(200, mockData.collectionsByCommunity)
    .onGet(routes.AUTHOR_TRENDING_PUBLICATIONS_API().apiUrl)
    // .reply(500, {})
    .reply(200, mockData.trendingPublications)
    .onGet(routes.TRENDING_PUBLICATIONS_API().apiUrl)
    // .reply(500, {})
    .reply(200, mockData.trendingPublications)
    .onGet(routes.AUTHORS_SEARCH_API({ query: '.*' }).apiUrl)
    .reply(config => {
        if (!!config.params && !!config.params.rule && config.params.rule === 'lookup') {
            return [200, mockData.searchKeyList.author];
        } else {
            return [200, mockData.authorsSearch];
        }
    })
    .onGet(`${routes.AUTHORS_SEARCH_API().apiUrl}?sort=updated_date&order_by=desc`)
    .reply(200, mockData.authorsSearch)
    .onGet(routes.GET_PUBLICATION_TYPES_API().apiUrl)
    .reply(200, mockData.recordsTypeList)
    .onGet(
        new RegExp(
            escapeRegExp(
                routes.THIRD_PARTY_LOOKUP_API_1FIELD({
                    type: 'incites',
                    field1: '.*',
                }).apiUrl,
            ),
        ),
    )
    .reply(200, mockData.lookupToolIncites)
    .onGet(
        new RegExp(
            escapeRegExp(routes.THIRD_PARTY_LOOKUP_API_2FIELD({ type: 'incites', field1: '.*', field2: '.*' }).apiUrl),
        ),
    )
    .reply(200, mockData.lookupToolIncites)
    .onGet(new RegExp(routes.BULK_UPDATES_API().apiUrl))
    .reply(200, { ...mockData.bulkUpdatesList })
    // Detailed history API check (path /view/<PID>/history)
    .onGet(routes.EXISTING_RECORD_HISTORY_API({ pid: 'UQ:a62a760' }).apiUrl)
    .reply(200, ...mockData.detailedHistory)
    // This tests the "Record not found" message on viewRecord and adminEdit
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: 'UQ:abc123' }).apiUrl)))
    .reply(404, { message: 'File not found' })
    // Author Affiliation with incorrect values
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: 'UQ:40186a' }).apiUrl)))
    .reply(200, { data: mockData.recordWithIncorrectAffiliation })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: 'UQ:871c1f8' }).apiUrl)))
    .reply(200, { data: { ...mockData.recordWithProblematicAuthorAffiliations } })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_VERSION_API('.*', '.*').apiUrl)))
    // versions
    .reply(config => {
        const mockRecords = [...mockData.recordVersion, ...mockData.recordVersionLegacy];
        const matchedRecord = mockRecords.find(record => {
            const tokens = config.url.split('/');
            return (
                tokens.pop().replace(' ', '') === record.rek_version.replace(' ', '') && tokens.pop() === record.rek_pid
            );
        });
        if (matchedRecord) {
            return [200, { data: { ...matchedRecord } }];
        }
        return [404, { message: 'File not found' }];
    })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: 'UQ:3883' }).apiUrl)))
    .reply(config => {
        const mockRecords = [
            { ...mockData.collectionRecord },
            { ...mockData.communityRecordWithExtraData },
            { ...mockData.incompleteNTROrecord },
            { ...mockData.incompleteNTRORecordUQ352045 },
            { ...mockData.recordWithoutAuthorIds },
            { ...mockData.recordWithLotOfAuthors },
            { ...mockData.recordWithTiffAndThumbnail },
            { ...mockData.UQ716942uqagrinb },
            { ...mockTestingData.dataCollection },
            ...mockData.collectionSearchList.data,
            ...mockData.communitySearchList.data,
            ...mockData.incompleteNTROlist.data,
            ...mockData.internalTitleSearchList.data,
            ...mockData.mockRecordToFix,
            ...mockData.myRecordsList.data,
            ...mockData.myDatasetList.data,
            ...mockData.possibleUnclaimedList.data,
            ...mockData.publicationTypeListAudio.data,
            ...mockData.publicationTypeListBook.data,
            ...mockData.publicationTypeListBookChapter.data,
            ...mockData.publicationTypeListBookEdited.data,
            ...mockData.publicationTypeListConferencePaper.data,
            ...mockData.publicationTypeListConferenceProceedings.data,
            ...mockData.publicationTypeListCreativeWork.data,
            ...mockData.publicationTypeListDataCollection.data,
            ...mockData.publicationTypeListDepartmentTechnicalReport.data,
            ...mockData.publicationTypeListDesign.data,
            ...mockData.publicationTypeListDigilibImage.data,
            ...mockData.publicationTypeListGenericDocument.data,
            ...mockData.publicationTypeListImage.data,
            ...mockData.publicationTypeListJournal.data,
            ...mockData.publicationTypeListJournalArticle.data,
            ...mockData.publicationTypeListManuscript.data,
            ...mockData.publicationTypeListNewspaperArticle.data,
            ...mockData.publicationTypeListPatent.data,
            ...mockData.publicationTypeListPreprint.data,
            ...mockData.publicationTypeListReferenceEntry.data,
            ...mockData.publicationTypeListResearchReport.data,
            ...mockData.publicationTypeListSeminarPaper.data,
            ...mockData.publicationTypeListThesis.data,
            ...mockData.publicationTypeListVideo.data,
            ...mockData.publicationTypeListWorkingPaper.data,
            ...mockData.trendingPublications.data,
            ...mockData.unpublishedSearchList.data,
            ...mockData.UQ353708.data,
            ...mockData.UQ339703,
        ];
        // const mockedPids = mockRecords.map(record => record.rek_pid);
        // console.log(`Mocking ${mockedPids.length} pids:`, mockedPids);
        const matchedRecord = mockRecords.find(record => config.url.indexOf(record.rek_pid) > -1);
        if (matchedRecord) {
            return [200, { data: { ...matchedRecord } }];
        }
        return [200, { data: { ...mockData.record } }];
    })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: 'UQ:11399' }).apiUrl)))
    .reply(config => {
        const mockRecords = [
            { ...mockData.collectionRecordWithExtraData },
            { ...mockData.communityRecord },
            { ...mockData.incompleteNTROrecord },
            { ...mockData.incompleteNTRORecordUQ352045 },
            { ...mockData.recordWithoutAuthorIds },
            { ...mockData.recordWithLotOfAuthors },
            { ...mockData.recordWithTiffAndThumbnail },
            { ...mockData.UQ716942uqagrinb },
            { ...mockTestingData.dataCollection },
            ...mockData.collectionSearchList.data,
            ...mockData.communitySearchList.data,
            ...mockData.incompleteNTROlist.data,
            ...mockData.internalTitleSearchList.data,
            ...mockData.mockRecordToFix,
            ...mockData.myRecordsList.data,
            ...mockData.myDatasetList.data,
            ...mockData.possibleUnclaimedList.data,
            ...mockData.publicationTypeListAudio.data,
            ...mockData.publicationTypeListBook.data,
            ...mockData.publicationTypeListBookChapter.data,
            ...mockData.publicationTypeListBookEdited.data,
            ...mockData.publicationTypeListConferencePaper.data,
            ...mockData.publicationTypeListConferenceProceedings.data,
            ...mockData.publicationTypeListCreativeWork.data,
            ...mockData.publicationTypeListDataCollection.data,
            ...mockData.publicationTypeListDepartmentTechnicalReport.data,
            ...mockData.publicationTypeListDesign.data,
            ...mockData.publicationTypeListDigilibImage.data,
            ...mockData.publicationTypeListGenericDocument.data,
            ...mockData.publicationTypeListImage.data,
            ...mockData.publicationTypeListJournal.data,
            ...mockData.publicationTypeListJournalArticle.data,
            ...mockData.publicationTypeListManuscript.data,
            ...mockData.publicationTypeListNewspaperArticle.data,
            ...mockData.publicationTypeListPatent.data,
            ...mockData.publicationTypeListPreprint.data,
            ...mockData.publicationTypeListReferenceEntry.data,
            ...mockData.publicationTypeListResearchReport.data,
            ...mockData.publicationTypeListSeminarPaper.data,
            ...mockData.publicationTypeListThesis.data,
            ...mockData.publicationTypeListVideo.data,
            ...mockData.publicationTypeListWorkingPaper.data,
            ...mockData.trendingPublications.data,
            ...mockData.unpublishedSearchList.data,
            ...mockData.UQ353708.data,
            ...mockData.UQ339703,
        ];
        // const mockedPids = mockRecords.map(record => record.rek_pid);
        // console.log(`Mocking ${mockedPids.length} pids:`, mockedPids);
        const matchedRecord = mockRecords.find(record => config.url.indexOf(record.rek_pid) > -1);
        if (matchedRecord) {
            return [200, { data: { ...matchedRecord } }];
        }
        return [200, { data: { ...mockData.record } }];
    })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: 'UQ:764e150' }).apiUrl)))
    .reply(config => {
        return [200, { data: { ...mockData.recordBookWithAuthorAffiliations } }];
    })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: 'UQ:871c1f8' }).apiUrl)))
    .reply(config => {
        return [200, { data: { ...mockData.recordWithProblematicAuthorAffiliations } }];
    })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: 'UQ:0ff5a8a' }).apiUrl)))
    .reply(config => {
        return [200, { data: { ...mockData.recordWithRDM } }];
    })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: 'UQ:92b978e' }).apiUrl)))
    .reply(config => {
        return [200, { data: { ...mockData.recordWithRDMMediatedAccess } }];
    })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: mockData.deleteRecord.rek_pid }).apiUrl)))
    .reply(config => {
        return [410, { data: { ...mockData.deleteRecord } }];
    })
    .onGet(new RegExp(escapeRegExp(routes.ORGANISATIONAL_UNITS().apiUrl)))
    .reply(config => {
        return [200, { data: [...mockData.organisationalUnits] }];
    })
    .onGet(new RegExp(escapeRegExp(routes.SUGGESTED_ORGANISATIONAL_UNITS({ authorId: '.*' }).apiUrl)))
    .reply(config => {
        return [200, { data: [...mockData.suggestedOrganisationalUnits] }];
    })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: '.*' }).apiUrl)))
    .reply(config => {
        const mockRecords = [
            { ...mockData.collectionRecord },
            { ...mockData.communityRecord },
            { ...mockData.incompleteNTROrecord },
            { ...mockData.incompleteNTRORecordUQ352045 },
            { ...mockData.incompleteNTRORecordUQe09e0b8 },
            { ...mockData.recordWithoutAuthorIds },
            { ...mockData.recordWithLotOfAuthors },
            { ...mockData.recordWithTiffAndThumbnail },
            { ...mockData.UQ716942uqagrinb },
            { ...mockTestingData.dataCollection },
            ...mockData.collectionSearchList.data,
            ...mockData.communitySearchList.data,
            ...mockData.incompleteNTROlist.data,
            ...mockData.internalTitleSearchList.data,
            ...mockData.mockRecordToFix,
            ...mockData.myRecordsList.data,
            ...mockData.myDatasetList.data,
            ...mockData.possibleUnclaimedList.data,
            ...mockData.publicationTypeListAudio.data,
            ...mockData.publicationTypeListBook.data,
            ...mockData.publicationTypeListBookChapter.data,
            ...mockData.publicationTypeListBookEdited.data,
            ...mockData.publicationTypeListConferencePaper.data,
            ...mockData.publicationTypeListConferenceProceedings.data,
            ...mockData.publicationTypeListCreativeWork.data,
            ...mockData.publicationTypeListDataCollection.data,
            ...mockData.publicationTypeListDepartmentTechnicalReport.data,
            ...mockData.publicationTypeListDesign.data,
            ...mockData.publicationTypeListDigilibImage.data,
            ...mockData.publicationTypeListGenericDocument.data,
            ...mockData.publicationTypeListImage.data,
            ...mockData.publicationTypeListJournal.data,
            ...mockData.publicationTypeListJournalArticle.data,
            ...mockData.publicationTypeListManuscript.data,
            ...mockData.publicationTypeListNewspaperArticle.data,
            ...mockData.publicationTypeListPatent.data,
            ...mockData.publicationTypeListPreprint.data,
            ...mockData.publicationTypeListReferenceEntry.data,
            ...mockData.publicationTypeListResearchReport.data,
            ...mockData.publicationTypeListSeminarPaper.data,
            ...mockData.publicationTypeListThesis.data,
            ...mockData.publicationTypeListVideo.data,
            ...mockData.publicationTypeListWorkingPaper.data,
            ...mockData.trendingPublications.data,
            ...mockData.unpublishedSearchList.data,
            ...mockData.UQ353708.data,
            ...mockData.UQ339703,
            ...mockData.recordThatFailsDeletion,
        ];
        // const mockedPids = mockRecords.map(record => record.rek_pid);
        // console.log(`Mocking ${mockedPids.length} pids:`, mockedPids);
        const matchedRecord = mockRecords.find(record => config.url.indexOf(record.rek_pid) > -1);
        if (matchedRecord) {
            return [200, { data: { ...matchedRecord } }];
        }
        return [200, { data: { ...mockData.record } }];
    })
    // .reply(401, [''])
    // .reply(500, { message: ['error - failed EXISTING_RECORD_API'] })
    .onGet(new RegExp(escapeRegExp(routes.VOCABULARIES_API({ id: '.*' }).apiUrl)))
    .reply(config => {
        const vocabIds = config.url
            .substring(config.url.indexOf('=') + 1)
            .split(',')
            .map(vocabId => parseInt(vocabId));
        let data = [];
        const { vocabulariesList } = mockData;
        vocabIds.forEach(vocabId => {
            !!vocabulariesList[vocabId] && data.push(...vocabulariesList[vocabId].data);
        });
        return [200, { total: data.length, data }];
    })
    .onGet(
        new RegExp(
            escapeRegExp(
                routes.AUTHOR_ORCID_DETAILS_API({ userId: '.*', params: { code: '.*', redirUri: '.*' } }).apiUrl,
            ),
        ),
    )
    .reply(200, { ...mockData.authorOrcidDetails })
    // .reply(500, { message: ["Server error: `POST https://sandbox.orcid.org/oauth/token` resulted in a `500 Internal Server Error` response:\n{\"error\":\"server_error\",\"error_description\":\"Redirect URI mismatch.\"}\n"] })
    .onGet(routes.ORCID_SYNC_API().apiUrl)
    .reply(200, mockData.orcidSyncStatus)
    .onGet(routes.FAVOURITE_SEARCH_LIST_API().apiUrl)
    .reply(200, mockData.favouriteSearchList)
    .onGet(new RegExp(escapeRegExp(routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' }).apiUrl)))
    .reply(200, { ...mockData.favouriteSearchItem })
    // .reply(404)
    .onGet(routes.MY_EDITORIAL_APPOINTMENT_LIST_API().apiUrl)
    .reply(200, mockData.myEditorialAppointmentsList)
    // .reply(500)
    .onGet(new RegExp(escapeRegExp(routes.MY_EDITORIAL_APPOINTMENT_LIST_API({ id: '.*' }).apiUrl)))
    .reply(200, { ...mockData.myEditorialAppointmentItem })
    // .reply(404)
    .onGet(new RegExp(escapeRegExp(routes.ISSN_LINKS_API({ type: 'sherpa-romeo', issn: '.*' }).apiUrl)))
    .reply(config => {
        const issn = config.url.split(/[\s,\/]+/).pop();
        const data = [];
        switch (issn) {
            case '0000-0000':
                data.push({
                    ...mockData.sherpaRomeo[1],
                    srm_issn: issn,
                });
                break;
            case '1111-1111':
            case '2222-2222':
                break;
            default:
                const mockSherpa = mockData.sherpaRomeo.find(mockEntry => mockEntry.srm_issn === issn);
                data.push(
                    mockSherpa || {
                        ...mockData.sherpaRomeo[0],
                        srm_issn: issn,
                    },
                );
        }
        return [200, { data }];
    })
    // .reply(404)
    .onGet(new RegExp(escapeRegExp(routes.ISSN_LINKS_API({ type: 'ulrichs', issn: '.*' }).apiUrl)))
    .reply(config => {
        const issn = config.url.split(/[\s\/]+/).pop();
        const data = [];
        if (!issn.match(/^1111-1111|2222-2222$/)) {
            data.push({
                ...mockData.ulrichs[0],
                ulr_issn: issn,
                ulr_title_id: issn.replace('-', ''),
            });
        }
        return [200, { data }];
    })
    // Journal main search
    .onGet(new RegExp(escapeRegExp(routes.JOURNAL_LOOKUP_API({ query: '.*' }).apiUrl)))
    .reply(200, { ...mockData.journalLookup })
    .onGet(new RegExp(escapeRegExp(routes.JOURNAL_KEYWORDS_LOOKUP_API({ query: '.*' }).apiUrl)))
    .reply(config => {
        console.log(
            'Returning lookup data for:',
            config.url.replace('https://api.library.uq.edu.au/staging/journals/search?rule=keywords&query=', '') ||
                'NA',
        );
        if (config.url.indexOf('query=null') > -1) {
            return [200, { data: {} }];
        } else if (config.url.indexOf('query=adv') > -1) {
            return [200, { ...journalsSearch.keywords.advanced }];
        } else if (config.url.indexOf('query=bio') > -1) {
            return [200, { ...journalsSearch.keywords.bio }];
        } else if (config.url.indexOf('query=brain') > -1) {
            return [200, { ...journalsSearch.keywords.brain }];
        } else if (config.url.indexOf('query=tech') > -1) {
            return [200, { ...journalsSearch.keywords.tech }];
        } else if (config.url.indexOf('query=cats') > -1) {
            return [200, { ...journalsSearch.keywords.cats }];
        } else if (config.url.indexOf('query=lung cancer') > -1) {
            return [200, { ...journalsSearch.keywords.lungCancer }];
        } else if (config.url.indexOf('query=1405') > -1) {
            return [200, { ...journalsSearch.keywords.forCode }];
        } else if (config.url.indexOf('query=virus') > -1) {
            return [200, { ...journalsSearch.keywords.virus }];
        } else if (config.url.indexOf('query=api-500-error') > -1) {
            return [500, {}];
        }
        return [200, { ...journalsSearch.keywords.none }];
    })
    .onGet(new RegExp(escapeRegExp(routes.JOURNAL_FAVOURITES_API({}).apiUrl)))
    .reply(config => {
        if (config.params.export_to && config.params.export_to === 'excel') {
            return [
                200,
                'Exported',
                { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
            ];
        }
        return [200, { ...journalsSearch.favourites }];
    })
    .onPost(new RegExp(escapeRegExp(routes.JOURNAL_FAVOURITES_API().apiUrl)))
    .reply(200)
    .onDelete(new RegExp(escapeRegExp(routes.JOURNAL_FAVOURITES_API().apiUrl)))
    .reply(200)
    .onGet(new RegExp(escapeRegExp(routes.JOURNAL_SEARCH_API({}).apiUrl)))
    .reply(config => {
        console.log('Returning lookup data for config:', config);
        if (config.params.export_to && config.params.export_to === 'excel') {
            return [
                200,
                'Exported',
                { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
            ];
        } else if (config.params.title?.includes('biological')) {
            let maxCount = config.params.title?.includes('glycobiology') ? 4 : 8;
            if (config.params.filters && config.params.filters[facets].length > 0) maxCount /= 2;
            const data = mockData.journalList.data.filter((element, index) => index < maxCount);
            return [200, { ...mockData.journalList, ...{ data }, ...{ total: maxCount } }];
        }
        return [200, { ...mockData.journalList }];
    })
    .onGet(new RegExp(escapeRegExp(routes.JOURNAL_API({ id: 12 }).apiUrl)))
    .reply(200, { ...mockData.journalDoaj })
    .onPut(new RegExp(escapeRegExp(routes.JOURNAL_API({ id: 12 }).apiUrl)))
    .reply(200, { ...mockData.journalDoaj })
    .onPut(new RegExp(escapeRegExp(routes.JOURNAL_API({ id: 8508 }).apiUrl)))
    .reply(200, { ...mockData.journalDetails })
    .onGet(new RegExp(escapeRegExp(routes.JOURNAL_API({ id: 999 }).apiUrl)))
    .reply(404, { data: 'Not Found' })
    .onGet(new RegExp(escapeRegExp(routes.JOURNAL_API({ id: '.*' }).apiUrl)))
    .reply(200, { ...mockData.journalDetails })

    .onGet(new RegExp(escapeRegExp(routes.MANAGE_USERS_LIST_API({}).apiUrl)))
    .reply(200, { ...mockData.userList })

    .onPost(routes.VOCAB_API().apiUrl)
    // .reply(422, {message: 'Some error message'})
    .reply(config => {
        const data = JSON.parse(config.data);
        if (!data.hasOwnProperty('cvo_id')) {
            data['cvo_id'] = 999;
            data['cvo_created_at'] = Date.now();
            data['cvo_updated_at'] = Date.now();
        }
        return [200, { data }];
    })
    .onPut(routes.VOCAB_API().apiUrl)
    // .reply(422, {message: 'Some error message'})
    .reply(config => [200, { data: config.data }])

    .onGet(new RegExp(routes.CHILD_VOCAB_LIST_API('\\d+.*', false).apiUrl))
    .reply(config => {
        const id = config.url
            .split('/')
            .pop()
            .split('?')[0];
        return [200, { ...mockData.childVocabList[id] }];
    })
    .onGet(new RegExp(escapeRegExp(routes.VOCAB_LIST_API(false).apiUrl + '.*')))
    .reply(200, { ...mockData.vocabList })
    // .reply(422, {message: 'Some error message'})
    .onGet(
        new RegExp(
            escapeRegExp(
                routes.COMMUNITY_LIST_API({ pageSize: '.*', page: '.*', direction: '.*', sortBy: '.*' }).apiUrl,
            ),
        ),
    )
    .reply(200, { ...mockData.communityList })
    .onGet(
        new RegExp(
            escapeRegExp(
                routes.COLLECTION_LIST_API({ pid: '.*', pageSize: '.*', page: '.*', direction: '.*', sortBy: '.*' })
                    .apiUrl,
            ),
        ),
    )
    .reply(200, { ...mockData.collectionList })
    .onGet(
        new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl))
    )
    .reply(200, { data: {...mockData.adminDashboardConfig} })
    .onGet(
        new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_TODAY_API().apiUrl))
    )
    .reply(200, { data: {...mockData.adminDashboardToday} })
    .onGet(
        new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl))
    )
    .reply(200, { data: [...mockData.adminDashboardQuickLinks] })
    .onGet(
        new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl))
    )
    .reply(200, { data: [...mockData.adminDashboardSystemAlerts] })
    .onGet(new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({report_type: 5, date_from: '.*'}).apiUrl)))
    .reply(200, { data: {success: true} })
    .onGet(new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({report_type: 6, date_from: '.*', date_to: '.*'}).apiUrl)))
    .reply(200, { data: {success: true} })
    .onGet(new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({report_type: 3}).apiUrl)))
    .reply(200, { data: {success: false, message: 'No records found'} })
    .onGet(new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({report_type: 1}).apiUrl)))
    .reply(config => {
        return [200, `Exported file contents for report ${config.url.split('=')[1]}`];
    }) 
    .onGet(new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_EXPORT_REPORT_API({report_type: '.*'}).apiUrl)))
    .reply(config => {
        return [200, `Exported file contents for report ${config.url.split('=')[1]}`, {
            'content-type': 'text/csv',
        }];
    })
    .onGet(
        new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({report_type: 2, date_from: '.*', date_to: '.*'}).apiUrl))
    )
    .reply(200, { data: [...mockData.adminDashboardReportWorksData] })
    .onGet(
        new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({report_type: 1, date_from: '.*', date_to: '.*'}).apiUrl))
    )
    .reply(200, { data: [...mockData.adminDashboardReportSystemAlertsData]})
    .onGet(
        new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({report_type: 1, record_id: '.*'}).apiUrl))
    )
    .reply(200, { data: [{...mockData.adminDashboardReportSystemAlertsData[0]}]})
    .onGet(
        new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_DISPLAY_REPORT_API({report_type: 1}).apiUrl))
    )
    .reply(200, { data: [...mockData.adminDashboardReportSystemAlertsData]});

// let uploadTryCount = 1;
mock.onPut(/(s3-ap-southeast-2.amazonaws.com)/)
    .reply(() => [200, { data: {} }])
    .onPut(new RegExp(escapeRegExp(routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' }).apiUrl)))
    .reply(config => {
        return [200, { data: { ...mockData.favouriteSearchItem } }];
    })
    .onPut(new RegExp(escapeRegExp(routes.MY_EDITORIAL_APPOINTMENT_LIST_API({ id: '.*' }).apiUrl)))
    .reply(config => {
        return [200, { ...mockData.myEditorialAppointmentItem }];
    });

mock.onDelete(new RegExp(escapeRegExp(routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' }).apiUrl))).reply(200, { data: {} });
mock.onDelete(new RegExp(escapeRegExp(routes.MY_EDITORIAL_APPOINTMENT_LIST_API({ id: '.*' }).apiUrl))).reply(200, {
    data: {},
});
mock.onDelete(new RegExp(escapeRegExp(routes.AUTHOR_API({ authorId: '.*' }).apiUrl))).reply(200, {
    data: {},
});

// let retried = false;
mock.onPost(new RegExp(escapeRegExp(routes.FILE_UPLOAD_API().apiUrl)))
    .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
    // .reply(500, { message: ['error - failed FILE_UPLOAD_API'] })
    .onPost(new RegExp(escapeRegExp(routes.RECORDS_ISSUES_API({ pid: '.*' }).apiUrl)))
    .reply(200, { data: '' })
    // .reply(500, { message: ['error - failed POST RECORDS_ISSUES_API'] })
    .onPost(new RegExp(escapeRegExp(routes.HIDE_POSSIBLE_RECORD_API().apiUrl)))
    .reply(200, { data: {} })
    // .reply(500, { message: ['error - failed HIDE_POSSIBLE_RECORD_API'] })
    .onPost(routes.BATCH_IMPORT_API().apiUrl)
    .reply(201, { data: 'Batch Import Job Created' })
    // .reply(422)
    .onPost(routes.ORCID_SYNC_API().apiUrl)
    .reply(201, mockData.orcidSyncResponse)
    // .reply(400) // if current sync job exists
    .onPost(new RegExp(escapeRegExp(routes.NEW_RECORD_API().apiUrl)))
    .reply(config => [200, { data: { ...JSON.parse(config.data), rek_pid: 'UQ:1111111' } }])
    // .reply(500, { message: ['error - failed NEW_RECORD_API'] })
    // .reply(403, {message: ['Session expired']})
    .onPost(new RegExp(escapeRegExp(routes.NEW_COLLECTION_API().apiUrl)))
    .reply(() => [200, { data: mockData.collectionRecord }])
    .onPost(new RegExp(escapeRegExp(routes.NEW_COMMUNITY_API().apiUrl)))
    .reply(() => [200, { data: mockData.communityRecord }])
    .onPost(new RegExp(escapeRegExp(routes.FAVOURITE_SEARCH_LIST_API().apiUrl)))
    .reply(200, { data: { ...mockData.favouriteSearchItem } })
    .onPost(new RegExp(escapeRegExp(routes.MY_EDITORIAL_APPOINTMENT_LIST_API().apiUrl)))
    .reply(200, { ...mockData.myEditorialAppointmentItem })
    .onPost(routes.MASTER_JOURNAL_LIST_INGEST_API().apiUrl)
    .reply(200, { data: {} })
    .onPost('fez-users/delete-list')
    .reply(200, {
        data: {
            '1000000293': 'User deleted',
            '9999999999': 'User not found',
        },
    })
    .onPost('fez-users')
    .reply(200, {
        data: {
            usr_id: 2000000999,
            usr_created_date: '2023-03-03T02:13:17Z',
            usr_updated_date: '2023-03-03T02:13:17Z',
            usr_status: 'active',
            usr_given_names: null,
            usr_family_name: null,
            usr_full_name: 'MOCK USER',
            usr_email: 'mock@user.com',
            usr_preferences: null,
            usr_sms_email: null,
            usr_username: 'mock_user',
            usr_shib_username: null,
            usr_administrator: 0,
            usr_ldap_authentication: 0,
            usr_login_count: 0,
            usr_shib_login_count: 0,
            usr_last_login_date: '2023-03-03T02:13:17Z',
            usr_external_usr_id: null,
            usr_super_administrator: 0,
            usr_auth_rule_groups: '11',
            usr_real_last_login_date: '2023-03-03T02:13:17Z',
        },
    })
    .onPut('fez-users/1000000293')
    .reply(200, {
        data: {
            usr_id: 1000000293,
            usr_created_date: '2023-03-03T02:13:17Z',
            usr_updated_date: '2023-03-03T02:13:17Z',
            usr_status: 'active',
            usr_given_names: null,
            usr_family_name: null,
            usr_full_name: 'Test User UPDATE',
            usr_email: 't.user@library.uq.edu.au',
            usr_preferences: null,
            usr_sms_email: null,
            usr_username: 'mock_user',
            usr_shib_username: null,
            usr_administrator: 1,
            usr_ldap_authentication: 0,
            usr_login_count: 0,
            usr_shib_login_count: 0,
            usr_last_login_date: '2023-03-03T02:13:17Z',
            usr_external_usr_id: null,
            usr_super_administrator: 1,
            usr_auth_rule_groups: '11',
            usr_real_last_login_date: '2023-03-03T02:13:17Z',
        },
    })
    .onDelete('fez-users/1000000293')
    .reply(200, {
        data: 'User deleted',
    })
    // .reply(500)
    .onPost('fez-authors/delete-list')
    .reply(200, {
        data: {
            '410': 'Author deleted',
            '9999999999': 'Author not found',
        },
    })
    .onPost(new RegExp(escapeRegExp(routes.AUTHOR_API().apiUrl)))
    .reply(200, {
        data: {
            aut_id: 111,
            aut_display_name: 'Mock Test',
        },
    })
    .onPost(new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl)))
    .reply(() => [201, {}])
    .onDelete(new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl)))
    .reply(() => [201, {}]);

mock.onDelete(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: '.*' }).apiUrl)))
    .reply((request) => {
        if (request?.url.match(new RegExp(mockData.collectionRecord.rek_pid))) {
            return [409, {"data":"Can't delete a record that has child records"}];
        }
        if (request?.url.match(new RegExp(mockData.recordThatFailsDeletion.rek_pid))) {
            return [500, {}];
        }

        return [200, {
            data: 'Record deleted',
        }];
    });

// Note: The existing records of all the mocked types below (regular records, collections and community)
// are all patched via the same endpoint, so if you want to mock a failure of one of those,
// you have to disable the other two variants so that it doesn't fall back to the next one.
mock.onPatch(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: '.*' }).apiUrl)))
    .reply(200, { data: { ...mockData.record } })
    // .reply(500, { message: ['error - failed PATCH EXISTING_RECORD_API'] })

    .onPatch(new RegExp(escapeRegExp(routes.NEW_RECORD_API().apiUrl)))
    .reply(200)

    .onPut(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: '.*' }).apiUrl)))
    .reply(200, { data: { ...mockData.record } })
    // .reply(500, { message: ['error - failed PUT EXISTING_RECORD_API'] })

    .onPut(new RegExp(escapeRegExp(routes.EXISTING_COLLECTION_API({ pid: '.*' }).apiUrl)))
    .reply(200, { data: { ...mockData.collectionRecord } })
    // .reply(500, { message: ['error - failed PUT EXISTING_COLLECTION_API'] })

    .onPut(new RegExp(escapeRegExp(routes.EXISTING_COMMUNITY_API({ pid: '.*' }).apiUrl)))
    .reply(200, { data: { ...mockData.communityRecord } })
    // .reply(500, { message: ['error - failed PUT EXISTING_COMMUNITY_API'] })

    .onPatch(new RegExp(escapeRegExp(routes.AUTHOR_API({ authorId: '.*' }).apiUrl)))
    .reply(200, { ...mockData.currentAuthor.uqresearcher })
    // .reply(500, { message: ['error - failed PATCH AUTHOR_API'] })

    .onPut(new RegExp(escapeRegExp(routes.AUTHOR_API({ authorId: '.*' }).apiUrl)))
    .reply(200, mockData.currentAuthor.uqstaff)

    .onPut(new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_QUICKLINKS_API().apiUrl)))
    // .reply(422, { message: 'failed to save quicklink update' })
    .reply(201, {})

    .onPut(new RegExp(escapeRegExp(routes.ADMIN_DASHBOARD_SYSTEM_ALERTS_API().apiUrl)))
    .reply(201, {})

    .onAny()
    .reply(config => {
        console.log('url not found...', config);
        return [404, { message: `MOCK URL NOT FOUND: ${config.url}` }];
    });
