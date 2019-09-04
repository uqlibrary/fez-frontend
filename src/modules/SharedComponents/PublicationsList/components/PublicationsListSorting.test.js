import { PublicationsListSorting } from './PublicationsListSorting';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

function setup(testProps = {}) {
    const props = {
        classes: {},
        pagingData: {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        },
        canUseExport: false,
        location: {},
        disabled: false,
        activeFacets: { filters: {}, ranges: {} },
        onPageSizeChanged: jest.fn(),
        onSortByChanged: jest.fn(),
        onExportPublications: jest.fn(),
        ...testProps,
    };

    return getElement(PublicationsListSorting, props);
}

describe('PublicationsListSorting renders ', () => {
    it('component with empty paging data', () => {
        const data = {
            from: 0,
            to: 0,
            total: 0,
            current_page: 1,
        };
        const wrapper = setup({ pagingData: data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with non-empty paging data', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('.publicationsListSorting.empty').length).toBe(0);
        // const pages = wrapper.find('SelectField');
        // expect(pages.length).toBe(3);
    });

    it('component with export dropdown for admin or author', () => {
        const wrapper = setup({ canUseExport: true });
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('ExportPublications').length).toBe(1);
    });

    it('component with export dropdown hidden', () => {
        const wrapper = setup({ canUseExport: false });
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('ExportPublications').length).toBe(0);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ disabled: true });
        wrapper.find('Select').forEach(option => {
            expect(option.props().disabled).toEqual(true);
        });
    });

    it('component with non-empty paging data, pageChanged called', () => {
        const testFunction = jest.fn();
        const testValue = 1000;
        const wrapper = setup({ onPageSizeChanged: testFunction });
        wrapper.instance().pageSizeChanged({ target: { value: testValue } });
        expect(wrapper.state().pageSize).toEqual(testValue);
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, orderDirectionsChanged called', () => {
        const testFunction = jest.fn();
        const testValue = 'test';
        const wrapper = setup({ onSortByChanged: testFunction });
        wrapper.instance().orderDirectionsChanged({ target: { value: testValue } });
        expect(wrapper.state().sortDirection).toEqual(testValue);
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, sortByChanged called', () => {
        const testFunction = jest.fn();
        const testValue = 'test';
        const wrapper = setup({ onSortByChanged: testFunction });
        wrapper.instance().sortByChanged({ target: { value: testValue } });
        expect(wrapper.state().sortBy).toEqual(testValue);
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, onExportPublications called', () => {
        const expected = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const testFunction = jest.fn();
        const wrapper = setup({ onExportPublications: testFunction });
        wrapper.instance().exportPublicationsFormatChanged(expected);
        expect(wrapper.state().exportPublicationsFormat).toEqual(expected);
        expect(testFunction).toHaveBeenCalledWith({ exportPublicationsFormat: expected });
    });

    it('component will set state on receiving new props', () => {
        const wrapper = setup({
            initPageLength: 5,
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({
            sortBy: 'Publication date',
            sortDirection: 'test',
            pageSize: 5,
            pagingData: {},
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
