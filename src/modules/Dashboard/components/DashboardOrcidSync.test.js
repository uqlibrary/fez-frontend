import { render, waitElementToBeInDocument, WithReduxStore, WithRouter } from 'test-utils';
import DashboardOrcidSyncContainer, {
    openUrl,
    DashboardOrcidSync,
    getOnSyncPreferenceChangeHandler,
} from './DashboardOrcidSync';
import { pathConfig } from '../../../config';
import React, { useState } from 'react';
import * as actions from '../../../actions/actionTypes';
import { debounce } from 'throttle-debounce';
import { updateCurrentAuthor } from '../../../actions';

const setIsSyncEnabledMock = jest.fn();
jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useState: jest.fn(),
    };
});

jest.mock('throttle-debounce', () => {
    return {
        ...jest.requireActual('throttle-debounce'),
        debounce: jest.fn(),
    };
});

jest.mock('actions', () => {
    return {
        ...jest.requireActual('actions'),
        updateCurrentAuthor: jest.fn(),
    };
});

const defaultAuthor = {
    aut_id: 123,
    aut_orcid_id: '0000-1111-1111-1111',
    aut_orcid_works_last_sync: '2020-02-14 16:23:30',
    aut_is_orcid_sync_enabled: 1,
};

function setup(
    testProps = {},
    route = pathConfig.dashboard,
    routeInitialEntries = [pathConfig.dashboard],
    rerender = render,
) {
    const props = {
        ...testProps,
        author: {
            ...defaultAuthor,
            ...(testProps?.author || {}),
        },
    };

    return rerender(
        <WithReduxStore>
            <WithRouter route={route} initialEntries={routeInitialEntries}>
                <DashboardOrcidSync {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('DashboardOrcidSync', () => {
    beforeEach(() => {
        useState.mockImplementation(initialState => [initialState, setIsSyncEnabledMock]);
    });
    afterEach(() => jest.resetAllMocks());

    describe('Container', () => {
        it('should render properly', () => {
            const { container } = render(
                <WithReduxStore>
                    <WithRouter>
                        <DashboardOrcidSyncContainer author={{ aut_orcid_works_last_sync: '2020-02-14 16:23:30' }} />
                    </WithRouter>
                </WithReduxStore>,
            );
            expect(container).toMatchSnapshot();
        });
    });

    describe('Component', () => {
        it('should render properly when sync is disabled', () => {
            const { container } = setup({
                author: { aut_orcid_works_last_sync: null, aut_is_orcid_sync_enabled: 0 },
            });
            expect(container).toMatchSnapshot();
        });

        it('should render properly when sync is enabled', () => {
            const { container } = setup({});
            expect(container).toMatchSnapshot();
        });

        it('should render properly', () => {
            const { container } = setup({});
            expect(container).toMatchSnapshot();
        });

        it('should render Pending status', () => {
            const { container } = setup({
                orcidSyncStatus: {
                    orj_status: 'Pending',
                },
            });
            expect(container).toMatchSnapshot();
        });

        it('should render Done status', () => {
            const { container } = setup({
                orcidSyncStatus: {
                    orj_status: 'Done',
                },
            });
            expect(container).toMatchSnapshot();
        });

        it('should render Error status', () => {
            const { container } = setup({
                orcidSyncStatus: {
                    orj_status: 'Error',
                },
            });
            expect(container).toMatchSnapshot();
        });

        it('should update local state variable isSyncEnabled when author sync preferences change', async () => {
            const { rerender } = setup({ author: { aut_is_orcid_sync_enabled: 0 } });
            expect(setIsSyncEnabledMock).toHaveBeenCalledWith(false);
            setup({ author: { aut_is_orcid_sync_enabled: 1 } }, pathConfig.dashboard, [pathConfig.dashboard], rerender);
            expect(setIsSyncEnabledMock).toHaveBeenCalledWith(true);
        });

        it('should display confirmation dialog when route state variable `showOrcidLinkingConfirmation` is set to true', async () => {
            // `showOrcidLinkingConfirmation` is set to true upon the Orcid linking - see Orcid component
            setup({}, '/', [{ path: pathConfig.dashboard, state: { showOrcidLinkingConfirmation: true } }]);
            await waitElementToBeInDocument('orcid-sync-confirmation-message');
        });

        it('should display display progress icon next to orcid badge upon saving orcid sync preferences', async () => {
            setup({ accountAuthorSaving: true });
            await waitElementToBeInDocument('dashboard-orcid-sync-progress-icon');
        });

        it('should display display error icon next to orcid badge upon failing to save orcid sync preferences', async () => {
            setup({ accountAuthorError: true });
            await waitElementToBeInDocument('dashboard-orcid-sync-error-icon');
        });

        describe('openUrl', () => {
            it('should return function that calls window.open', () => {
                const testOpen = jest.spyOn(window, 'open');
                testOpen.mockImplementation(() => {});
                const url = 'https://www.uq.edu.au/';
                openUrl(url)();
                expect(testOpen).toHaveBeenCalledWith(url, '_blank');
            });
        });

        describe('getOnSyncPreferenceChangeHandler', () => {
            it('should bail when sync preferences already reflects the given value', () => {
                const setIsSyncEnabledMock = jest.fn();

                getOnSyncPreferenceChangeHandler(defaultAuthor, false)(true);

                expect(setIsSyncEnabledMock).not.toHaveBeenCalled();
            });

            it('should bail when sync preferences is being saved', () => {
                const setIsSyncEnabledMock = jest.fn();

                getOnSyncPreferenceChangeHandler(defaultAuthor, true)(true);

                expect(setIsSyncEnabledMock).not.toHaveBeenCalled();
            });

            it('should update local state and dispatch actions when sync preferences are being updated', () => {
                const setIsSyncEnabledMock = jest.fn();
                const dispatchMock = jest.fn();
                const hideDrawerMock = jest.fn();

                getOnSyncPreferenceChangeHandler(
                    defaultAuthor,
                    false,
                    setIsSyncEnabledMock,
                    dispatchMock,
                    hideDrawerMock,
                )(false);

                expect(setIsSyncEnabledMock).toHaveBeenCalledWith(false);
                expect(dispatchMock).toHaveBeenCalledWith({ type: actions.CURRENT_AUTHOR_SAVING });
                expect(hideDrawerMock).toHaveBeenCalled();
                expect(debounce).toHaveBeenCalledWith(3000, expect.any(Function));

                const [, debouncedFn] = debounce.mock.calls[0];
                debouncedFn();

                expect(updateCurrentAuthor).toHaveBeenCalledWith(defaultAuthor.aut_id, {
                    ...defaultAuthor,
                    aut_is_orcid_sync_enabled: 0,
                });
            });
        });
    });
});
