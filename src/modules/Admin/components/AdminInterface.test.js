import { AdminInterface } from './AdminInterface';
import { useRecordContext, useTabbedContext } from 'context';

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
        },
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
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: 'Record',
                rek_display_type_lookup: 'Journal Article',
                rek_display_type: 179,
            },
        }));
    });

    afterEach(() => {
        useRecordContext.mockReset();
        useTabbedContext.mockReset();
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
                rek_object_type_lookup: 'record',
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

        expect(wrapper.find('WithStyles(Tab)')).toHaveLength(4);
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

        expect(wrapper.find('WithStyles(Tab)')).toHaveLength(5);
        expect(wrapper.find('TabContainer').props().currentTab).toBe('security');
    });

    it('should render alert message for retracted records', () => {
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_object_type_lookup: 'Record',
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
            .find('WithStyles(Tabs)')
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
            history: {
                go: jest.fn(),
                push: jest.fn(),
            },
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
                rek_object_type_lookup: 'Record',
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
                rek_object_type_lookup: 'record',
                rek_display_type: 999,
            },
        }));
        useTabbedContext.mockImplementation(() => ({ tabbed: false }));
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
