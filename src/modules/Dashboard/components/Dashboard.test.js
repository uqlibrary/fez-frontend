import React from 'react';
import Dashboard, { fibonacci, isWaitingForSync } from './Dashboard';
import * as mock from 'mock/data';
import { initialState as orcidSyncInitialState } from 'reducers/orcidSync';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';
import { within } from '@testing-library/react';
import { DASHBOARD_HIDE_ORCID_SYNC_DIALOG_COOKIE } from '../../../config/general';
import Cookies from 'js-cookie';
import * as DashboardAuthorProfileModule from './DashboardAuthorProfile';
import { OrcidSyncContext } from '../../../context';

const mockActions = {
    countPossiblyYourPublications: jest.fn(),
    loadAuthorPublicationsStats: jest.fn(),
    searchAuthorPublications: jest.fn(),
    loadOrcidSyncStatus: jest.fn(),
};

const mockUseNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockUseNavigate,
}));

const mockHelpIconOpenDrawer = jest.fn();
jest.mock('modules/SharedComponents/Toolbox/HelpDrawer', () => {
    const React = require('react');
    return {
        ...jest.requireActual('modules/SharedComponents/Toolbox/HelpDrawer'),
        HelpIcon: React.forwardRef((props, ref) => {
            React.useImperativeHandle(ref, () => ({ openDrawer: mockHelpIconOpenDrawer }));
            return <div data-testid="mock-help-icon" />;
        }),
    };
});

