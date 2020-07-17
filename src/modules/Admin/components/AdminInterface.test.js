import React from 'react';
import { AdminInterface, navigateToSearchResult } from './AdminInterface';
import { useRecordContext, useTabbedContext } from 'context';
import { RECORD_TYPE_RECORD } from 'config/general';

import { onSubmit } from '../submitHandler';
jest.mock('../submitHandler', () => ({
    onSubmit: jest.fn(),
}));
jest.mock('../../../context');

jest.mock('redux-form/immutable');
jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

function setup(testProps = {}) {
    const props = {
        createMode: false,
        authorDetails: {
            is_administrator: 1,
            is_super_administrator: 1,
            username: 'test',
        },
        classes: {
            tabIndicator: 'tabindicator',
        },
        submitting: false,
        handleSubmit: jest.fn(),
        history: {
            push: jest.fn(),
        },
        location: {
            search: '',
        },
        tabs: {
            security: {
                activated: true,
                component: () => '<p>Security component</p>',
            },
        },
        destroy: jest.fn(),
        unlockRecord: jest.fn(),
        ...testProps,
    };

    return getElement(AdminInterface, props);
}

describe('AdminInterface component', () => {
    let mockUseEffect;
    const cleanupFns = [];

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
    });

    afterEach(() => {
        useRecordContext.mockReset();
        useTabbedContext.mockReset();
        while (cleanupFns.length > 0) {
            cleanupFns.pop()();
        }
    });

    afterAll(() => {
        mockUseEffect.mockRestore();
    });

    it('should render when no record is available', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({}));
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
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
        const wrapper = setup({
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
        expect(toJson(wrapper)).toMatchSnapshot();
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
        const wrapper = setup({
            createMode: false,
            isDeleted: true,
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
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
        const wrapper = setup({
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
        expect(wrapper.find('LockedAlert').length).toEqual(1);
        expect(toJson(wrapper)).toMatchSnapshot();
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
        const wrapper = setup({
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
        expect(wrapper.find('LockedAlert').length).toEqual(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view as a full form view', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));

        const wrapper = setup({
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
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view as a tabbed form view', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const wrapper = setup({
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
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render activated tabs only', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const wrapper = setup({
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

        expect(wrapper.find('WithStyles(ForwardRef(Tab))')).toHaveLength(4);
        expect(wrapper.find('TabContainer')).toHaveLength(1);
    });

    it('should render full form with activated sections', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));

        const wrapper = setup({
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

        expect(wrapper.find('WithStyles(Tab)')).toHaveLength(0);
        expect(wrapper.find('TabContainer')).toHaveLength(3);
    });

    it('should render security tab from query string params by default', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const wrapper = setup({
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
            location: {
                search: '?tab=security',
            },
        });

        expect(wrapper.find('WithStyles(ForwardRef(Tab))')).toHaveLength(5);
        expect(wrapper.find('TabContainer').props().currentTab).toBe('security');
    });

    it('should render alert message for retracted records', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_display_type_lookup: 'Journal Article',
                fez_record_search_key_retracted: {
                    rek_retracted: 1,
                },
                rek_display_type: 179,
            },
        }));
        const wrapper = setup({
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });
        expect(toJson(wrapper.find('WithStyles(Alert)'))).toMatchSnapshot();
    });

    it('should display badges on tabs for erroring fields', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const wrapper = setup({
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

        expect(toJson(wrapper.find('WithStyles(Tab)'))).toMatchSnapshot();
    });

    it('should switch the tab', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const wrapper = setup({
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
            location: {
                search: '?tab=security',
            },
        });

        expect(wrapper.find('TabContainer').props().currentTab).toBe('security');

        wrapper
            .find('WithStyles(ForwardRef(Tabs))')
            .props()
            .onChange({}, 'files');

        expect(wrapper.find('TabContainer').props().currentTab).toBe('files');
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
        const wrapper = setup({});
        expect(wrapper.find('TabContainer').props().currentTab).toBe('security');
    });

    it('should disabled button and render alert for form submitting', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        const wrapper = setup({
            submitting: true,
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display successful alert', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: true }));
        const wrapper = setup({
            submitSucceeded: true,
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('WithStyles(ConfirmDialogBox)')
            .props()
            .onAction();
        expect(toJson(wrapper)).toMatchSnapshot();
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

        const wrapper = setup({
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });
        // prettier-ignore
        expect(toJson(wrapper))
            .toMatchSnapshot();
    });

    it('should display an alert if editing of a pubtype is not supported', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_display_type: 999,
            },
        }));
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should navigate to "My research" after saving a record edit without referral and choosing "Edit another record"', () => {
        const pushFn = jest.fn();
        const createMode = false;
        const authorDetails = {};
        const history = {
            push: pushFn,
        };
        const location = {
            hash: '',
            pathname: '/admin/edit/UQ:123456',
            search: '',
        };
        navigateToSearchResult(createMode, authorDetails, history, location);
        expect(pushFn).toHaveBeenCalledWith('/records/mine');
    });

    it('should navigate to navigatedFrom after saving a record edit with referral as an admin and choosing "Edit another record"', () => {
        const pushFn = jest.fn();
        const createMode = false;
        const authorDetails = {
            is_administrator: 1,
        };
        const history = {
            push: pushFn,
        };
        const location = {
            hash: '#/admin/edit/UQ:123456?navigatedFrom=%2Fdashboard',
            search: '',
        };
        navigateToSearchResult(createMode, authorDetails, history, location);
        expect(pushFn).toHaveBeenCalledWith('/dashboard');
    });

    it('should navigate to admin add after saving a new record as an admin', () => {
        const pushFn = jest.fn();
        const history = {
            push: pushFn,
        };
        navigateToSearchResult(true, null, history);
        expect(pushFn).toHaveBeenCalledWith('/admin/add');
    });

    it('should call method through reference', () => {
        const mockUseRef = jest.spyOn(React, 'useRef');
        const testFn = jest.fn();
        mockUseRef.mockImplementation(() => ({
            current: {
                showConfirmation: testFn,
            },
        }));
        const mockUseCallback = jest.spyOn(React, 'useCallback');
        mockUseCallback.mockImplementationOnce(f => f());
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({}));

        setup({
            submitSucceeded: true,
        });
        expect(testFn).toHaveBeenCalledTimes(1);
        expect(mockUseCallback).toHaveBeenCalledTimes(1);

        mockUseRef.mockRestore();
        mockUseCallback.mockRestore();
    });

    it('should call method to handle cancel of the form', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_editing_user: 'noone',
            },
        }));
        const push = jest.fn();

        const wrapper = setup({
            history: {
                push,
            },
        });
        wrapper
            .find('WithStyles(ForwardRef(Button))')
            .get(0)
            .props.onClick({
                preventDefault: jest.fn(),
            });
        expect(push).toHaveBeenCalledWith('/');
        push.mockClear();

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_pid: 'UQ:111111',
                rek_editing_user: 'noone',
            },
        }));
        const wrapper2 = setup({
            history: {
                push,
            },
        });
        wrapper2
            .find('WithStyles(ForwardRef(Button))')
            .get(0)
            .props.onClick({
                preventDefault: jest.fn(),
            });
        expect(push).toHaveBeenCalledWith('/view/UQ:111111');
    });

    it('should handle cancel action of submit confirmation', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
                rek_pid: 'UQ:111111',
            },
        }));
        const push = jest.fn();

        const wrapper = setup({
            history: {
                push,
            },
        });
        wrapper
            .find('WithStyles(ConfirmDialogBox)')
            .props()
            .onCancelAction();
        expect(push).toHaveBeenCalledWith('/view/UQ:111111');
        push.mockClear();

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: 187,
                rek_object_type_lookup: RECORD_TYPE_RECORD,
            },
        }));
        const wrapper2 = setup({
            history: {
                push,
            },
        });
        wrapper2
            .find('WithStyles(ConfirmDialogBox)')
            .props()
            .onCancelAction();
        expect(push).toHaveBeenCalledTimes(0);
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
        const wrapper = setup({
            handleSubmit,
            tabs: {
                bibliographic: {
                    activated: true,
                    component: () => 'BibliographySectionComponent',
                },
            },
        });
        expect(wrapper.find('#admin-work-unpublish').length).toEqual(1);
        wrapper.find('#admin-work-unpublish').simulate('click');

        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should render publish button for unpublished record', () => {
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
        const wrapper = setup({ tabs });
        expect(wrapper.find('#admin-work-publish').length).toEqual(1);
        useRecordContext.mockReset();

        useRecordContext.mockImplementation(() => ({
            record: {
                ...record,
                rek_status: 3,
            },
        }));
        const wrapper2 = setup({ tabs });
        expect(wrapper2.find('#admin-work-publish').length).toEqual(1);
    });
});
