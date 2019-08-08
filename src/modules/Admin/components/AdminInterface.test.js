import { AdminInterface } from './AdminInterface';

jest.mock('../../../context');
import { useTabbedContext, useRecordContext } from 'context';

jest.mock('redux-form/immutable');
jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

jest.mock('query-string', () => ({
    parse: jest.fn(() => ({
        tab: 'security',
    })),
}));
import queryString from 'query-string';

function setup(testProps = {}) {
    const props = {
        classes: {
            tabIndicator: 'tabindicator',
        },
        submitting: false,
        handleSubmit: jest.fn(),
        location: {
            search: '',
        },
        tabs: {
            security: {
                activated: true,
                component: () => '<p>Security component</p>',
            },
        },
        ...testProps,
    };

    return getElement(AdminInterface, props);
}

describe('AdminInterface component', () => {
    it('should render default view as a full form view', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: 'Record',
                rek_display_type_lookup: 'Journal Article',
            },
        }));

        useTabbedContext.mockImplementation(() => ({ tabbed: false }));

        const wrapper = setup({
            tabs: {
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
                files: {
                    activated: true,
                    component: () => 'FilesSectionComponent',
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view as a tabbed form view', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: 'Record',
                rek_display_type_lookup: 'Journal Article',
            },
        }));

        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const wrapper = setup({
            tabs: {
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
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render activated tabs only', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: 'Record',
                rek_display_type_lookup: 'Journal Article',
            },
        }));

        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const wrapper = setup({
            tabs: {
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
                admin: {
                    activated: true,
                    component: () => 'AdminSectionComponent',
                },
            },
        });

        expect(wrapper.find('WithStyles(Tab)')).toHaveLength(3);
        expect(wrapper.find('TabContainer')).toHaveLength(1);
    });

    it('should render full form with activated sections', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: 'Record',
                rek_display_type_lookup: 'Journal Article',
            },
        }));

        useTabbedContext.mockImplementation(() => ({ tabbed: false }));

        const wrapper = setup({
            tabs: {
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
                admin: {
                    activated: false,
                    component: () => 'AdminSectionComponent',
                },
            },
        });

        expect(wrapper.find('WithStyles(Tab)')).toHaveLength(0);
        expect(wrapper.find('TabContainer')).toHaveLength(2);
    });

    it('should render security tab from query string params by default', () => {
        queryString.parse = jest.fn(() => ({
            tab: 'security',
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: 'Record',
                rek_display_type_lookup: 'Journal Article',
            },
        }));

        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const wrapper = setup({
            tabs: {
                files: {
                    activated: true,
                    component: () => 'FilesSectionComponent',
                },
                identifiers: {
                    activated: true,
                    component: () => 'IdentifiersSectionComponent',
                },
                admin: {
                    activated: true,
                    component: () => 'AdminSectionComponent',
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
            },
        });

        expect(wrapper.find('WithStyles(Tab)')).toHaveLength(4);
        expect(wrapper.find('TabContainer').props().currentTab).toBe('security');
    });

    it('should switch the tab', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: 'Record',
                rek_display_type_lookup: 'Journal Article',
            },
        }));

        useTabbedContext.mockImplementation(() => ({ tabbed: true }));

        const wrapper = setup({
            tabs: {
                files: {
                    activated: true,
                    component: () => 'FilesSectionComponent',
                },
                identifiers: {
                    activated: true,
                    component: () => 'IdentifiersSectionComponent',
                },
                admin: {
                    activated: true,
                    component: () => 'AdminSectionComponent',
                },
                security: {
                    activated: true,
                    component: () => 'SecuritySectionComponent',
                },
            },
        });

        expect(wrapper.find('TabContainer').props().currentTab).toBe('security');

        wrapper
            .find('WithStyles(Tabs)')
            .props()
            .onChange({}, 'files');

        expect(wrapper.find('TabContainer').props().currentTab).toBe('files');
    });

    it('should disabled button and render alert for form submitting', () => {
        const wrapper = setup({ submitting: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display successful alert', () => {
        const wrapper = setup({
            submitSucceeded: true,
            history: {
                go: jest.fn(),
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('ConfirmDialogBox')
            .props()
            .onAction();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
