import React from 'react';
import { AdminInterface, navigateToSearchResult } from './AdminInterface';
import { useAccountContext, useRecordContext, useTabbedContext } from 'context';
import * as UseIsUserSuperAdmin from 'hooks/useIsUserSuperAdmin';
import { RECORD_TYPE_RECORD } from 'config/general';

import { onSubmit } from '../submitHandler';
import * as redux from 'react-redux';
import { render, WithReduxStore, WithRouter, fireEvent, within, act } from 'test-utils';

jest.mock('../submitHandler', () => ({
    onSubmit: jest.fn(),
}));
jest.mock('../../../context');

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
jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
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
        createMode: false,
        authorDetails: {
            is_administrator: 1,
            is_super_administrator: 1,
            username: 'test',
        },
        submitting: false,
        handleSubmit: jest.fn(),
        tabs: {
            security: {
                activated: true,
                component: () => '<p>Security component</p>',
            },
        },
        unlockRecord: jest.fn(),
        error: null,
        ...testProps,
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <AdminInterface {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('AdminInterface component', () => {
    let mockUseEffect;
    const cleanupFns = [];
    const useDispatchMock = redux.useDispatch;

    beforeAll(() => {
        mockUseEffect = jest.spyOn(React, 'useEffect');
    });
    beforeEach(() => {
        mockUseEffect.mockImplementation(f => {
            const hookReturn = f();
            if (typeof hookReturn === 'function') {
                cleanupFns.push(hookReturn);
            }
        });
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_display_type_lookup: 'Journal Article',
                rek_display_type: 179,
            },
        }));
        useAccountContext.mockImplementation(() => ({
            account: {
                id: 's2222222',
            },
        }));
        useDispatchMock.mockImplementation(() => () => {});
        mockUseLocation = { pathname: '/', search: '' };
    });

    afterEach(() => {
        useRecordContext.mockReset();
        useTabbedContext.mockReset();
        while (cleanupFns.length > 0) {
            cleanupFns.pop()();
        }
        useDispatchMock.mockRestore();
        mockUseNavigate.mockClear();
    });

    afterAll(() => {
        mockUseEffect.mockRestore();
    });

    it('should render when no record is available', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({}));
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render in create mode', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_subtype: undefined,
            },
        }));
        const { container } = setup({
            createMode: true,
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
                files: {
                    activated: true,
                    component: () => 'FilesSectionComponent',
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render undelete title and button', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_subtype: undefined,
            },
        }));
        const { container } = setup({
            createMode: false,
            isDeleted: true,
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render locked alert in edit mode', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_subtype: undefined,
                rek_editing_user: 'uqtest',
                rek_status: 2,
            },
        }));
        const { container, getByTestId } = setup({
            authorDetails: {
                username: 'uqstaff',
            },
            createMode: false,
            locked: true,
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
                files: {
                    activated: true,
                    component: () => 'FilesSectionComponent',
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
            },
        });

        expect(getByTestId('alert-error')).toHaveTextContent(
            'THIS WORK IS LOCKED - ' +
                'This work is currently being edited by undefined (uqtest). Make sure that you confirm with this user before ignoring the work lock as it may cause work overwrite issues.',
        );
        expect(container).toMatchSnapshot();
    });

    it('should render locked info alert', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_subtype: undefined,
                rek_editing_user: 'uqstaff',
                rek_status: 3,
            },
        }));
        const { container, getByTestId } = setup({
            createMode: false,
            locked: true,
            authorDetails: {
                username: 'uqstaff',
            },
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
                files: {
                    activated: true,
                    component: () => 'FilesSectionComponent',
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
            },
        });
        expect(getByTestId('alert-error')).toHaveTextContent(
            'THIS WORK IS LOCKED - ' +
                'This work is currently being edited by undefined (uqstaff). Make sure that you confirm with this user before ignoring the work lock as it may cause work overwrite issues.',
        );
        expect(container).toMatchSnapshot();
    });

    it('should render default view as a full form view', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));

        const { container } = setup({
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
                files: {
                    activated: true,
                    component: () => 'FilesSectionComponent',
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render default view as a tabbed form view', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const { container } = setup({
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
                files: {
                    activated: false,
                    component: () => 'FilesSectionComponent',
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render activated tabs only', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const { getByRole } = setup({
            tabs: {
                admin: {
                    activated: true,
                    component: () => 'AdminSectionComponent',
                },
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
                files: {
                    activated: false,
                    component: () => 'FilesSectionComponent',
                },
                identifiers: {
                    activated: true,
                    component: () => 'IdentifiersSectionComponent',
                },
            },
        });

        expect(getByRole('tablist')).toBeInTheDocument();
        expect(within(getByRole('tablist')).getAllByRole('tab')).toHaveLength(4);
    });

    it('should render full form with activated sections', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));

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
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
                files: {
                    activated: true,
                    component: () => 'FilesSectionComponent',
                },
                identifiers: {
                    activated: false,
                    component: () => 'IdentifiersSectionComponent',
                },
            },
        });

        expect(queryByRole('tablist')).not.toBeInTheDocument();
        expect(queryByTestId('bibliographic-section')).toBeInTheDocument();
        expect(queryByTestId('security-section')).toBeInTheDocument();
        expect(queryByTestId('files-section')).toBeInTheDocument();
        expect(queryByTestId('identifiers-section')).not.toBeInTheDocument();
        expect(queryByTestId('admin-section')).not.toBeInTheDocument();
    });

    it('should render security tab from query string params by default', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        mockUseLocation.search = '?tab=security';

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
                files: {
                    activated: true,
                    component: () => 'FilesSectionComponent',
                },
                identifiers: {
                    activated: true,
                    component: () => 'IdentifiersSectionComponent',
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
            },
        });

        expect(getByTestId('security-tab').getAttribute('aria-selected')).toBe('true');
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
                createMode: true,
                tabs: {
                    bibliographic: {
                        activated: true,
                        component: () => 'BibliographySectionComponent',
                    },
                    files: {
                        activated: true,
                        component: () => 'FilesSectionComponent',
                    },
                    security: {
                        activated: true,
                        component: () => 'SecuritySectionComponent',
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
        expect(getByRole('tab', { name: 'Bibliographic' })).toHaveAttribute('aria-selected', 'false');
        expect(getByRole('tab', { name: 'Files' })).toHaveAttribute('aria-selected', 'true');

        act(() => {
            map.keydown({ key: 'ArrowLeft', ctrlKey: true });
        });

        expect(getByRole('tab', { name: 'Bibliographic' })).toHaveAttribute('aria-selected', 'true');
        expect(getByRole('tab', { name: 'Files' })).toHaveAttribute('aria-selected', 'false');
    });

    it('should render alert message for retracted records', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_display_type_lookup: 'Journal Article',
                rek_status: 7,
                rek_display_type: 179,
            },
        }));
        const { getByTestId } = setup({
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });

        expect(getByTestId('alert')).toHaveTextContent('This work has been retracted');
    });

    it('should display badges on tabs for erroring fields', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const { getByTestId } = setup({
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                    numberOfErrors: 1,
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                    numberOfErrors: 3,
                },
            },
        });

        expect(getByTestId('bibliographic-tab')).toHaveTextContent(/1/);
        expect(getByTestId('security-tab')).toHaveTextContent(/3/);
    });

    it('should switch the tab', () => {
        mockUseLocation.search = '?tab=security';
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

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
                files: {
                    activated: true,
                    component: () => 'FilesSectionComponent',
                },
                identifiers: {
                    activated: true,
                    component: () => 'IdentifiersSectionComponent',
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
            },
        });

        expect(getByTestId('security-tab').getAttribute('aria-selected')).toBe('true');
        fireEvent.click(getByTestId('files-tab'));
        expect(getByTestId('files-tab').getAttribute('aria-selected')).toBe('true');
        expect(getByTestId('security-tab').getAttribute('aria-selected')).toBe('false');
    });

    it('should default to security tab for non-record objects', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'Test',
                rek_object_type_lookup: 'Collection',
                rek_display_type: 9,
                rek_display_type_lookup: 'Collection',
            },
        }));
        const { getByTestId } = setup({});
        expect(getByTestId('security-tab').getAttribute('aria-selected')).toBe('true');
    });

    it('should disabled button and render alert for form submitting', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        const { container } = setup({
            submitting: true,
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should display successful alert', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        const { container, getByTestId, rerender } = setup({
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });

        expect(container).toMatchSnapshot();

        // should show the confirmation dialog
        setup(
            {
                submitSucceeded: true,
                tabs: {
                    bibliographic: {
                        activated: true,
                        component: () => 'BibliographySectionComponent',
                    },
                },
            },
            rerender,
        );
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(container).toMatchSnapshot();
    });

    it('should display job created alert', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        const { container, getByTestId, rerender } = setup({
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });
        expect(container).toMatchSnapshot();

        // should show the confirmation dialog
        setup(
            {
                isJobCreated: true,
                submitSucceeded: true,
                tabs: {
                    bibliographic: {
                        activated: true,
                        component: () => 'BibliographySectionComponent',
                    },
                },
            },
            rerender,
        );

        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(container).toMatchSnapshot();
    });

    it('should render a title with html correctly', () => {
        const rekTitle =
            'Cost analysis: outsourcing radiofrequency ablution for massiv<sub>e</sub>&nbsp;' +
            'renal m<sup>a</sup>sses&nbsp;™&nbsp;♦';
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: rekTitle,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_display_type_lookup: 'Journal Article',
                rek_display_type: 179,
            },
        }));
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));

        const { container } = setup({
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('should display an alert if editing of a pubtype is not supported', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_display_type: 999,
            },
        }));
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should navigate to "My research" after saving a record edit without referral and choosing "Edit another record"', () => {
        const createMode = false;
        const authorDetails = {};
        const location = {
            hash: '',
            pathname: '/admin/edit/UQ:123456',
            search: '',
        };
        navigateToSearchResult(createMode, authorDetails, mockUseNavigate, location);
        expect(mockUseNavigate).toHaveBeenCalledWith('/records/mine');
    });

    it('should navigate to navigatedFrom after saving a record edit with referral as an admin and choosing "Edit another record"', () => {
        const createMode = false;
        const authorDetails = {
            is_administrator: 1,
        };
        const location = {
            hash: '#/admin/edit/UQ:123456?navigatedFrom=%2Fdashboard',
            search: '',
        };
        navigateToSearchResult(createMode, authorDetails, mockUseNavigate, location);
        expect(mockUseNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should navigate to admin add after saving a new record as an admin', () => {
        navigateToSearchResult(true, null, mockUseNavigate);
        expect(mockUseNavigate).toHaveBeenCalledWith('/admin/add');
    });

    it('should call method to show submit confirmation', () => {
        const mockUseRef = jest.spyOn(React, 'useRef');
        const testFn = jest.fn();
        mockUseRef.mockImplementation(() => ({
            current: {
                showConfirmation: testFn,
            },
        }));
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({}));

        setup({
            submitSucceeded: true,
        });
        expect(testFn).toHaveBeenCalledTimes(1);

        mockUseRef.mockRestore();
    });

    it('should call method to handle cancel of the form for new record', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_editing_user: 'noone',
            },
        }));

        const { getByTestId } = setup();

        fireEvent.click(getByTestId('admin-work-cancel-top'));
        expect(mockUseNavigate).toHaveBeenCalledWith('/');
    });

    it('should call method to handle cancel of the form for existing record', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_pid: 'UQ:111111',
                rek_editing_user: 'noone',
            },
        }));
        const { getByTestId } = setup();

        fireEvent.click(getByTestId('admin-work-cancel-top'));
        expect(mockUseNavigate).toHaveBeenCalledWith('/view/UQ:111111');
    });

    it('should handle cancel action of submit confirmation for new record', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
            },
        }));

        const { getByTestId, rerender } = setup();

        setup(
            {
                submitSucceeded: true,
            },
            rerender,
        );

        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUseNavigate).toHaveBeenCalledTimes(0);
    });

    it('should handle cancel action of submit confirmation for existing record', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_pid: 'UQ:111111',
            },
        }));

        const { getByTestId, rerender } = setup();

        setup(
            {
                submitSucceeded: true,
            },
            rerender,
        );
        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUseNavigate).toHaveBeenCalledWith('/view/UQ:111111');
    });

    it('should render unpublish button for published record', () => {
        onSubmit.mockImplementation(() => {});
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_status: 2,
                rek_title: 'This is test record',
                rek_object_type_lookup: 'Record',
                rek_display_type_lookup: 'Journal Article',
                rek_display_type: 179,
            },
        }));
        const handleSubmit = jest.fn(f => f({ setIn: jest.fn() }));
        const { getByTestId } = setup({
            handleSubmit,
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });

        fireEvent.click(getByTestId('unpublish-admin-top'));
        expect(handleSubmit).toHaveBeenCalledTimes(2);
        expect(onSubmit).toHaveBeenCalledTimes(2);

        fireEvent.click(getByTestId('unpublish-admin'));
        expect(handleSubmit).toHaveBeenCalledTimes(2);
        expect(onSubmit).toHaveBeenCalledTimes(2);
    });

    it('should render publish button for unpublished record (status = 1)', () => {
        const record = {
            rek_pid: 'UQ:123456',
            rek_status: 1,
            rek_title: 'This is test record',
            rek_object_type_lookup: 'Record',
            rek_display_type_lookup: 'Journal Article',
            rek_display_type: 179,
        };
        const tabs = {
            bibliographic: {
                activated: true,
                component: () => 'BibliographySectionComponent',
            },
        };

        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({ record }));
        const { getByTestId } = setup({ tabs });
        expect(getByTestId('publish-admin-top')).toBeInTheDocument();
        expect(getByTestId('publish-admin')).toBeInTheDocument();
    });

    it('should render publish button for unpublished record (status = 3)', () => {
        const record = {
            rek_pid: 'UQ:123456',
            rek_status: 3,
            rek_title: 'This is test record',
            rek_object_type_lookup: 'Record',
            rek_display_type_lookup: 'Journal Article',
            rek_display_type: 179,
        };
        const tabs = {
            bibliographic: {
                activated: true,
                component: () => 'BibliographySectionComponent',
            },
        };

        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({ record }));
        const { getByTestId } = setup({ tabs });
        expect(getByTestId('publish-admin')).toBeInTheDocument();
    });

    it('should render retract button for super admin user', () => {
        const useIsUserSuperAdmin = jest.spyOn(UseIsUserSuperAdmin, 'useIsUserSuperAdmin');
        useIsUserSuperAdmin.mockImplementation(() => true);

        onSubmit.mockImplementation(() => {});
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_status: 2,
                rek_title: 'This is test record',
                rek_object_type_lookup: 'Record',
                rek_display_type_lookup: 'Journal Article',
                rek_display_type: 179,
            },
        }));
        const handleSubmit = jest.fn(f => f({ setIn: jest.fn() }));
        const { getByTestId } = setup({
            handleSubmit,
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });

        fireEvent.click(getByTestId('retract-admin-top'));
        expect(handleSubmit).toHaveBeenCalled();
        expect(onSubmit).toHaveBeenCalled();
    });

    it('should render error', () => {
        const useIsUserSuperAdmin = jest.spyOn(UseIsUserSuperAdmin, 'useIsUserSuperAdmin');
        useIsUserSuperAdmin.mockImplementationOnce(() => true);
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));

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
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));

        const error = 'Title is required';
        const { getByTestId } = setup({
            handleSubmit: jest.fn(f => f({ setIn: jest.fn() })),
            formErrors: { bibliographicSection: { rek_title: error } },
            error: { message: 'error' },
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });

        expect(getByTestId('alert')).toHaveTextContent(/Title is required/);
    });
});
