import * as actions from 'actions/actionTypes';
import adminDashboardConfigReducer, { initialState, transformData } from './adminDashboardConfig';

describe('admin dashboard config reducer', () => {
    it('returns the correct state while admin dashboard config is loading', () => {
        const test = adminDashboardConfigReducer(initialState, { type: actions.ADMIN_DASHBOARD_CONFIG_LOADING });
        expect(test.adminDashboardConfigLoading).toEqual(true);
    });

    it('returns the correct state when admin dashboard config is loaded', () => {
        const test = adminDashboardConfigReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_CONFIG_SUCCESS,
            payload: {
                data: [{ id: 1 }],
            },
        });

        expect(test.adminDashboardConfigLoading).toEqual(false);
        expect(test.adminDashboardConfigSuccess).toEqual(true);
        expect(test.adminDashboardConfigData).toEqual([{ id: 1 }]);
        expect(test.adminDashboardConfigError).toEqual(null);
    });

    it('returns the correct state when admin dashboard config fails to load data', () => {
        const test = adminDashboardConfigReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_CONFIG_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.adminDashboardConfigLoading).toEqual(false);
        expect(test.adminDashboardConfigSuccess).toEqual(null);
        expect(test.adminDashboardConfigData).toEqual(null);
        expect(test.adminDashboardConfigError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardConfigReducer(initialState, { type: actions.ADMIN_DASHBOARD_CONFIG_CLEAR });
        expect(test).toEqual(initialState);
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = adminDashboardConfigReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
describe('transformData', () => {
    it('should transform user names', () => {
        const original = {
            admin_users: [
                { given_names: 'Michael', family_name: 'Feeney' },
                { given_names: 'Another', family_name: 'Staff' },
                { given_names: 'Elizabeth', family_name: 'Alvey' },
                { given_names: 'Lee', family_name: 'Sibbald' },
                { given_names: 'Givename' },
                { family_name: 'Familyname' },
                { name: 'Neither names' },
            ],
        };
        const expected = {
            admin_users: [
                { given_names: 'Michael', family_name: 'Feeney', preferred_name: 'Feeney, Michael' },
                { given_names: 'Another', family_name: 'Staff', preferred_name: 'Staff, Another' },
                { given_names: 'Elizabeth', family_name: 'Alvey', preferred_name: 'Alvey, Elizabeth' },
                { given_names: 'Lee', family_name: 'Sibbald', preferred_name: 'Sibbald, Lee' },
                { given_names: 'Givename', preferred_name: 'Givename' },
                { family_name: 'Familyname', preferred_name: 'Familyname' },
                { name: 'Neither names', preferred_name: 'Neither names' },
            ],
        };
        expect(transformData(original)).toEqual(expected);
    });
});