const loadOrcidSyncDelay = 1;
function setup(testProps = {}, renderMethod = render) {
    const props = {
        theme: {},
        author: mock.currentAuthor.uqresearcher.data,
        account: mock.accounts.uqresearcher,
        authorDetails: {
            is_administrator: 0,
            is_super_administrator: 0,
            espace: {
                first_year: '1998',
                last_year: '2000',
                doc_count: 32,
            },
        },
        accountAuthorDetailsLoading: false,
        publicationTotalCount: null,
        loadingPublicationsByYear: false,
        hidePossiblyYourPublicationsLure: false,
        loadingPublicationsStats: false,
        possiblyYourPublicationsCountLoading: false,
        actions: mockActions,
        loadingIncompleteRecordData: false,
        incomplete: {
            publicationsListPagingData: {},
            loadingPublicationsList: false,
            publicationsList: [],
            publicationsListFacets: {},
            ...testProps.incomplete,
        },
        loadOrcidSyncDelay,
        ...orcidSyncInitialState,
        ...testProps,
    };
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <Dashboard {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Dashboard test', () => {
    afterEach(() => {
        Cookies.remove(DASHBOARD_HIDE_ORCID_SYNC_DIALOG_COOKIE);
        jest.clearAllMocks();
    });

    it('does navigate to records add find page when clicked addPublicationLure', () => {
        const { getByTestId } = setup({});
        fireEvent.click(getByTestId('action-button'));
        expect(mockUseNavigate).toHaveBeenCalledWith('/records/add/find');
    });

    it('_claimYourPublications method', () => {
        const { getByTestId } = setup({ possiblyYourPublicationsCount: 5 });
        fireEvent.click(getByTestId('action-button'));
        expect(mockUseNavigate).toBeCalledWith('/records/possible');
    });

    it('redirectToMissingRecordsList method', () => {
        const { getByText } = setup({
            incomplete: {
                publicationsList: [],
                publicationsListPagingData: {
                    total: 1,
                    took: 30,
                    per_page: 20,
                    current_page: 1,
                    from: 1,
                    to: 1,
                    data: [1],
                    filters: {},
                },
            },
            authorDetails: mock.authorDetails.uqresearcher,
        });
        fireEvent.click(getByText(/View and Complete/i));
        expect(mockUseNavigate).toBeCalledWith('/records/incomplete');
    });

    it('redirectToOaComplianceRecordlist method', () => {
        const { getByText } = setup({
            noncompliantoa: {
                publicationsList: [],
                publicationsListPagingData: {
                    total: 1,
                    took: 30,
                    per_page: 20,
                    current_page: 1,
                    from: 1,
                    to: 1,
                    data: [1],
                    filters: {},
                },
            },
            authorDetails: mock.authorDetails.uqresearcher,
        });
        fireEvent.click(getByText(/View and Fix/i));
        expect(mockUseNavigate).toBeCalledWith('/records/my-open-access');
    });

    it('should have helper to generate fibonacci numbers', () => {
        const fibonacciSeries = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
        fibonacciSeries.forEach((num, index) => {
            expect(fibonacci(index)).toBe(num);
        });
    });

    it('should have helper to determine orcId loading status', () => {
        expect(isWaitingForSync({ orj_status: 'Pending' })).toBe(true);
        expect(isWaitingForSync({ orj_status: 'In Progress' })).toBe(true);
        expect(isWaitingForSync({ orj_status: 'Fail' })).toBe(false);
        expect(isWaitingForSync({ other_status: 'Pending' })).toBe(false);
        expect(isWaitingForSync({})).toBe(false);
        expect(isWaitingForSync()).toBe(false);
    });

    describe('ORCID', () => {
        describe('Load Sync Status', () => {
            beforeEach(() => jest.useFakeTimers());

            it('should check sync status a few secs after mount', () => {
                setup({
                    orcidSyncEnabled: true,
                    loadingOrcidSyncStatus: false,
                });

                expect(mockActions.loadOrcidSyncStatus).not.toHaveBeenCalled();
                jest.runAllTimers();
                expect(mockActions.loadOrcidSyncStatus).toHaveBeenCalled();
            });

            it('should not make additional requests to check sync status when not requested', () => {
                setup({
                    orcidSyncEnabled: true,
                    loadingOrcidSyncStatus: false,
                });

                jest.runAllTimers();
                expect(mockActions.loadOrcidSyncStatus).toHaveBeenCalledTimes(1);
                // explicitly advance in time - it should be covered by the above jest.runAllTimers();
                jest.advanceTimersByTime(loadOrcidSyncDelay * 10000);
                expect(mockActions.loadOrcidSyncStatus).toHaveBeenCalledTimes(1);
            });

            it('should make additional sync status requests upon user requests', () => {
                const { rerender } = setup({
                    orcidSyncEnabled: true,
                    loadingOrcidSyncStatus: false,
                });

                jest.runAllTimers();
                expect(mockActions.loadOrcidSyncStatus).toHaveBeenCalledTimes(1);

                setup(
                    {
                        orcidSyncEnabled: true,
                        loadingOrcidSyncStatus: true,
                    },
                    rerender,
                );

                jest.runAllTimers();
                expect(mockActions.loadOrcidSyncStatus).toHaveBeenCalledTimes(1);

                setup(
                    {
                        orcidSyncEnabled: true,
                        loadingOrcidSyncStatus: false,
                        orcidSyncStatus: {
                            orj_status: 'Pending',
                        },
                    },
                    rerender,
                );

                jest.runAllTimers();
                expect(mockActions.loadOrcidSyncStatus).toHaveBeenCalledTimes(2);
            });

            it('should cancel scheduled sync status request before making new ones', () => {
                const spy = jest.spyOn(window, 'clearTimeout');

                const { rerender } = setup({
                    orcidSyncEnabled: true,
                    loadingOrcidSyncStatus: false,
                });

                jest.runAllTimers();
                // first call
                expect(spy).toHaveBeenNthCalledWith(1, null);

                setup({ orcidSyncEnabled: true, loadingOrcidSyncStatus: true }, rerender);
                jest.runAllTimers();

                setup(
                    {
                        orcidSyncEnabled: true,
                        loadingOrcidSyncStatus: false,
                        orcidSyncStatus: { orj_status: 'Pending' },
                    },
                    rerender,
                );
                jest.runAllTimers();

                // call before to unmount
                expect(spy).toHaveBeenNthCalledWith(spy.mock.calls.length - 1, expect.any(Number));
            });

            it('should cancel scheduled sync status request on unmount', () => {
                const spy = jest.spyOn(window, 'clearTimeout');
                const { unmount } = setup({
                    orcidSyncEnabled: true,
                    loadingOrcidSyncStatus: false,
                });

                spy.mockReset();
                unmount();
                expect(spy).toHaveBeenCalledWith(expect.any(Number));
            });
        });

        describe('Linking confirmation dialog', () => {
            it('should not display for authors without an ORCID', () => {
                const { queryByTestId } = setup({
                    author: {
                        ...mock.currentAuthor.uqresearcher.data,
                        aut_orcid_id: null,
                    },
                });
                expect(queryByTestId('dashboard-orcid-linking-dashboard')).not.toBeInTheDocument();
            });

            it('should not display for authors with ORCID syncing enabled', () => {
                const { queryByTestId } = setup({
                    author: {
                        ...mock.currentAuthor.uqresearcher.data,
                        aut_is_orcid_sync_enabled: 1,
                    },
                });
                expect(queryByTestId('dashboard-orcid-linking-dashboard')).not.toBeInTheDocument();
            });

            it('should display for authors with ORCID syncing disabled', () => {
                const { getByTestId } = setup({
                    author: {
                        ...mock.currentAuthor.uqresearcher.data,
                        aut_is_orcid_sync_enabled: 0,
                    },
                });
                expect(getByTestId('dashboard-orcid-linking-dashboard')).toBeInTheDocument();
            });

            it('should open ORCID Sync Settings Drawer on button click and hide itself', () => {
                const { getByTestId, queryByTestId } = setup({
                    author: {
                        ...mock.currentAuthor.uqresearcher.data,
                        aut_is_orcid_sync_enabled: 0,
                    },
                });
                fireEvent.click(within(getByTestId('dashboard-orcid-linking-dashboard')).getByTestId('action-button'));
                expect(queryByTestId('dashboard-orcid-linking-dashboard')).not.toBeInTheDocument();
                expect(mockHelpIconOpenDrawer).toHaveBeenCalledTimes(1);
            });

            it('should allow dismissing it', () => {
                expect(Cookies.get(DASHBOARD_HIDE_ORCID_SYNC_DIALOG_COOKIE)).toBeUndefined();
                const { getByTestId, queryByTestId } = setup({
                    author: {
                        ...mock.currentAuthor.uqresearcher.data,
                        aut_is_orcid_sync_enabled: 0,
                    },
                });

                expect(getByTestId('dashboard-orcid-linking-dashboard')).toBeInTheDocument();

                fireEvent.click(within(getByTestId('dashboard-orcid-linking-dashboard')).getByTestId('dismiss-mobile'));

                expect(queryByTestId('dashboard-orcid-linking-dashboard')).not.toBeInTheDocument();
                expect(Cookies.get(DASHBOARD_HIDE_ORCID_SYNC_DIALOG_COOKIE)).toBe('true');
            });

            it('should not display if it has been dismissed before', () => {
                expect(Cookies.get(DASHBOARD_HIDE_ORCID_SYNC_DIALOG_COOKIE)).toBeUndefined();
                const { getByTestId, queryByTestId, rerender } = setup({
                    author: {
                        ...mock.currentAuthor.uqresearcher.data,
                        aut_is_orcid_sync_enabled: 0,
                    },
                });
                expect(getByTestId('dashboard-orcid-linking-dashboard')).toBeInTheDocument();

                Cookies.set(DASHBOARD_HIDE_ORCID_SYNC_DIALOG_COOKIE, 'hide');
                rerender();
                expect(queryByTestId('dashboard-orcid-linking-dashboard')).not.toBeInTheDocument();
            });
        });

        describe('OrcidSyncContext usage', () => {
            it('should forward expected props', () => {
                let actual;
                jest.spyOn(DashboardAuthorProfileModule, 'default').mockImplementation(() => (
                    <OrcidSyncContext.Consumer>
                        {value => {
                            actual = value;
                            return null;
                        }}
                    </OrcidSyncContext.Consumer>
                ));

                const expected = {
                    author: { aut_id: 123 },
                    accountAuthorSaving: true,
                    accountAuthorError: true,
                    orcidSyncEnabled: true,
                    orcidSyncStatus: {},
                    requestingOrcidSync: true,
                };

                setup(expected);
                expect(actual.orcidSyncProps).toMatchObject({
                    ...expected,
                    requestOrcidSync: expect.any(Function),
                });
            });
        });
    });
});
