import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as publications from './publications';
import * as incompleteRecordList from 'mock/data/records/incompleteRecordList';
import incompleteNTROrecord from 'mock/data/records/incompleteNTROrecord';
import { updateIncompleteRecord } from './incompleteRecords';

describe('incompleteRecords actions', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should call loading/loaded actions on successful load', async () => {
        mockApi
            .onGet(repositories.routes.INCOMPLETE_RECORDS_API({}).apiUrl)
            .reply(200, incompleteRecordList);

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADING,
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADED
        ];

        await mockActionsStore.dispatch(publications.searchAuthorIncompletePublications({}));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on failed load', async () => {
        mockApi
            .onAny()
            .reply(404);

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADING,
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_FAILED
        ];

        await mockActionsStore.dispatch(publications.searchAuthorIncompletePublications({}));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call fixing/fixed actions on successful save', async () => {
        mockApi
            .onPatch(repositories.routes.EXISTING_RECORD_API({ pid: 'UQ:692945' }).apiUrl)
            .reply(200, { data: incompleteNTROrecord });

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_SUCCESS
        ];

        const data = {
            author: {
                aut_id: 1,
            },
            publication: {
                rek_pid: 'UQ:692945',
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 1,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 100,
                    },
                ],
            },
            files: {
                queue: [],
            },
        };

        await mockActionsStore.dispatch(updateIncompleteRecord(data));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call fixing/fix_failed actions on failed load', async () => {
        mockApi
            .onAny()
            .reply(404);

        const expectedActions = [
            actions.FIX_RECORD_PROCESSING,
            actions.FIX_RECORD_FAILED
        ];

        try {
            await mockActionsStore.dispatch(updateIncompleteRecord({}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(e.message).toBe('Incomplete data for requests');
        }

        const data = {
            author: {
                aut_id: 1,
            },
            publication: {
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 100,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 200,
                    },
                ],
            }
        };

        try {
            await mockActionsStore.dispatch(updateIncompleteRecord(data));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(e.message).toBe('Current author is not linked to this record');
        }

        data.publication.fez_record_search_key_author_id[0].rek_author_id = 1;

        try {
            await mockActionsStore.dispatch(updateIncompleteRecord(data));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(e.message).toBe('The requested page could not be found.');
        }

    });

});
