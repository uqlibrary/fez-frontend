import * as actions from './actionTypes';
import * as appActions from './app';

describe('App action creator', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('dispatches expected actions when hidePossiblyYourPublicationsLure() is called', async () => {
        const expectedActions = [actions.APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE];

        await mockActionsStore.dispatch(appActions.hidePossiblyYourPublicationsLure());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when showAppAlert() is called', async () => {
        const expectedActions = [actions.APP_ALERT_SHOW];

        await mockActionsStore.dispatch(appActions.showAppAlert({}));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when dismissAppAlert() is called', async () => {
        const expectedActions = [actions.APP_ALERT_HIDE];

        await mockActionsStore.dispatch(appActions.dismissAppAlert());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches an action to set redirect path', () => {
        const input = '/records/add/find';

        const expectedActions = [actions.SET_REDIRECT_PATH];

        mockActionsStore.dispatch(appActions.setRedirectPath(input));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches an action to clear redirect path', () => {
        const expectedActions = [actions.CLEAR_REDIRECT_PATH];

        mockActionsStore.dispatch(appActions.clearRedirectPath());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
