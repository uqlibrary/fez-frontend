import {api} from 'config';
import {publicationYearsSmall, publicationStats, hindexResponse} from '../mock/data/academicStats';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as academicActions from './academic';

describe('Academic action creators', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api, {delayResponse: 100});
    });

    afterEach(() => {
        mock.reset();
    });

    it('should dispatch 3 actions on successful fetch of academic stats by publication year data', () => {
        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_YEARS_API({userId: 'testuser'}))
                .reply(200, publicationYearsSmall);

        const expectedActions = [
            {type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING},
            {type: actions.ACADEMIC_PUBLICATIONS_COUNT_LOADED},
            {type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED}
        ];

        const store = setupStoreForActions();
        return store.dispatch(academicActions.loadAuthorPublicationsByYear('testuser')).then(() => {
            expect(store.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    it('should dispatch 3 actions on successful fetch of academic stats (missing facets_count) on response by publication year data', () => {
        delete publicationYearsSmall.facet_counts;

        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_YEARS_API({userId: 'testuser'}))
            .reply(200, publicationYearsSmall);

        const expectedActions = [
            {type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING},
            {type: actions.ACADEMIC_PUBLICATIONS_COUNT_LOADED},
            {type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED}
        ];

        const store = setupStoreForActions();
        return store.dispatch(academicActions.loadAuthorPublicationsByYear('testuser')).then(() => {
            expect(store.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    it('should dispatch 3 actions on error 403 while fetching academic stats by publication year data', () => {
        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_YEARS_API({userId: 'testuser'}))
            .reply(403);

        const expectedActions = [
            {type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED}
        ];

        const store = setupStoreForActions();
        return store.dispatch(academicActions.loadAuthorPublicationsByYear('testuser')).then(() => {
            expect(store.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    it('should dispatch 2 actions on successful fetch of author\'s publication stats data and successful hindex api call', () => {
        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_STATS_API({userId: 'testuser'}))
            .reply(200, publicationStats);

        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: 'testuser'}))
            .reply(200, hindexResponse);

        const expectedActions = [
            {type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADING},
            {type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADED}
        ];

        const store = setupStoreForActions();
        return store.dispatch(academicActions.loadAuthorPublicationsStats('testuser')).then(() => {
            expect(store.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    it('should dispatch 3 actions on error 403 while fetching author\'s publication stats data', () => {
        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_STATS_API({userId: 'testuser'}))
            .reply(403, undefined);

        const expectedActions = [
            {type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADING},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: actions.ACADEMIC_PUBLICATIONS_STATS_FAILED}
        ];

        const store = setupStoreForActions();
        return store.dispatch(academicActions.loadAuthorPublicationsStats('testuser')).then(() => {
            expect(store.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    it('should dispatch 2 actions on error with stats while fetching author\'s publication stats data but error on hindex api call', () => {
        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_STATS_API({userId: 'testuser'}))
            .reply(200, publicationStats);

        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: 'testuser'}))
            .reply(500, null);

        const expectedActions = [
            {type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADING},
            {type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADED}
        ];

        const store = setupStoreForActions();
        return store.dispatch(academicActions.loadAuthorPublicationsStats('testuser')).then(() => {
            expect(store.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    it('should dispatch 2 actions on success with empty response while fetching author\'s publication stats data but error on hindex api call', () => {
        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_STATS_API({userId: 'testuser'}))
            .reply(200);

        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: 'testuser'}))
            .reply(500, null);

        const expectedActions = [
            {type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADING},
            {type: actions.ACADEMIC_PUBLICATIONS_STATS_FAILED}
        ];

        const store = setupStoreForActions();
        return store.dispatch(academicActions.loadAuthorPublicationsStats('testuser')).then(() => {
            expect(store.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});