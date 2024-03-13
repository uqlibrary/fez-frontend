import React from 'react';
import { JournalAdminInterface, navigateToSearchResult } from './JournalAdminInterface';
import { useAccountContext, useJournalContext, useTabbedContext } from 'context';
import * as UseIsUserSuperAdmin from 'hooks/useIsUserSuperAdmin';
import { journalDoaj } from 'mock/data';

import * as redux from 'react-redux';
import { render, WithReduxStore, WithRouter, fireEvent, within, act } from 'test-utils';

jest.mock('../submitHandler', () => ({
    onSubmit: jest.fn(),
}));
jest.mock('../../../context');

jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    destroy: jest.fn(),
    Field: props => {
        return (
            <field
                is="mock"
                name={props.name}
                title={props.title}
                required={props.required}
                disabled={props.disabled}
                label={props.label || props.floatingLabelText}
                hasError={props.hasError}
            />
        );
    },
}));

const mockUseNavigate = jest.fn();
let mockUseLocation = {};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useLocation: () => mockUseLocation,
}));

function setup(testProps = {}, renderMethod = render) {
    const props = {
        authorDetails: {
            is_administrator: 1,
            is_super_administrator: 1,
            username: 'test',
        },
        submitting: false,
        handleSubmit: jest.fn(),
        tabs: {
            admin: {
                activated: true,
                component: () => 'AdminSectionComponent',
            },
            bibliographic: {
                activated: true,
                component: () => 'BibliographySectionComponent',
            },
        },
        unlockJournal: jest.fn(),
        locked: false,
        error: null,
        ...testProps,
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <JournalAdminInterface {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('JournalAdminInterface component', () => {
    const useDispatchMock = redux.useDispatch;

    beforeEach(() => {
        useAccountContext.mockImplementation(() => ({
            account: {
                id: 's2222222',
            },
        }));
        useJournalContext.mockImplementation(() => ({
            journalDetails: journalDoaj.data,
        }));
        useDispatchMock.mockImplementation(() => () => {});
        mockUseLocation = { pathname: '/', search: '' };
    });

    afterEach(() => {
        useAccountContext.mockReset();
        useJournalContext.mockReset();
        useDispatchMock.mockRestore();
        mockUseNavigate.mockClear();
    });

    describe('full form', () => {
        beforeEach(() => {
            useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        });
        afterEach(() => {
            useTabbedContext.mockReset();
        });

        it('should render when no record is available', () => {
            const { getByTestId, getByText, queryByRole } = setup({});
            expect(getByText('Edit journal - Advanced Nonlinear Studies')).toBeInTheDocument();
            expect(queryByRole('tablist')).not.toBeInTheDocument();
            expect(getByTestId('admin-section-header')).toHaveTextContent('Admin');
            expect(getByTestId('bibliographic-section-header')).toHaveTextContent('Bibliographic');
            expect(getByTestId('admin-work-cancel-top')).toBeInTheDocument();
            expect(getByTestId('admin-work-cancel')).toBeInTheDocument();
            expect(getByTestId('submit-admin-top')).toBeInTheDocument();
            expect(getByTestId('submit-admin')).toBeInTheDocument();
        });

        it('should render full form with activated sections', () => {
            const { queryByTestId, queryByRole } = setup({
                tabs: {
                    admin: {
                        activated: false,
                        component: () => 'AdminSectionComponent',
                    },
                    bibliographic: {
                        activated: true,
                        component: () => 'BibliographySectionComponent',
                    },
                },
            });

            expect(queryByRole('tablist')).not.toBeInTheDocument();
            expect(queryByTestId('bibliographic-section')).toBeInTheDocument();
            expect(queryByTestId('admin-section')).not.toBeInTheDocument();
        });

        it('should call method to show submit confirmation', () => {
            const handleSubmitFn = jest.fn();
            const { getByTestId } = setup({ handleSubmit: handleSubmitFn });

            fireEvent.click(getByTestId('submit-admin'));
            expect(handleSubmitFn).toHaveBeenCalled();
        });
        it('should call method to handle cancel of the form for existing record', () => {
            const { getByTestId } = setup();

            fireEvent.click(getByTestId('admin-work-cancel-top'));
            expect(mockUseNavigate).toHaveBeenCalledWith('/journal/view/12');
        });
        it('should call method to handle cancel of the form for existing record and navigate to previous url', () => {
            mockUseLocation.search = '?navigatedFrom=%2Fjournal%2Fview%2F13';
            const { getByTestId } = setup();

            fireEvent.click(getByTestId('admin-work-cancel-top'));
            expect(mockUseNavigate).toHaveBeenCalledWith('/journal/view/13');
        });

        it('should handle cancel action of submit confirmation for existing record', () => {
            const { getByTestId, rerender } = setup();

            setup(
                {
                    submitSucceeded: true,
                },
                rerender,
            );

            fireEvent.click(getByTestId('cancel-dialog-box'));
            expect(mockUseNavigate).toHaveBeenCalledWith('/journal/view/12');
        });

        it('should render error', () => {
            const useIsUserSuperAdmin = jest.spyOn(UseIsUserSuperAdmin, 'useIsUserSuperAdmin');
            useIsUserSuperAdmin.mockImplementationOnce(() => true);

            const { getByTestId } = setup({
                handleSubmit: jest.fn(f => f({ setIn: jest.fn() })),
                error: { message: 'error' },
                tabs: {
                    bibliographic: {
                        activated: true,
                        component: () => 'BibliographySectionComponent',
                    },
                },
            });

            expect(getByTestId('alert')).toHaveTextContent(
                'Error - Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later',
            );
        });

        it('should prioritize formErrors', () => {
            const useIsUserSuperAdmin = jest.spyOn(UseIsUserSuperAdmin, 'useIsUserSuperAdmin');
            useIsUserSuperAdmin.mockImplementationOnce(() => true);

            const error = 'Title is required';
            const { getByTestId } = setup({
                handleSubmit: jest.fn(f => f({ setIn: jest.fn() })),
                formErrors: { adminSection: { jnl_title: error } },
                error: { message: 'error' },
                tabs: {
                    admin: {
                        activated: true,
                        component: () => 'AdminSectionComponent',
                    },
                },
            });

            expect(getByTestId('alert')).toHaveTextContent(/Journal title is required/);
        });
    });

    describe('tabbed', () => {
        beforeEach(() => {
            useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        });

        it('should render locked info alert', () => {
            useJournalContext.mockImplementation(() => ({
                journalDetails: {
                    jnl_jid: 12,
                    jnl_editing_user: 'uqstaff',
                    jnl_editing_user_lookup: 'Test User',
                },
            }));
            const { getByTestId } = setup({
                locked: true,
                authorDetails: {
                    username: 'uqstaff',
                },
                tabs: {
                    admin: {
                        activated: true,
                        component: () => 'AdminSectionComponent',
                    },
                    bibliographic: {
                        activated: true,
                        component: () => 'BibliographySectionComponent',
                    },
                },
            });
            expect(getByTestId('alert-error')).toHaveTextContent(
                'THIS WORK IS LOCKED - ' +
                    'This work is currently being edited by Test User (uqstaff). Make sure that you confirm with this user before ignoring the work lock as it may cause work overwrite issues.',
            );
        });

        it('should disabled button and render alert for form submitting', () => {
            const { getByTestId } = setup({
                submitting: true,
                authorDetails: {
                    username: 'uqstaff',
                },
                tabs: {
                    admin: {
                        activated: true,
                        component: () => 'AdminSectionComponent',
                    },
                    bibliographic: {
                        activated: true,
                        component: () => 'BibliographySectionComponent',
                    },
                },
            });
            expect(getByTestId('alert-info')).toHaveTextContent('Saving - Request is being processed.');
            expect(getByTestId('submit-admin-top')).toHaveAttribute('disabled');
            expect(getByTestId('submit-admin')).toHaveAttribute('disabled');
        });

        it('should display successful alert', () => {
            const { getByTestId, getByRole, rerender } = setup({
                authorDetails: {
                    username: 'uqstaff',
                },
                tabs: {
                    admin: {
                        activated: true,
                        component: () => 'AdminSectionComponent',
                    },
                    bibliographic: {
                        activated: true,
                        component: () => 'BibliographySectionComponent',
                    },
                },
            });

            // should show the confirmation dialog
            setup(
                {
                    submitSucceeded: true,
                    authorDetails: {
                        username: 'uqstaff',
                    },
                    tabs: {
                        admin: {
                            activated: true,
                            component: () => 'AdminSectionComponent',
                        },
                        bibliographic: {
                            activated: true,
                            component: () => 'BibliographySectionComponent',
                        },
                    },
                },
                rerender,
            );
            fireEvent.click(getByTestId('confirm-dialog-box'));
            expect(getByRole('dialog')).toHaveTextContent('Work has been updated');
        });

        it('should render activated tabs only', () => {
            const { getByRole } = setup({
                tabs: {
                    admin: {
                        activated: true,
                        component: () => 'AdminSectionComponent',
                    },
                    bibliographic: {
                        activated: false,
                        component: () => 'BibliographySectionComponent',
                    },
                },
            });

            expect(getByRole('tablist')).toBeInTheDocument();
            expect(within(getByRole('tablist')).getAllByRole('tab')).toHaveLength(1);
        });

        it('should switch the tab', () => {
            const { getByTestId } = setup({
                tabs: {
                    admin: {
                        activated: true,
                        component: () => 'AdminSectionComponent',
                    },
                    bibliographic: {
                        activated: true,
                        component: () => 'BibliographySectionComponent',
                    },
                },
                location: {
                    search: '?tab=admin',
                },
            });

            expect(getByTestId('admin-tab').getAttribute('aria-selected')).toBe('true');
            fireEvent.click(getByTestId('bibliographic-tab'));
            expect(getByTestId('bibliographic-tab').getAttribute('aria-selected')).toBe('true');
            expect(getByTestId('admin-tab').getAttribute('aria-selected')).toBe('false');
        });
    });

    it('should respond to keyboard shortcuts', () => {
        const toggleTabbed = jest.fn();
        useTabbedContext.mockImplementation(() => ({
            tabbed: false,
            toggleTabbed,
        }));

        const map = {};
        window.addEventListener = jest.fn((event, cb) => {
            map[event] = cb;
        });

        const createWrapper = () =>
            setup({
                tabs: {
                    admin: {
                        activated: true,
                        component: () => 'AdminSectionComponent',
                    },
                    bibliographic: {
                        activated: true,
                        component: () => 'BibliographySectionComponent',
                    },
                },
            });

        createWrapper();
        expect(toggleTabbed).toHaveBeenCalledTimes(0);
        map.keydown({ key: 'ArrowUp', ctrlKey: true });
        expect(toggleTabbed).toHaveBeenCalledTimes(1);
        toggleTabbed.mockClear();

        useTabbedContext.mockImplementation(() => ({
            tabbed: true,
            toggleTabbed,
        }));

        const { getByRole } = createWrapper();
        map.keydown({ key: 'ArrowDown', ctrlKey: true });
        expect(toggleTabbed).toHaveBeenCalledTimes(1);

        act(() => {
            map.keydown({ key: 'ArrowRight', ctrlKey: true });
        });
        expect(getByRole('tab', { name: 'Admin' })).toHaveAttribute('aria-selected', 'false');
        expect(getByRole('tab', { name: 'Bibliographic' })).toHaveAttribute('aria-selected', 'true');

        // createWrapper();

        act(() => {
            map.keydown({ key: 'ArrowLeft', ctrlKey: true });
        });
        expect(getByRole('tab', { name: 'Admin' })).toHaveAttribute('aria-selected', 'true');
        expect(getByRole('tab', { name: 'Bibliographic' })).toHaveAttribute('aria-selected', 'false');
    });

    it('should render a title with html correctly', () => {
        const jnlTitle =
            'Cost analysis: outsourcing radiofrequency ablution for massiv<sub>e</sub>&nbsp;' +
            'renal m<sup>a</sup>sses&nbsp;™&nbsp;♦';
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                jnl_jid: 12,
                jnl_title: jnlTitle,
            },
        }));
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));

        setup({
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });

        expect(document.querySelector('h2 sub')).toHaveTextContent('e');
        expect(document.querySelector('h2 sup')).toHaveTextContent('a');
    });
    it('should navigate to journal search page when choosing "Edit another record"', () => {
        const authorDetails = {};
        navigateToSearchResult(authorDetails, mockUseNavigate);
        expect(mockUseNavigate).toHaveBeenCalledWith('/journals/search/');
    });

    describe('coverage', () => {
        beforeEach(() => {
            useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        });
        afterEach(() => {
            useTabbedContext.mockReset();
        });
        it('should return an empty div if no journal provided', () => {
            useJournalContext.mockImplementationOnce(() => ({
                journalDetails: null,
            }));
            setup({});
            expect(document.querySelector('div.empty')).toBeInTheDocument();
        });
    });
});
