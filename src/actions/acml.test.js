import MockAdapter from 'axios-mock-adapter';
import {api} from 'config';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {getMockStore, expectStoreHasExpectedActions} from './actions-test-commons';

import * as acmlActions from './acml';

const store = getMockStore();

describe('ACML actions', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api, {delayResponse: 100});
    });

    afterEach(() => {
        mock.reset();
        store.clearActions();
    });

    const acmlApiData = {
        "total": 12,
        "data": [
            {
                "id": 1,
                "title": "UQ staff and students view only"
            },
            {
                "id": 2,
                "title": "Fully Embargoed (system admins only)"
            },
            {
                "id": 3,
                "title": "Only Thesis Office Approve, View, List. Printery View."
            },
            {
                "id": 4,
                "title": "Only SBS Theses Approve, View, List."
            },
            {
                "id": 5,
                "title": "ERA Assessors only"
            },
            {
                "id": 6,
                "title": "UQ staff and students and printery view only"
            },
            {
                "id": 7,
                "title": "Inherit from above"
            },
            {
                "id": 8,
                "title": "Admin and UPO access only"
            },
            {
                "id": 9,
                "title": "Open Access"
            },
            {
                "id": 10,
                "title": "HERDC evidence Admin and UPO List, View only"
            },
            {
                "id": 11,
                "title": "NTRO auditors"
            },
            {
                "id": 12,
                "title": "Admin List and View only"
            }
        ]
    };

    it('calls 2 actions on a successful quick-templates api call', () => {
        mock.onGet(repositories.routes.GET_ACML_QUICK_TEMPLATES_API())
            .reply(200, acmlApiData);

        const expectedActions = [
            {type: actions.ACML_QUICK_TEMPLATES_LOADING},
            {type: actions.ACML_QUICK_TEMPLATES_LOADED}
        ];

        const store = getMockStore();
        return store.dispatch(acmlActions.loadAcmlQuickTemplates()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 2 actions on a failed 404 quick-templates api call', () => {
        mock.onGet(repositories.routes.GET_ACML_QUICK_TEMPLATES_API())
            .reply(404);

        const expectedActions = [
            {type: actions.ACML_QUICK_TEMPLATES_LOADING},
            {type: actions.ACML_QUICK_TEMPLATES_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(acmlActions.loadAcmlQuickTemplates()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 2 actions on a failed 403 quick-templates api call and load anon user', () => {
        mock.onGet(repositories.routes.GET_ACML_QUICK_TEMPLATES_API())
            .reply(403);

        const expectedActions = [
            {type: actions.ACML_QUICK_TEMPLATES_LOADING},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: actions.ACML_QUICK_TEMPLATES_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(acmlActions.loadAcmlQuickTemplates()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

});
