import React from 'react';
import PublicationsListSorting from './PublicationsListSorting';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

jest.mock('../../../../hooks');
import { userIsAdmin } from 'hooks';

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

describe('PublicationsListSorting component', () => {
    it('renders with empty paging data', () => {
        const data = {
            from: 0,
            to: 0,
            total: 0,
            current_page: 1,
        };
        const wrapper = setup({ pagingData: data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with non-empty paging data', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('.publicationsListSorting.empty').length).toBe(0);
        // const pages = wrapper.find('SelectField');
        // expect(pages.length).toBe(3);
    });

    it('renders with export dropdown for admin or author', () => {
        const wrapper = setup({ canUseExport: true });
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('ExportPublications').length).toBe(1);
    });

    it('renders with export dropdown hidden', () => {
        const wrapper = setup({ canUseExport: false });
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('ExportPublications').length).toBe(0);
    });

    it('renders with all fields disabled', () => {
        const wrapper = setup({ disabled: true });
        wrapper.find('Select').forEach(option => {
            expect(option.props().disabled).toEqual(true);
        });
    });

    it('renders with non-empty paging data, pageChanged called', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onPageSizeChanged: testFn });
        wrapper
            .find('#pageSize')
            .props()
            .onChange({ target: { value: 50 } });
        expect(testFn).toBeCalled();
    });

    it('renders with non-empty paging data, orderDirectionsChanged called', () => {
        const testFn = jest.fn();
        const testValue = 'test';
        const wrapper = setup({ onSortByChanged: testFn });
        wrapper
            .find('#sortOrder')
            .props()
            .onChange({ target: { value: testValue } });
        expect(testFn).toBeCalled();
    });

    it('renders with non-empty paging data, sortByChanged called', () => {
        const testFn = jest.fn();
        const testValue = 'test';
        const wrapper = setup({ onSortByChanged: testFn });
        wrapper
            .find('#sortBy')
            .props()
            .onChange({ target: { value: testValue } });
        expect(testFn).toBeCalled();
    });

    it('renders with non-empty paging data, onExportPublications called', () => {
        const expected = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const testFn = jest.fn();
        const wrapper = setup({ onExportPublications: testFn, canUseExport: true });
        wrapper
            .find('ExportPublications')
            .props()
            .onChange(expected);
        expect(testFn).toHaveBeenCalledWith({ exportPublicationsFormat: expected });
    });

    it('renders with non-empty paging data, displayRecordsAs called', () => {
        const testFn = jest.fn();
        const testValue = 'test';
        const wrapper = setup({ onDisplayRecordsAsChanged: testFn });
        wrapper
            .find('#displayRecordsAs')
            .props()
            .onChange({ target: { value: testValue } });
        expect(testFn).toBeCalled();
    });

    it('renders will set state on receiving new props', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        const wrapper = setup({
            initPageLength: 5,
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        mockUseEffect.mockImplementation(f => f());
        wrapper.setProps({
            sortBy: 'Publication date',
            sortDirection: 'test',
            pageSize: 5,
            displayRecordsAs: 'standard',
            pagingData: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        mockUseEffect.mockRestore();
    });

    it('renders bulk export options when applicable', () => {
        userIsAdmin.mockImplementation(() => true);
        const wrapper = setup({ canUseExport: true, bulkExportSize: 1000 });
        expect(wrapper.find('[data-testid="search-export-size-entry-1000"]').text()).toBe('1000');
        userIsAdmin.mockRestore();
    });
    it('renders first item in list when an out of range sortby default is provided', () => {
        const wrapper = setup({
            sortBy: 'test_option',
        });

        expect(wrapper.find('#sortBy').props().value).toEqual('published_date');
    });

    it('renders custom item in page size list when initPageLength is provided', () => {
        const wrapper = setup({
            initPageLength: 15,
        });

        expect(wrapper.find('#pageSize').props().value).toEqual(15);
    });

    it('renders first item in list when pageSize is out of range', () => {
        const wrapper = setup({
            pageSize: 1,
        });

        expect(wrapper.find('#pageSize').props().value).toEqual(5); // 5 was inserted in a previous test
    });

    it('updates sortBy, sortDirection and pageSize state when they change after render', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();

        mockUseEffect.mockImplementation(f => f());
        wrapper.setProps({
            sortBy: 'score',
            sortDirection: 'Asc',
            pageSize: 50,
            displayRecordsAs: 'image-gallery',
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        mockUseEffect.mockRestore();
    });

    it('has the correct custom sortby options in the dropdown', () => {
        const wrapper = setup({
            sortingData: {
                sortBy: [
                    { value: 'test_1', label: 'Test Sort 1' },
                    { value: 'test_2', label: 'Test Sort 2' },
                    { value: 'test_3', label: 'Test Sort 3' },
                ],
            },
            sortDirection: 'Asc',
            sortBy: 'test_2',
        });
        // Have the correct amount of elements in dropdown
        expect(wrapper.find('#sortBy').children().length).toEqual(3);
        // Test first and last one
        expect(
            wrapper
                .find('#sortBy')
                .childAt(0)
                .props().value,
        ).toEqual('test_1');
        expect(
            wrapper
                .find('#sortBy')
                .childAt(2)
                .props().value,
        ).toEqual('test_3');
    });
});
