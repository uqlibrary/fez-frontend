import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as acmlActions from './acml';

describe('ACML actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    const acmlApiData = {
        total: 12,
        data: [
            {
                id: 1,
                title: 'UQ staff and students view only',
            },
            {
                id: 2,
                title: 'Fully Embargoed (system admins only)',
            },
            {
                id: 3,
                title: 'Only Thesis Office Approve, View, List. Printery View.',
            },
            {
                id: 4,
                title: 'Only SBS Theses Approve, View, List.',
            },
            {
                id: 5,
                title: 'ERA Assessors only',
            },
            {
                id: 6,
                title: 'UQ staff and students and printery view only',
            },
            {
                id: 7,
                title: 'Inherit from above',
            },
            {
                id: 8,
                title: 'Admin and UPO access only',
            },
            {
                id: 9,
                title: 'Open Access',
            },
            {
                id: 10,
                title: 'HERDC evidence Admin and UPO List, View only',
            },
            {
                id: 11,
                title: 'NTRO auditors',
            },
            {
                id: 12,
                title: 'Admin List and View only',
            },
        ],
    };

    it('calls 2 actions on a successful quick-templates api call', async () => {
        mockApi.onGet(repositories.routes.GET_ACML_QUICK_TEMPLATES_API().apiUrl).reply(200, acmlApiData);

        const expectedActions = [actions.ACML_QUICK_TEMPLATES_LOADING, actions.ACML_QUICK_TEMPLATES_LOADED];

        await mockActionsStore.dispatch(acmlActions.loadAcmlQuickTemplates());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('calls 2 actions on a failed 404 quick-templates api call', async () => {
        mockApi.onAny().reply(404);

        const expectedActions = [actions.ACML_QUICK_TEMPLATES_LOADING, actions.ACML_QUICK_TEMPLATES_FAILED];

        await mockActionsStore.dispatch(acmlActions.loadAcmlQuickTemplates());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('calls 3 actions on a failed 403 quick-templates api call and load anon user', async () => {
        mockApi.onAny().reply(403);

        const expectedActions = [
            actions.ACML_QUICK_TEMPLATES_LOADING,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.ACML_QUICK_TEMPLATES_FAILED,
        ];

        await mockActionsStore.dispatch(acmlActions.loadAcmlQuickTemplates());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
