import * as actions from 'actions/actionTypes';
import adminDashboardQuickLinksReducer, { initialState } from './adminDashboardQuickLinks';

describe('admin dashboard quick link reducer', () => {
    it('returns the correct state while admin dashboard quick link is loading', () => {
        const test = adminDashboardQuickLinksReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_QUICKLINKS_LOADING,
        });
        expect(test.adminDashboardQuickLinksLoading).toEqual(true);
    });

    it('returns the correct state when admin dashboard quick link is loaded', () => {
        const test = adminDashboardQuickLinksReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_QUICKLINKS_SUCCESS,
            payload: {
                data: [{ id: 1 }],
            },
        });

        expect(test.adminDashboardQuickLinksLoading).toEqual(false);
        expect(test.adminDashboardQuickLinksSuccess).toEqual(true);
        expect(test.adminDashboardQuickLinksData).toEqual([{ id: 1 }]);
        expect(test.adminDashboardQuickLinksError).toEqual(null);
    });

    it('returns the correct state when admin dashboard quick link fails to load data', () => {
        const test = adminDashboardQuickLinksReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_QUICKLINKS_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.adminDashboardQuickLinksLoading).toEqual(false);
        expect(test.adminDashboardQuickLinksSuccess).toEqual(null);
        expect(test.adminDashboardQuickLinksData).toEqual(null);
        expect(test.adminDashboardQuickLinksError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardQuickLinksReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_QUICKLINKS_CLEAR,
        });
        expect(test).toEqual(initialState);
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = adminDashboardQuickLinksReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});

describe('admin dashboard quick link updating reducer', () => {
    it('returns the correct state while admin dashboard quick link updating is loading', () => {
        const test = adminDashboardQuickLinksReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING,
        });
        expect(test.adminDashboardQuickLinksUpdating).toEqual(true);
    });

    it('returns the correct state when admin dashboard quick link updating succeeds', () => {
        const test = adminDashboardQuickLinksReducer(
            { ...initialState, adminDashboardQuickLinksData: [{ id: 2 }] },
            {
                type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS,
                payload: {
                    data: [{ id: 1 }],
                },
            },
        );

        expect(test.adminDashboardQuickLinksData).toEqual([{ id: 2 }]); // other state should remain
        expect(test.adminDashboardQuickLinksUpdating).toEqual(false);
        expect(test.adminDashboardQuickLinksUpdateSuccess).toEqual(true);
    });

    it('returns the correct state when admin dashboard quick link updating fails to load data', () => {
        const test = adminDashboardQuickLinksReducer(
            { ...initialState, adminDashboardQuickLinksData: [{ id: 3 }] },
            {
                type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED,
                payload: {
                    status: 500,
                    message: 'Test error',
                },
            },
        );
        expect(test.adminDashboardQuickLinksData).toEqual([{ id: 3 }]); // other state should remain
        expect(test.adminDashboardQuickLinksUpdating).toEqual(false);
        expect(test.adminDashboardQuickLinksUpdateSuccess).toEqual(null);
        expect(test.adminDashboardQuickLinksUpdateFailed).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardQuickLinksReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_QUICKLINKS_CLEAR,
        });
        expect(test).toEqual(initialState);
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = adminDashboardQuickLinksReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardQuickLinksReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_CLEAR,
        });
        expect(test).toEqual(initialState);
    });
});
