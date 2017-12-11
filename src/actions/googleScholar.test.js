import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import {api} from 'config';
import {currentAuthor} from '../mock/data/account';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as googleScholarActions from './googleScholar';

const getMockStore = () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    return mockStore({});
};

const expectStoreHasExpectedActions = (store, expectedActions) => {
    expect(store.getActions().map(action => ({type: action.type}))).toEqual(expect.arrayContaining(expectedActions));
};

describe('Google Scholar actions', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api, {delayResponse: 100});
    });

    afterEach(() => {
        mock.reset();
    });

    it('should dispatch 3 actions on successful patch of fez-author record', () => {
        mock.onPatch(repositories.routes.AUTHOR_API({userId: 410}))
            .reply(200, currentAuthor.uqresearcher.data);

        const expectedActions = [
            {type: actions.AUTHOR_IDENTIFIER_UPDATING},
            {type: actions.AUTHOR_IDENTIFIER_UPDATED},
            {type: actions.APP_ALERT_SHOW}
        ];

        const store = getMockStore();
        return store.dispatch(googleScholarActions.patchGoogleScholarId(410, 'kUemDfMAAAAJ')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch 3 actions on failure to patch fez-author record', () => {
        mock.onPatch(repositories.routes.AUTHOR_API({userId: 410}))
            .reply(403);

        const expectedActions = [
            {type: actions.AUTHOR_IDENTIFIER_UPDATING},
            {type: actions.AUTHOR_IDENTIFIER_UPDATE_FAILED},
            {type: actions.APP_ALERT_SHOW}
        ];

        const store = getMockStore();
        return store.dispatch(googleScholarActions.patchGoogleScholarId('410', 'kUemDfMAAAAJ')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });
});
