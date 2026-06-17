import { renderHook, act } from 'test-utils';

import {
    useSystemAlertDrawer,
    useAlertStatus,
    useAdminDashboardConfig,
    useSystemAlertColumns,
    useAdminUsers,
    useAdminUserOptions,
} from './hooks';

const mockDispatch = jest.fn();
const mockSelector = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: selector => mockSelector(selector),
}));

const mockAdminUsers = [
    { id: 13, preferred_name: 'Staff' },
    { id: 23, preferred_name: 'Another Staff' },
];

const mockCurrentUser = { id: 23, preferred_name: 'Another Staff' };

const mockState = (config = {}) =>
    mockSelector.mockImplementation(selector =>
        selector({
            get: key => {
                if (key === 'adminDashboardConfigReducer') {
                    return { adminDashboardConfigData: config };
                }
                return {};
            },
        }),
    );

describe('hooks', () => {
    describe('useSystemAlertDrawer', () => {
        it('returns default state', () => {
            const { result } = renderHook(useSystemAlertDrawer);

            expect(result.current.open).toBe(false);
            expect(result.current.row).toEqual({});
            expect(typeof result.current.openDrawer).toEqual('function');
            expect(typeof result.current.closeDrawer).toEqual('function');
        });
        it('handles open/close state', () => {
            const { result } = renderHook(useSystemAlertDrawer);
            act(() => {
                result.current.openDrawer({ id: '123' });
            });
            expect(result.current.open).toBe(true);
            expect(result.current.row).toEqual({ id: '123' });

            act(() => {
                result.current.closeDrawer();
            });
            expect(result.current.open).toBe(false);
            expect(result.current.row).toEqual({});
        });
        it('handled row data updating when drawer is open', () => {
            const init = { id: '123', value: 1 };
            const { result, rerender } = renderHook(useSystemAlertDrawer, { initialProps: init });
            expect(result.current.row).toEqual({});
            act(() => {
                result.current.openDrawer(init);
            });
            expect(result.current.open).toBe(true);
            expect(result.current.row).toEqual(init);
            rerender([{ ...init, value: 100 }]);
            expect(result.current.row).toEqual({ id: '123', value: 100 });
        });
    });

    describe('useAlertStatus', () => {
        // afterEach(() => {
        //     jest.clearAllMocks();
        // });

        it('returns closed state', () => {
            const { result } = renderHook(() => useAlertStatus({ hideAction: jest.fn() }));

            const [alertIsVisible] = result.current;
            expect(alertIsVisible).toBe(false);
        });

        it('returns open state', () => {
            const hideFn = jest.fn();

            const { result } = renderHook(() => useAlertStatus({ message: 'test message', hideAction: hideFn }));

            const [alertIsVisible] = result.current;
            expect(alertIsVisible).toBe(true);
        });

        it('moves from closed to open state', () => {
            let message = null;
            const hideAction = jest.fn();
            const { result, rerender } = renderHook(() => useAlertStatus({ message, hideAction }));

            let [alertIsVisible] = result.current;
            expect(alertIsVisible).toBe(false);

            message = 'test';
            rerender();
            [alertIsVisible] = result.current;
            expect(alertIsVisible).toBe(true);
        });

        it('manually moves from closed to open state', () => {
            const hideAction = jest.fn();
            const { result, rerender } = renderHook(() => useAlertStatus({ hideAction }));

            const [alertIsVisible, , showAlert] = result.current;

            expect(alertIsVisible).toBe(false);

            showAlert('Test message');
            rerender();
            const [updatedAlertIsVisible, , , message] = result.current;
            expect(updatedAlertIsVisible).toBe(true);
            expect(message).toBe('Test message');
        });

        it('moves from open to closed state', () => {
            let message = 'test';
            const hideAction = jest.fn();
            const { result, rerender } = renderHook(() => useAlertStatus({ message, hideAction }));

            // eslint-disable-next-line prefer-const
            let [alertIsVisible, hideAlert] = result.current;
            expect(alertIsVisible).toBe(true);

            message = null;
            act(() => {
                hideAlert();
            });

            rerender();
            [alertIsVisible] = result.current;
            expect(alertIsVisible).toBe(false);
        });
    });

    describe('useAdminDashboardConfig', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns empty object when config is missing', () => {
            mockSelector.mockImplementation(selector =>
                selector({
                    get: () => ({}),
                }),
            );

            const { result } = renderHook(useAdminDashboardConfig);

            expect(result.current).toEqual({});
        });

        it('returns config data from redux', () => {
            const config = {
                admin_users: [{ id: 1 }],
                logged_in_user: { id: 1 },
            };

            mockSelector.mockImplementation(selector =>
                selector({
                    get: key => {
                        if (key === 'adminDashboardConfigReducer') {
                            return { adminDashboardConfigData: config };
                        }
                        return {};
                    },
                }),
            );

            const { result } = renderHook(useAdminDashboardConfig);

            expect(result.current).toEqual(config);
        });
    });

    describe('useSystemAlertColumns', () => {
        const locale = {
            columns: {
                createdDate: 'Created',
                topic: 'Topic',
                status: 'Status',
            },
            alertStatus: {
                UNASSIGNED: 'Unassigned',
                UNKNOWN: 'Unknown',
            },
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns columns with default values', () => {
            mockState({});

            const { result } = renderHook(() => useSystemAlertColumns(locale));

            const statusColumn = result.current.find(col => col.field === 'sat_assigned_to');

            expect(statusColumn.valueOptions).toHaveLength(2); // Mine + Unassigned
        });

        it('includes users in status options', () => {
            mockState({
                admin_users: [
                    { id: 1, preferred_name: 'Alice' },
                    { id: 2, preferred_name: 'Bob' },
                ],
                logged_in_user: { id: 1 },
            });

            const { result } = renderHook(() => useSystemAlertColumns(locale));

            const statusColumn = result.current.find(col => col.field === 'sat_assigned_to');

            expect(statusColumn.valueOptions).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ value: 1, label: 'Alice' }),
                    expect.objectContaining({ value: 2, label: 'Bob' }),
                ]),
            );
        });

        it('updates when selector data changes', () => {
            let config = {
                admin_users: [{ id: 1, preferred_name: 'Alice' }],
                logged_in_user: { id: 1 },
            };

            mockState(config);

            const { result, rerender } = renderHook(() => useSystemAlertColumns(locale));

            let statusColumn = result.current.find(col => col.field === 'sat_assigned_to');

            expect(statusColumn.valueOptions).toHaveLength(3);

            config = {
                admin_users: [
                    { id: 1, preferred_name: 'Alice' },
                    { id: 2, preferred_name: 'Bob' },
                ],
                logged_in_user: { id: 1 },
            };

            mockState(config);
            rerender();

            statusColumn = result.current.find(col => col.field === 'sat_assigned_to');

            expect(statusColumn.valueOptions).toHaveLength(4);
        });
    });

    describe('useAdminUsers', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns users and currentUser from config', () => {
            mockState({ admin_users: mockAdminUsers, logged_in_user: mockCurrentUser });

            const { result } = renderHook(useAdminUsers);

            expect(result.current.users).toEqual(mockAdminUsers);
            expect(result.current.currentUser).toEqual(mockCurrentUser);
        });

        it('returns empty array when admin_users is not in config', () => {
            mockState({ logged_in_user: mockCurrentUser });

            const { result } = renderHook(useAdminUsers);

            expect(result.current.users).toEqual([]);
        });

        it('returns undefined currentUser when logged_in_user is not in config', () => {
            mockState({ admin_users: mockAdminUsers });

            const { result } = renderHook(useAdminUsers);

            expect(result.current.currentUser).toBeUndefined();
        });

        it('returns empty array and undefined currentUser when config is empty', () => {
            mockState();

            const { result } = renderHook(useAdminUsers);

            expect(result.current.users).toEqual([]);
            expect(result.current.currentUser).toBeUndefined();
        });
    });

    describe('useAdminUserOptions', () => {
        const mockLocale = 'Unassigned';

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns options with unassigned first, current user second, others sorted', () => {
            mockState({ admin_users: mockAdminUsers, logged_in_user: mockCurrentUser });

            const { result } = renderHook(() => useAdminUserOptions(mockLocale));

            expect(result.current[0]).toEqual({ id: 0, preferred_name: 'Unassigned' });
            expect(result.current[1]).toEqual(mockCurrentUser);
            expect(result.current[2]).toEqual({ id: 13, preferred_name: 'Staff' });
        });

        it('uses the unassigned label from locale', () => {
            mockState({ admin_users: mockAdminUsers, logged_in_user: mockCurrentUser });

            const { result } = renderHook(() => useAdminUserOptions('None'));

            expect(result.current[0].preferred_name).toBe('None');
        });

        it('returns only unassigned option when no users', () => {
            mockState({ admin_users: [], logged_in_user: mockCurrentUser });

            const { result } = renderHook(() => useAdminUserOptions(mockLocale));

            expect(result.current).toEqual([{ id: 0, preferred_name: 'Unassigned' }]);
        });

        it('returns memoized result when inputs have not changed', () => {
            mockState({ admin_users: mockAdminUsers, logged_in_user: mockCurrentUser });

            const { result, rerender } = renderHook(() => useAdminUserOptions(mockLocale));

            const first = result.current;
            rerender();

            expect(result.current).toBe(first);
        });

        it('updates options when config changes', () => {
            mockState({ admin_users: mockAdminUsers, logged_in_user: mockCurrentUser });

            const { result, rerender } = renderHook(() => useAdminUserOptions(mockLocale));

            expect(result.current).toHaveLength(3); // unassigned + 2 users

            mockState({
                admin_users: [...mockAdminUsers, { id: 33, preferred_name: 'Zoo Staff' }],
                logged_in_user: mockCurrentUser,
            });
            rerender();

            expect(result.current).toHaveLength(4); // unassigned + 3 users
        });

        it('excludes default option when called with no args', () => {
            mockState({ admin_users: mockAdminUsers, logged_in_user: mockCurrentUser });

            const { result } = renderHook(() => useAdminUserOptions());

            expect(result.current[0]).toEqual(mockCurrentUser);
            expect(result.current.every(u => u.id !== 0)).toBe(true);
        });
    });
});
