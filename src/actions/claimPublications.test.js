import * as transformers from './transformers';
import * as claimActions from './claimPublications';
import { getPreCheckError } from './claimPublications';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import { possibleUnclaimedList } from 'mock/data';
import * as mockData from 'mock/data/testing/records';

describe('Claim publication actions tests ', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        mockActionsStore.clearActions();
    });

    it('dispatches expected actions when loading a record to fix from API successfully', async () => {
        const testPid = 'UQ: 12345';
        mockApi
            .onPost(repositories.routes.CLAIM_PRE_CHECK().apiUrl)
            .reply(200, { data: '' })
            .onGet(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl)
            .reply(200, { data: { ...mockData.mockRecordToFix } });

        const expectedActions = [actions.PUBLICATION_TO_CLAIM_LOADING, actions.PUBLICATION_TO_CLAIM_LOADED];

        try {
            await mockActionsStore.dispatch(claimActions.loadFullRecordToClaim(testPid));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches expected actions when loading a record to fix from API fails', async () => {
        const testPid = 'UQ: 12345';
        mockApi.onGet(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl).reply(500);

        const expectedActions = [
            actions.PUBLICATION_TO_CLAIM_LOADING,
            actions.APP_ALERT_SHOW,
            actions.PUBLICATION_TO_CLAIM_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(claimActions.loadFullRecordToClaim(testPid));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('dispatches an action to set publication to claim', async () => {
        const input = { rek_pid: 'PID:11111' };

        const expectedActions = [actions.PUBLICATION_TO_CLAIM_SET];

        await mockActionsStore.dispatch(claimActions.setClaimPublication(input));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches an action to clear a publication to claim', async () => {
        const expectedActions = [actions.PUBLICATION_TO_CLAIM_CLEAR, actions.APP_ALERT_HIDE];

        await mockActionsStore.dispatch(claimActions.clearClaimPublication());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatched expected actions to get count of publications', async () => {
        mockApi.onAny().reply(200, { data: { ...possibleUnclaimedList } });

        const expectedActions = [
            actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING,
            actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING,
            actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED,
            actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED,
            actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED,
        ];

        await mockActionsStore.dispatch(claimActions.countPossiblyYourPublications());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    describe('searchPossiblyYourPublications()', () => {
        it('dispatched expected actions to get a list of publications', async () => {
            const testParams = {};

            mockApi.onAny().reply(200, { data: { ...possibleUnclaimedList } });

            const expectedActions = [
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED,
                actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED,
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED,
            ];

            await mockActionsStore.dispatch(claimActions.searchPossiblyYourPublications(testParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions to get a list of publications filtered with facets', async () => {
            const testParams = { facets: { facetOne: 'Facet' } };
            mockApi.onAny().reply(200, { data: { ...possibleUnclaimedList } });

            const expectedActions = [
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED,
                actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED,
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED,
            ];

            await mockActionsStore.dispatch(claimActions.searchPossiblyYourPublications(testParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions to get a list of publications for anon user', async () => {
            const testParams = {};

            mockApi.onAny().reply(401, {});

            const expectedActions = [
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(claimActions.searchPossiblyYourPublications(testParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions to get a list of publications if API fails', async () => {
            const testParams = {};

            mockApi.onAny().reply(500, {});

            const expectedActions = [
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(claimActions.searchPossiblyYourPublications(testParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles active facets', async () => {
            const testParams = {
                activeFacets: {
                    facet1: 'facet',
                },
            };
            mockApi.onAny().reply(200, {});

            const expectedActions = [
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED,
                actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED,
            ];

            await mockActionsStore.dispatch(claimActions.searchPossiblyYourPublications(testParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('hideRecord()', () => {
        it('dispatched expected actions when hiding a publication', async () => {
            const testPid = 'UQ:12345';
            const testRecord = { pid: testPid };

            mockApi.onAny().reply(200, {});

            const expectedActions = [
                actions.HIDE_PUBLICATIONS_LOADING,
                actions.HIDE_PUBLICATIONS_LOADED,
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED,
                actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED,
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED,
            ];

            await mockActionsStore.dispatch(claimActions.hideRecord({ record: testRecord }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions when hiding a publication with facets', async () => {
            const testPid = 'UQ:12345';
            const testRecord = { pid: testPid };
            const testFacets = { facets: { facetOne: 'Facet' } };

            mockApi.onAny().reply(200, {});

            const expectedActions = [
                actions.HIDE_PUBLICATIONS_LOADING,
                actions.HIDE_PUBLICATIONS_LOADED,
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING,
                actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED,
                actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED,
                actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED,
            ];

            await mockActionsStore.dispatch(claimActions.hideRecord({ record: testRecord, ...testFacets }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions when hiding a publication for anon user', async () => {
            const testPid = 'UQ:12345';
            const testRecord = { pid: testPid };

            mockApi
                .onGet(repositories.routes.POSSIBLE_RECORDS_API({ facets: {} }).apiUrl)
                .reply(200, possibleUnclaimedList)
                .onAny()
                .reply(401, {});

            const expectedActions = [
                actions.HIDE_PUBLICATIONS_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.HIDE_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(claimActions.hideRecord({ record: testRecord, facets: {} }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions when hiding a publication if API fails', async () => {
            const testPid = 'UQ:12345';
            const testRecord = { pid: testPid };

            mockApi
                .onGet(repositories.routes.POSSIBLE_RECORDS_API({ facets: {} }).apiUrl)
                .reply(200, possibleUnclaimedList)
                .onAny()
                .reply(500, {});

            const expectedActions = [
                actions.HIDE_PUBLICATIONS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.HIDE_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(claimActions.hideRecord({ record: testRecord, facets: {} }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when hideRecordErrorReset is called', async () => {
            const expectedActions = [actions.HIDE_PUBLICATIONS_FAILED_RESET];
            try {
                await mockActionsStore.dispatch(claimActions.hideRecordErrorReset());
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('claimPublication()', () => {
        const testClaimRequest = {
            publication: { ...possibleUnclaimedList.data[0] },
            author: {
                aut_id: 1671,
            },
        };

        it(
            'dispatched expected actions when claiming a publication ' +
                'by author who is assigned to publication already',
            async () => {
                const testRequest = {
                    ...testClaimRequest,
                    publication: {
                        ...testClaimRequest.publication,
                        fez_record_search_key_author_id: [
                            {
                                rek_author_id: 1671,
                                rek_author_id_order: 1,
                            },
                        ],
                    },
                };
                const expectedActions = [actions.CLAIM_PUBLICATION_CREATE_FAILED];

                try {
                    await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                } catch (e) {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            },
        );

        it(
            'dispatched expected actions when claiming a publication by author who ' +
                'is assigned to publication already with some author linked',
            async () => {
                const testRequest = {
                    ...testClaimRequest,
                    publication: {
                        ...testClaimRequest.publication,
                        fez_record_search_key_author_id: [
                            {
                                rek_author_id: 111,
                                rek_author_id_order: 1,
                            },
                        ],
                    },
                    authorLinking: {
                        authors: [
                            {
                                rek_author_id: 111,
                                rek_author_id_order: 1,
                            },
                        ],
                    },
                    contributorLinking: {
                        valid: true,
                        authors: [
                            {
                                rek_author_id: 222,
                                rek_author_id_order: 1,
                            },
                        ],
                    },
                };
                const expectedActions = [
                    actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                    actions.CLAIM_PUBLICATION_CREATE_FAILED,
                ];

                try {
                    await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                } catch (e) {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            },
        );

        it(
            'dispatched expected actions when claiming a publication by contributor ' +
                'who is assigned to publication already',
            async () => {
                const testRequest = {
                    ...testClaimRequest,
                    publication: {
                        ...testClaimRequest.publication,
                        fez_record_search_key_contributor_id: [
                            {
                                rek_contributor_id: 1671,
                                rek_contributor_id_order: 1,
                            },
                        ],
                    },
                };
                const expectedActions = [actions.CLAIM_PUBLICATION_CREATE_FAILED];

                try {
                    await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                } catch (e) {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            },
        );

        it('dispatched expected actions when claiming a publication', async () => {
            mockApi.onAny().reply(200, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            await mockActionsStore.dispatch(claimActions.claimPublication(testClaimRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions when claiming a publication if API fails', async () => {
            mockApi.onAny().reply(500, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.APP_ALERT_SHOW,
                actions.CLAIM_PUBLICATION_CREATE_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testClaimRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions when claiming a publication for anon user', async () => {
            mockApi.onAny().reply(401, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.CLAIM_PUBLICATION_CREATE_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testClaimRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions when claiming a publication from external source', async () => {
            const testRequest = {
                ...testClaimRequest,
                publication: {
                    ...testClaimRequest.publication,
                    rek_pid: null,
                },
            };

            mockApi
                .onPost(repositories.routes.CLAIM_PRE_CHECK().apiUrl)
                .reply(200, { data: '' })
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, { data: { ...testClaimRequest.publication } })
                .onAny()
                .reply(200, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('should include external source IDs when claiming a publication from external source', async () => {
            const testRequest = {
                ...testClaimRequest,
                publication: {
                    ...testClaimRequest.publication,
                    sources: [
                        { source: 'crossref', id: 'test1' },
                        { source: 'scopus', id: 'test2' },
                        { source: 'wos', id: 'test3' },
                    ],
                    rek_pid: null,
                },
            };

            mockApi
                .onPost(repositories.routes.CLAIM_PRE_CHECK().apiUrl)
                .reply(200, { data: '' })
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(config => {
                    const requestObj = JSON.parse(config.data);
                    expect(requestObj.fez_record_search_key_doi.rek_doi).toBe('test1');
                    expect(requestObj.fez_record_search_key_scopus_id.rek_scopus_id).toBe('test2');
                    expect(requestObj.fez_record_search_key_isi_loc.rek_isi_loc).toBe('test3');
                    return [200, { data: { ...testClaimRequest.publication } }];
                })
                .onAny()
                .reply(200, {});

            await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
        });

        it('dispatched expected actions claiming a publication with files', async () => {
            const files = {
                files: {
                    queue: [
                        {
                            date: '2017-12-12T13:39:12+10:00',
                            access_condition_id: 9,
                            name: 'test.jpg',
                        },
                    ],
                },
            };

            mockApi.onAny().reply(200, ['http://upload.file.here/test.jpg']);

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@test.jpg`,
                `${actions.FILE_UPLOAD_COMPLETE}@test.jpg`,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            await mockActionsStore.dispatch(claimActions.claimPublication({ ...testClaimRequest, ...files }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should get file attachment search key when file attachments are present', async () => {
            const testFn = jest.spyOn(transformers, 'getRecordFileAttachmentSearchKey');
            const publication = {
                rek_pid: null,
            };
            const files = {
                files: {
                    queue: [
                        {
                            date: '2017-12-12T13:39:12+10:00',
                            access_condition_id: 9,
                            name: 'test.jpg',
                        },
                    ],
                },
            };

            mockApi.onAny().reply(200, ['http://upload.file.here/test.jpg']);

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@test.jpg`,
                `${actions.FILE_UPLOAD_COMPLETE}@test.jpg`,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            await mockActionsStore.dispatch(
                claimActions.claimPublication({
                    ...testClaimRequest,
                    publication,
                    ...files,
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            expect(testFn).toBeCalledWith(files.files.queue, publication);
        });

        it('dispatched expected actions claiming a publication with comments', async () => {
            const testParams = { pid: testClaimRequest.publication.rek_pid };

            mockApi
                .onPost(repositories.routes.CLAIM_PRE_CHECK().apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.EXISTING_RECORD_API(testParams).apiUrl)
                .reply(200, {})
                .onPost(repositories.routes.RECORDS_ISSUES_API({}).apiUrl)
                .reply(200, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            await mockActionsStore.dispatch(
                claimActions.claimPublication({ ...testClaimRequest, comments: 'This is a test' }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions claiming a publication with comments with issue api failure', async () => {
            const testParams = { pid: testClaimRequest.publication.rek_pid };

            mockApi
                .onPost(repositories.routes.CLAIM_PRE_CHECK().apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.EXISTING_RECORD_API(testParams).apiUrl)
                .reply(200, {})
                .onPost(repositories.routes.RECORDS_ISSUES_API({}).apiUrl)
                .reply(500);

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            await mockActionsStore.dispatch(
                claimActions.claimPublication({ ...testClaimRequest, comments: 'This is a test' }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions claiming a publication with files with file upload failed', async () => {
            const testParams = { pid: testClaimRequest.publication.rek_pid };
            const files = {
                files: {
                    queue: [
                        {
                            date: '2017-12-12T13:39:12+10:00',
                            access_condition_id: 9,
                            name: 'test.jpg',
                        },
                    ],
                },
            };

            mockApi
                .onPost(repositories.routes.CLAIM_PRE_CHECK().apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.EXISTING_RECORD_API(testParams).apiUrl)
                .reply(200, {})
                .onPost(
                    repositories.routes.RECORDS_ISSUES_API({
                        pid: testClaimRequest.publication.rek_pid,
                        fileName: files.files.queue[0].name,
                    }).apiUrl,
                )
                .reply(200, {})
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(500, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_FAILED}@test.jpg`,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_FAILED}@test.jpg`,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            await mockActionsStore.dispatch(claimActions.claimPublication({ ...testClaimRequest, ...files }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions claiming a publication with files with file upload failed at AWS', async () => {
            const testParams = { pid: testClaimRequest.publication.rek_pid };
            const files = {
                files: {
                    queue: [
                        {
                            date: '2017-12-12T13:39:12+10:00',
                            access_condition_id: 9,
                            name: 'test.jpg',
                        },
                    ],
                },
            };

            mockApi
                .onPost(repositories.routes.CLAIM_PRE_CHECK().apiUrl)
                .reply(200, { data: '' })
                .onPatch(repositories.routes.EXISTING_RECORD_API(testParams).apiUrl)
                .reply(200, {})
                .onPost(
                    repositories.routes.RECORDS_ISSUES_API({
                        pid: testClaimRequest.publication.rek_pid,
                        fileName: files.files.queue[0].name,
                    }).apiUrl,
                )
                .reply(200, {})
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(500, {})
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.FILE_UPLOAD_STARTED,
                actions.APP_ALERT_SHOW,
                `${actions.FILE_UPLOAD_FAILED}@test.jpg`,
                actions.FILE_UPLOAD_STARTED,
                actions.APP_ALERT_SHOW,
                `${actions.FILE_UPLOAD_FAILED}@test.jpg`,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            await mockActionsStore.dispatch(claimActions.claimPublication({ ...testClaimRequest, ...files }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions claiming an external publication that matches an espace record', async () => {
            const testRequest = {
                ...testClaimRequest,
                authorLinking: {
                    authors: [
                        {
                            rek_author_id: testClaimRequest.author.aut_id,
                            rek_author_id_order: 1,
                        },
                    ],
                },
                publication: {
                    ...testClaimRequest.publication,
                    fez_record_search_key_author: [
                        ...testClaimRequest.publication.fez_record_search_key_author,
                        {
                            rek_author: 'Another author',
                            rek_author_order: testClaimRequest.publication.fez_record_search_key_author.length + 1,
                        },
                    ],
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: testClaimRequest.author.aut_id,
                            rek_author_id_order: 1,
                        },
                        {
                            rek_author_id: 0,
                            rek_author_id_order: 2,
                        },
                    ],
                    sources: [
                        { source: 'crossref', id: 'test1' },
                        { source: 'scopus', id: 'test2' },
                        { source: 'wos', id: 'test3' },
                    ],
                    rek_pid: null,
                },
            };

            const existingRecordPid = 'UQ:existing';
            mockApi
                .onPost(repositories.routes.CLAIM_PRE_CHECK().apiUrl)
                .reply(200, { data: { ...testClaimRequest.publication, rek_pid: existingRecordPid } })
                .onPost(repositories.routes.EXISTING_RECORD_API({ pid: 'UQ:1' }).apiUrl)
                .reply(response => {
                    const record = JSON.parse(response.data);
                    expect(record.rek_pid).toBe(existingRecordPid);
                    expect(
                        record.fez_record_search_key_author_id.filter(
                            item => item.rek_author_id === testClaimRequest.author.aut_id,
                        ).length,
                    ).toBe(1);
                    return [200, { record: { ...testClaimRequest.publication } }];
                })
                .onAny()
                .reply(200, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions claiming an external publication that matches an espace record - error', async () => {
            const testRequest = {
                ...testClaimRequest,
                authorLinking: {
                    authors: [
                        {
                            rek_author_id: testClaimRequest.author.aut_id,
                            rek_author_id_order: 1,
                        },
                    ],
                },
                publication: {
                    ...testClaimRequest.publication,
                    fez_record_search_key_author: [
                        {
                            rek_author: 'wrong name',
                            rek_author_order: 1,
                        },
                        {
                            rek_author: 'Another author',
                            rek_author_order: 2,
                        },
                    ],
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: testClaimRequest.author.aut_id,
                            rek_author_id_order: 1,
                        },
                        {
                            rek_author_id: 0,
                            rek_author_id_order: 2,
                        },
                    ],
                    sources: [
                        { source: 'crossref', id: 'test1' },
                        { source: 'scopus', id: 'test2' },
                        { source: 'wos', id: 'test3' },
                    ],
                    rek_pid: null,
                },
            };

            const existingRecordPid = 'UQ:existing';
            mockApi
                .onPost(repositories.routes.CLAIM_PRE_CHECK().apiUrl)
                .reply(200, { data: { ...testClaimRequest.publication, rek_pid: existingRecordPid } })
                .onPost(repositories.routes.EXISTING_RECORD_API({ pid: 'UQ:1' }).apiUrl)
                .reply(response => {
                    const record = JSON.parse(response.data);
                    expect(record.rek_pid).toBe(existingRecordPid);
                    expect(
                        record.fez_record_search_key_author_id.filter(
                            item => item.rek_author_id === testClaimRequest.author.aut_id,
                        ).length,
                    ).toBe(1);
                    return [200, { record: { ...testClaimRequest.publication } }];
                })
                .onAny()
                .reply(200, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.CLAIM_PUBLICATION_CREATE_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                const expected = getPreCheckError(existingRecordPid);
                expect(e.message).toStrictEqual(expected.message);
                expect(e.original).toStrictEqual(expected.original);
                expect(e.request).toStrictEqual(expected.request);
            }
        });

        it('dispatched expected actions claiming an external publication that matches an espace record for contributor', async () => {
            const testRequest = {
                ...testClaimRequest,
                contributorLinking: {
                    valid: true,
                    authors: [
                        {
                            rek_author_id: testClaimRequest.author.aut_id,
                            rek_author_id_order: 1,
                        },
                    ],
                },
                publication: {
                    ...testClaimRequest.publication,
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id: testClaimRequest.author.aut_id,
                            rek_contributor_id_order: 1,
                        },
                    ],
                    sources: [
                        { source: 'crossref', id: 'test1' },
                        { source: 'scopus', id: 'test2' },
                        { source: 'wos', id: 'test3' },
                    ],
                    rek_pid: null,
                },
                files: {
                    queue: [
                        {
                            date: '2017-12-12T13:39:12+10:00',
                            access_condition_id: 9,
                            name: 'test.jpg',
                        },
                    ],
                },
            };

            const existingRecordPid = 'UQ:existing';
            mockApi
                .onPost(repositories.routes.CLAIM_PRE_CHECK().apiUrl)
                .reply(200, { data: { ...testClaimRequest.publication, rek_pid: existingRecordPid } })
                .onPost(repositories.routes.EXISTING_RECORD_API({ pid: 'UQ:1' }).apiUrl)
                .reply(response => {
                    const record = JSON.parse(response.data);
                    expect(record.rek_pid).toBe(existingRecordPid);
                    expect(
                        record.fez_record_search_key_contributor_id.filter(
                            item => item.fez_record_search_key_contributor_id === testClaimRequest.author.aut_id,
                        ).length,
                    ).toBe(1);
                    return [200, { record: { ...testClaimRequest.publication } }];
                })
                .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', { name: 'test.txt' })
                .reply(200, {})
                .onAny()
                .reply(200, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.FILE_UPLOAD_STARTED,
                `${actions.FILE_UPLOAD_PROGRESS}@test.jpg`,
                `${actions.FILE_UPLOAD_COMPLETE}@test.jpg`,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions when claiming a publication as a solo contributor', async () => {
            const testRequest = {
                ...testClaimRequest,
                publication: {
                    ...testClaimRequest.publication,
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor_id: [],
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 29254063,
                            rek_contributor_pid: 'UQ:332620',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'Hao, Y.',
                            rek_contributor_order: 1,
                        },
                    ],
                },
            };

            mockApi.onAny().reply(200, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions when claiming a publication as a solo author', async () => {
            const testRequest = {
                ...testClaimRequest,
                publication: {
                    ...testClaimRequest.publication,
                    fez_record_search_key_author: [
                        {
                            rek_contributor_id: 29254063,
                            rek_contributor_pid: 'UQ:332620',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'Hao, Y.',
                            rek_contributor_order: 1,
                        },
                    ],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor_id: [],
                    fez_record_search_key_contributor: [],
                },
            };

            mockApi.onAny().reply(200, {});

            const expectedActions = [
                actions.CLAIM_PUBLICATION_CREATE_PROCESSING,
                actions.CLAIM_PUBLICATION_CREATE_COMPLETED,
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }

            delete testRequest.publication.fez_record_search_key_author_id;
            delete testRequest.publication.fez_record_search_key_contributor_id;
            mockActionsStore.clearActions();
            await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
