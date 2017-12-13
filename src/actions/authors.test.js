import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import {api} from 'config';

import * as repositories from 'repositories';
import * as authors from './authors';

const getMockStore = () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    return mockStore({});
};

const expectStoreHasExpectedActions = (store, expectedActions) => {
    expect(store.getActions().map(action => ({type: action.type}))).toEqual(expect.arrayContaining(expectedActions));
};

describe('Action creators for authors', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api, {delayResponse: 100});
    });

    afterEach(() => {
        mock.reset();
    });

    it('should update fez-author record successfully if API call succeeded', async () => {
        const authorId = 1234;
        const patchRequest = {aut_id: authorId, aut_google_scholar_id: '1001'};

        mock.onPatch(repositories.routes.AUTHOR_API({authorId: authorId}, patchRequest))
            .reply(200, {data: {...patchRequest}});

        const expectedActions = [
            { type: 'CURRENT_AUTHOR_SAVING' },
            { type: 'CURRENT_AUTHOR_SAVED' }
        ];

        const store = getMockStore();
        await store.dispatch(authors.updateCurrentAuthor(authorId, patchRequest));
        expectStoreHasExpectedActions(store, expectedActions);
    });

    it('should fail update fez-author record if API call failed', async () => {
        const authorId = 1234;
        const patchRequest = {aut_id: authorId, aut_google_scholar_id: '1001'};

        mock.onPatch(repositories.routes.AUTHOR_API({authorId: authorId}, patchRequest))
            .reply(500);

        const expectedActions = [
            { type: 'CURRENT_AUTHOR_SAVING' },
            { type: 'CURRENT_AUTHOR_SAVE_FAILED' }
        ];

        const store = getMockStore();
        try {
            await store.dispatch(authors.updateCurrentAuthor(authorId, patchRequest));
        } catch(e) {
            expectStoreHasExpectedActions(store, expectedActions);
        }
    });
});
