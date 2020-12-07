/* eslint-disable */
import { api, sessionApi } from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import { SESSION_COOKIE_NAME } from 'config';
import * as routes from 'repositories/routes';
import * as mockData from './data';
import * as mockTestingData from './data/testing/records';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 200 });
const mockSessionApi = new MockAdapter(sessionApi, { delayResponse: 200 });
const escapeRegExp = input => input.replace('.\\*', '.*').replace(/[\-\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&');
// const standardQueryString = {page: '.*', pageSize: '.*', sortBy: '.*', sortDirection: '.*', facets: {}};
// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

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

/*
 * Mocking CURRENT_ACCOUNT_API endpoint to check session with different instance of API
 * for thesis submissions for now
 */
mockSessionApi.onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(() => {
    // mock account response
    if (['s2222222', 's3333333'].indexOf(user) > -1) {
        return [200, mockData.accounts[user]];
    } else if (mockData.accounts[user]) {
        return [403, {}];
    }
    return [404, {}];
});

mock.onGet(routes.CURRENT_ACCOUNT_API().apiUrl)
    .reply(() => {
        // mock account response
        if (user === 'anon') {
            return [403, {}];
        } else if (mockData.accounts[user]) {
            return [200, mockData.accounts[user]];
        }
        return [404, {}];
    })
    .onGet(routes.AUTHOR_DETAILS_API({ userId: user }).apiUrl)
    .reply(() => {
        // mock current author details
        if (user === 'anon') {
            return [403, {}];
        } else if (mockData.authorDetails[user]) {
            return [200, mockData.authorDetails[user]];
        }
        return [404, {}];
    })
    .onGet(routes.CURRENT_AUTHOR_API().apiUrl)
    .reply(() => {
        // mock current author details from fez
        if (user === 'anon') {
            return [403, {}];
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
        } else if (config.params.key && !!config.params.key.rek_status) {
            return [200, mockData.unpublishedSearchList];
        }
        // return [404, ['Request not found']];
        return [200, mockData.internalTitleSearchList];
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
        if (config.params.rule === 'lookup') {
            return [200, mockData.searchKeyList.author];
        } else {
            return [200, mockData.authorsSearch];
        }
    })
    .onGet(routes.GET_PUBLICATION_TYPES_API().apiUrl)
    .reply(200, mockData.recordsTypeList)
    .onGet(routes.GET_NEWS_API().apiUrl)
    .reply(200, mockData.newsFeed)
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
    .reply(200, { ...mockData.bulkUpdatesList})
    // This tests the "Record not found" message on viewRecord and adminEdit
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: 'UQ:abc123' }).apiUrl)))
    .reply(404, { message: 'File not found' })
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: '.*' }).apiUrl)))
    .reply(config => {
        const mockRecords = [
            { ...mockData.collectionRecord },
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
            ...mockData.unpublishedSearchList.data,
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
    });

// let uploadTryCount = 1;
mock.onPut(/(s3-ap-southeast-2.amazonaws.com)/)
    .reply(() => {
        // if (uploadTryCount < 3) {
        //     console.log(`Failing try ${uploadTryCount}`);
        //     uploadTryCount++;
        //     return [500, { message: ['error - failed PUT FILE_UPLOAD_S3'] }];
        // }
        // console.log('Successful upload');
        return [200, { data: {} }];
        // return [500, { message: ['error - failed PUT FILE_UPLOAD_S3'] }];
    })
    .onPut(new RegExp(escapeRegExp(routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' }).apiUrl)))
    .reply(config => {
        return [200, { data: { ...mockData.favouriteSearchItem } }];
    })
    .onPut(new RegExp(escapeRegExp(routes.MY_EDITORIAL_APPOINTMENT_LIST_API({ id: '.*' }).apiUrl)))
    .reply(config => {
        return [200, { data: { ...mockData.myEditorialAppointmentItem } }];
    });

mock.onDelete(routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' })).reply(200, { data: {} });

// let retried = false;
mock.onPost(new RegExp(escapeRegExp(routes.FILE_UPLOAD_API().apiUrl)))
    // .reply(() => {
    //     if (retried) {
    //         return [200, ['s3-ap-southeast-2.amazonaws.com']];
    //     } else {
    //         retried = true;
    //         return [500, { message: ['error - failed FILE_UPLOAD_API'] }];
    //     }
    // })
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
    .reply(200, { data: { ...mockData.favouriteSearchItem } });

mock.onDelete(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: '.*' }).apiUrl))).reply(200, {
    data: 'Record deleted',
});

// Note: The existing records of all the mocked types below (regular records, collections and community)
// are all patched via the same endpoint, so if you want to mock a failure of one of those,
// you have to disable the other two variants so that it doesn't fall back to the next one.
mock.onPatch(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({ pid: '.*' }).apiUrl)))
    .reply(200, { data: { ...mockData.record } })
    // .reply(500, { message: ['error - failed PATCH EXISTING_RECORD_API'] })

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

    .onAny()
    .reply(config => {
        console.log('url not found...', config);
        return [404, { message: `MOCK URL NOT FOUND: ${config.url}` }];
    });
