import * as actions from './actionTypes';
import * as appActions from './app';
import * as mockData from 'mock/data';

describe('App action creator', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('dispatches expected actions when hidePossiblyYourPublicationsLure() is called', async () => {
        const expectedActions = [
            {type: actions.APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE}
        ];

        await mockActionsStore.dispatch(appActions.hidePossiblyYourPublicationsLure());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when showAppAlert() is called', async () => {
        const expectedActions = [
            {type: actions.APP_ALERT_SHOW}
        ];

        await mockActionsStore.dispatch(appActions.showAppAlert({}));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when dismissAppAlert() is called', async () => {
        const expectedActions = [
            {type: actions.APP_ALERT_HIDE}
        ];

        await mockActionsStore.dispatch(appActions.dismissAppAlert());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
