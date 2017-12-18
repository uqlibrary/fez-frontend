import MockAdapter from 'axios-mock-adapter';
import {api} from 'config';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {getMockStore, expectStoreHasExpectedActions} from './actions-test-commons';

import * as fixRecord from './fixRecord';
import * as mockData from 'mock/data';

const store = getMockStore();

describe('Fix record actions', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api, {delayResponse: 100});
    });

    afterEach(() => {
        mock.reset();
        store.clearActions();
    });

    describe('loadRecordToFix action', () => {
        it('should dispatch actions FIX_RECORD_LOADING and FIX_RECORD_LOADED when loading record to fix', () => {
            mock.onGet(repositories.routes.EXISTING_RECORD_API({pid: "UQ12345"}))
                .reply(200, {data: {...mockData.record}});

            const expectedActions = [
                {type: actions.FIX_RECORD_LOADING},
                {type: actions.FIX_RECORD_LOADED}
            ];

            const store = getMockStore();
            return store.dispatch(fixRecord.loadRecordToFix("UQ12345")).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
            });
        });

        it('dispatches actions FIX_RECORD_LOADING and FIX_RECORD_LOAD_FAILED when loading record to fix', () => {
            mock.onGet(repositories.routes.EXISTING_RECORD_API({pid: "UQ12345"}))
                .reply(500);

            const expectedActions = [
                {type: actions.FIX_RECORD_LOADING},
                {type: actions.FIX_RECORD_LOAD_FAILED}
            ];

            const store = getMockStore();
            return store.dispatch(fixRecord.loadRecordToFix("UQ12345")).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
            });
        });

        it('dispatches actions FIX_RECORD_LOADING, CURRENT_ACCOUNT_ANONYMOUS and FIX_RECORD_LOAD_FAILED on 403 error', () => {
            mock.onGet(repositories.routes.EXISTING_RECORD_API({pid: "UQ12345"}))
                .reply(403);

            const expectedActions = [
                {type: actions.FIX_RECORD_LOADING},
                {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
                {type: actions.FIX_RECORD_LOAD_FAILED}
            ];

            const store = getMockStore();
            return store.dispatch(fixRecord.loadRecordToFix("UQ12345")).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
            });
        });
    });

    describe('setFixRecord action', () => {
        it('should dispatch action FIX_RECORD_SET', () => {
            store.dispatch(fixRecord.setFixRecord({...mockData.record}));
            expectStoreHasExpectedActions(store, [{type: actions.FIX_RECORD_SET}]);
        });
    });

    describe('clearFixRecord action', () => {
        it('should dispatch action FIX_RECORD_CLEAR', () => {
            store.dispatch(fixRecord.clearFixRecord());
            expectStoreHasExpectedActions(store, [{type: actions.FIX_RECORD_CLEAR}]);
        });
    });

    describe('fixRecord action', () => {
        it('should dispatch action FIX_RECORD_FAILED for incomplete data (missing publication data)', () => {
            return store.dispatch(fixRecord.fixRecord({author: ''})).then(() => {
                expectStoreHasExpectedActions(store, [{type: actions.FIX_RECORD_FAILED}]);
            }).catch(error => expect(error.message).toEqual('Incomplete data for requests'));
        });

        it('should dispatch action FIX_RECORD_FAILED for incomplete data (missing author)', () => {
            return store.dispatch(fixRecord.fixRecord({publication: {}})).then(() => {
                expectStoreHasExpectedActions(store, [{type: actions.FIX_RECORD_FAILED}]);
            }).catch(error => expect(error.message).toEqual('Incomplete data for requests'));
        });

        it('should dispatch action FIX_RECORD_FAILED if author is not linked', () => {
            const data = {
                publication: {
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 123
                        }
                    ]
                },
                author: {
                    aut_id: 124
                }
            };

            return store.dispatch(fixRecord.fixRecord(data)).then(() => {
                expectStoreHasExpectedActions(store, [{type: actions.FIX_RECORD_FAILED}]);
            }).catch(error => expect(error.message).toEqual('Current author is not linked to this record'));
        });

        it('should dispatch actions FIX_RECORD_PROCESSING and FIX_RECORD_SUCCESS for valid data with files but no link', () => {
            const data = {
                publication: {
                    ...mockData.record
                },
                author: {
                    aut_id: 85056
                },
                files: {
                    queue: [
                        {
                            name: 'test.txt'
                        }
                    ]
                }
            };

            mock.onGet(repositories.routes.FILE_UPLOAD_API({pid: 'UQ:396321', fileName: "test.txt"}))
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"}, )
                .reply(200, {})
                .onPatch(repositories.routes.EXISTING_RECORD_API({pid: 'UQ:396321'}))
                .reply(200, {data: {...data}})
                .onPost(repositories.routes.RECORDS_ISSUES_API({pid: 'UQ:396321'}))
                .reply(200, {});

            const expectedActions = [
                {type: actions.FIX_RECORD_PROCESSING},
                {type: actions.FIX_RECORD_SUCCESS}
            ];

            return store.dispatch(fixRecord.fixRecord(data)).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
            });
        });

        it('should dispatch actions FIX_RECORD_PROCESSING and FIX_RECORD_SUCCESS for valid data with link but without files', () => {
            const data = {
                publication: {
                    ...mockData.record
                },
                author: {
                    aut_id: 85056
                },
                rek_link: 'http://www.google.com'
            };

            mock.onPatch(repositories.routes.EXISTING_RECORD_API({pid: 'UQ:396321'}))
                .reply(200, {data: {...data}})
                .onPost(repositories.routes.RECORDS_ISSUES_API({pid: 'UQ:396321'}))
                .reply(200, {});

            const expectedActions = [
                {type: actions.FIX_RECORD_PROCESSING},
                {type: actions.FIX_RECORD_SUCCESS}
            ];

            return store.dispatch(fixRecord.fixRecord(data)).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
            });
        });

        it('should dispatch actions FIX_RECORD_PROCESSING and FIX_RECORD_SUCCESS for valid data without files or link', () => {
            const data = {
                publication: {
                    ...mockData.record
                },
                author: {
                    aut_id: 85056
                }
            };

            mock.onPost(repositories.routes.RECORDS_ISSUES_API({pid: 'UQ:396321'}))
                .reply(200, {});

            const expectedActions = [
                {type: actions.FIX_RECORD_PROCESSING},
                {type: actions.FIX_RECORD_SUCCESS}
            ];

            return store.dispatch(fixRecord.fixRecord(data)).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
            });
        });

        it('should dispatch actions FIX_RECORD_PROCESSING, CURRENT_ACCOUNT_ANONYMOUS and FIX_RECORD_FAILED on 403 error', () => {
            const data = {
                publication: {
                    ...mockData.record
                },
                author: {
                    aut_id: 85056
                }
            };

            const expectedActions = [
                {type: actions.FIX_RECORD_PROCESSING},
                {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
                {type: actions.FIX_RECORD_FAILED}
            ];

            mock.onPost(repositories.routes.RECORDS_ISSUES_API({pid: 'UQ:396321'}))
                .reply(403, {});

            return store.dispatch(fixRecord.fixRecord(data)).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
            }).catch(error => expect(error.message).toEqual('Request failed with status code 403'));
        });

        it('should dispatch actions FIX_RECORD_PROCESSING and FIX_RECORD_FAILED on 500 error', () => {
            const data = {
                publication: {
                    ...mockData.record
                },
                author: {
                    aut_id: 85056
                }
            };

            const expectedActions = [
                {type: actions.FIX_RECORD_PROCESSING},
                {type: actions.FIX_RECORD_FAILED}
            ];

            mock.onPost(repositories.routes.RECORDS_ISSUES_API({pid: 'UQ:396321'}))
                .reply(500, {});

            return store.dispatch(fixRecord.fixRecord(data)).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
            }).catch(error => expect(error.message).toEqual('Request failed with status code 500'));
        });
    });

    describe('unclaimRecord action', () => {
        it('should dispatch action FIX_RECORD_FAILED for incomplete data (missing publication data)', () => {
            return store.dispatch(fixRecord.unclaimRecord({author: ''})).then(() => {
                expectStoreHasExpectedActions(store, [{type: actions.FIX_RECORD_FAILED}]);
            }).catch(error => expect(error.message).toEqual('Incomplete data for requests.'));
        });

        it('should dispatch action FIX_RECORD_FAILED for incomplete data (missing author)', () => {
            return store.dispatch(fixRecord.unclaimRecord({publication: {}})).then(() => {
                expectStoreHasExpectedActions(store, [{type: actions.FIX_RECORD_FAILED}]);
            }).catch(error => expect(error.message).toEqual('Incomplete data for requests.'));
        });

        it('should dispatch action FIX_RECORD_FAILED if author and contributor is not linked', () => {
            const data = {
                publication: {
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 123
                        }
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id: 125
                        }
                    ]
                },
                author: {
                    aut_id: 124
                }
            };

            return store.dispatch(fixRecord.unclaimRecord(data)).then(() => {
                expectStoreHasExpectedActions(store, [{type: actions.FIX_RECORD_FAILED}]);
            }).catch(error => expect(error.message).toEqual('Current author is not linked to this record.'));
        });

        it('should dispatch actions FIX_RECORD_PROCESSING and FIX_RECORD_UNCLAIM_SUCCESS', () => {
            const data = {
                publication: {
                    ...mockData.record,
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 123
                        }
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id: 123
                        }
                    ]
                },
                author: {
                    aut_id: 123
                }
            };

            mock.onPatch(repositories.routes.EXISTING_RECORD_API({pid: 'UQ:396321'}))
                .reply(200, {data: {...data}});

            const expectedActions = [
                {type: actions.FIX_RECORD_PROCESSING},
                {type: actions.FIX_RECORD_UNCLAIM_SUCCESS}
            ];

            return store.dispatch(fixRecord.unclaimRecord(data)).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
            });
        });

        it('should dispatch actions FIX_RECORD_PROCESSING, CURRENT_ACCOUNT_ANONYMOUS and FIX_RECORD_FAILED on 403 error', () => {
            const data = {
                publication: {
                    ...mockData.record,
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 123
                        }
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id: 123
                        }
                    ]
                },
                author: {
                    aut_id: 123
                }
            };

            mock.onPatch(repositories.routes.EXISTING_RECORD_API({pid: 'UQ:396321'}))
                .reply(403, {data: {...data}});

            const expectedActions = [
                {type: actions.FIX_RECORD_PROCESSING},
                {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
                {type: actions.FIX_RECORD_FAILED}
            ];

            return store.dispatch(fixRecord.unclaimRecord(data)).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
            }).catch(error => expect(error.message).toEqual('Failed patch record request.'));
        });
    });
});
