import MockAdapter from 'axios-mock-adapter';

import {api} from 'config';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as recordActions from './records';

import {getMockStore, expectStoreHasExpectedActions} from './actions-test-commons';
import * as mockData from "../mock/data";

const store = getMockStore();

describe('Record action creators', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api, {delayResponse: 100});
    });

    afterEach(() => {
        mock.reset();
        store.clearActions();
    });

    it('should dispatch CREATE_RECORD_SAVING and CREATE_RECORD_SUCCESS actions for create new record', () => {
        const data = {
            "currentAuthor": [
                {
                    "nameAsPublished": "Researcher, J",
                    "authorId": 410
                }
            ],
            "rek_title": "test",
            "rek_display_type": 179,
            "authors": [
                {
                    "nameAsPublished": "test",
                    "disabled": false,
                    "selected": true,
                    "authorId": 410
                }
            ],
            "editors": [],
            "files": [],
            "supervisors": [],
            "fieldOfResearch": "",
            "fez_record_search_key_journal_name": {
                "rek_journal_name": "test"
            },
            "rek_date": "2017-01-01",
            "rek_subtype": "Article (original research)"
        };

        mock.onPost(repositories.routes.NEW_RECORD_API())
            .reply(200, {data: {...mockData.record}})
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: 'UQ:396321'}))
            .reply(200, {data: {...mockData.record}});

        const expectedActions = [
            {type: actions.CREATE_RECORD_SAVING},
            {type: actions.CREATE_RECORD_SUCCESS}
        ];

        return store.dispatch(recordActions.createNewRecord(data)).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch CREATE_RECORD_SAVING, CURRENT_ACCOUNT_ANONYMOUS and CREATE_RECORD_FAILED actions for create new record', () => {
        const data = {
            "currentAuthor": [
                {
                    "nameAsPublished": "Researcher, J",
                    "authorId": 410
                }
            ],
            "rek_title": "test",
            "rek_display_type": 179,
            "authors": [
                {
                    "nameAsPublished": "test",
                    "disabled": false,
                    "selected": true,
                    "authorId": 410
                }
            ],
            "fez_record_search_key_journal_name": {
                "rek_journal_name": "test"
            },
            "rek_date": "2017-01-01",
            "rek_subtype": "Article (original research)"
        };

        mock.onPost(repositories.routes.NEW_RECORD_API())
            .reply(403, {});

        const expectedActions = [
            {type: actions.CREATE_RECORD_SAVING},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: actions.CREATE_RECORD_FAILED}
        ];

        return store.dispatch(recordActions.createNewRecord(data)).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        }).catch((error) => {
            // expect(error.message).toEqual('Request failed with status code 403');
        });
    });

    it('should dispatch CREATE_RECORD_SAVING and CREATE_RECORD_SUCCESS actions for patch record failed', () => {
        const data = {
            "currentAuthor": [
                {
                    "nameAsPublished": "Researcher, J",
                    "authorId": 410
                }
            ],
            "rek_title": "test",
            "rek_display_type": 179,
            "authors": [
                {
                    "nameAsPublished": "test",
                    "disabled": false,
                    "selected": true,
                    "authorId": 410
                }
            ],
            "fez_record_search_key_journal_name": {
                "rek_journal_name": "test"
            },
            "rek_date": "2017-01-01",
            "rek_subtype": "Article (original research)",
            "files": {
                "queue": [
                    {
                        "name": "test.txt"
                    }
                ]
            }
        };

        mock.onPost(repositories.routes.NEW_RECORD_API())
            .reply(200, {data: {...mockData.record}})
            .onPatch(repositories.routes.EXISTING_RECORD_API({pid: 'UQ:396321'}))
            .reply(500)
            .onGet(repositories.routes.FILE_UPLOAD_API({pid: 'UQ:396321', fileName: "test.txt"}))
            .reply(200, 's3-ap-southeast-2.amazonaws.com')
            .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"}, )
            .reply(200, {});

        const expectedActions = [
            {type: actions.CREATE_RECORD_SAVING},
            {type: actions.CREATE_RECORD_SUCCESS}
        ];

        return store.dispatch(recordActions.createNewRecord(data)).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch CREATE_RECORD_RESET action', () => {
        store.dispatch(recordActions.clearNewRecord());
        expectStoreHasExpectedActions(store, [{type: actions.CREATE_RECORD_RESET}]);
    });
});