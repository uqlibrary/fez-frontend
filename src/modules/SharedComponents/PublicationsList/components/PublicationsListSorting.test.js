import React from 'react';
import PublicationsListSorting, { filterCollectionViewTypes } from './PublicationsListSorting';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';
import { rtlRender, fireEvent, within } from 'test-utils';

jest.mock('../../../../hooks');
import { userIsAdmin } from 'hooks';

function setup(testProps = {}, renderMethod = rtlRender) {
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

    return renderMethod(<PublicationsListSorting {...props} />);
}

describe('PublicationsListSorting component', () => {
    it('renders with empty paging data', () => {
        const data = {
            from: 0,
            to: 0,
            total: 0,
            current_page: 1,
        };
        const { container } = setup({ pagingData: data });
        expect(container).toMatchSnapshot();
    });

    it('renders with non-empty paging data', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
        // expect(wrapper.find('.publicationsListSorting.empty').length).toBe(0);
        // const pages = wrapper.find('SelectField');
        // expect(pages.length).toBe(3);
    });

    it('renders with export dropdown for admin or author', () => {
        const { container } = setup({ canUseExport: true });
        expect(container).toMatchSnapshot();
    });

    it('renders with export dropdown hidden', () => {
        const { container } = setup({ canUseExport: false });
        expect(container).toMatchSnapshot();
    });

    it('renders with all fields disabled', () => {
        const { getByTestId } = setup({ disabled: true });
        expect(within(getByTestId('publication-list-sorting-sort-by')).getByRole('combobox')).toHaveAttribute(
            'aria-disabled',
            'true',
        );
        expect(within(getByTestId('publication-list-sorting-sort-order')).getByRole('combobox')).toHaveAttribute(
            'aria-disabled',
            'true',
        );
        expect(within(getByTestId('publication-list-sorting-page-size')).getByRole('combobox')).toHaveAttribute(
            'aria-disabled',
            'true',
        );
    });

    it('renders with non-empty paging data, pageChanged called', () => {
        const testFn = jest.fn();
        const { getByTestId, getByRole } = setup({ onPageSizeChanged: testFn });
        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-page-size')).getByRole('combobox'));
        fireEvent.click(getByRole('option', { name: '50' }));
        expect(testFn).toBeCalled();
    });

    it('renders with non-empty paging data, orderDirectionsChanged called', () => {
        const testFn = jest.fn();
        const { getByTestId, getByRole } = setup({ onSortByChanged: testFn });
        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-sort-order')).getByRole('combobox'));
        fireEvent.click(getByRole('option', { name: 'Asc' }));
        expect(testFn).toBeCalled();
    });

    it('renders with non-empty paging data, sortByChanged called', () => {
        const testFn = jest.fn();
        const { getByTestId, getByRole } = setup({ onSortByChanged: testFn });
        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-sort-by')).getByRole('combobox'));
        fireEvent.click(getByRole('option', { name: 'Title' }));
        expect(testFn).toBeCalled();
    });

    it('renders with non-empty paging data, onExportPublications called', () => {
        const expected = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const testFn = jest.fn();
        const { getByTestId, getByRole } = setup({ onExportPublications: testFn, canUseExport: true });
        fireEvent.mouseDown(within(getByTestId('export-publications-format')).getByRole('combobox'));
        fireEvent.click(getByRole('option', { name: 'Excel File' }));
        expect(testFn).toHaveBeenCalledWith({ exportPublicationsFormat: expected });
    });

    it('renders dropdown for displayRecordsAs if assigned prop, onDisplayRecordsAsChanged called', () => {
        const testFn = jest.fn();
        const { getByTestId, getByRole } = setup({ onDisplayRecordsAsChanged: testFn, showDisplayAs: true });
        fireEvent.mouseDown(within(getByTestId('publication-list-display-records-as')).getByRole('combobox'));
        fireEvent.click(getByRole('option', { name: 'Standard' }));
        expect(testFn).toBeCalled();
    });

    it('does not render dropdown for displayRecordsAs if not assigned showDisplayAs prop', () => {
        const testFn = jest.fn();
        const { queryByTestId } = setup({ onDisplayRecordsAsChanged: testFn, showDisplayAs: false });
        expect(queryByTestId('publication-list-display-records-as')).not.toBeInTheDocument();
    });

    it('renders bulk export options when applicable', () => {
        userIsAdmin.mockImplementation(() => true);
        const { getByTestId, getByRole } = setup({ canUseExport: true, bulkExportSize: 1000 });
        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-page-size')).getByRole('combobox'));
        expect(getByRole('option', { name: 'Export Only:' })).toBeInTheDocument();
        expect(getByRole('option', { name: '1000' })).toBeInTheDocument();
        userIsAdmin.mockRestore();
    });
    it('renders first item in list when an out of range sortby default is provided', () => {
        const { getByTestId } = setup({
            sortBy: 'test_option',
        });

        expect(getByTestId('publication-list-sorting-sort-by')).toHaveTextContent('Published date');
    });

    it('renders custom item in page size list when initPageLength is provided', () => {
        const { getByTestId } = setup({
            initPageLength: 15,
        });

        expect(getByTestId('publication-list-sorting-page-size')).toHaveTextContent('15');
    });

    it('renders first item in list when pageSize is out of range', () => {
        const { getByTestId } = setup({
            pageSize: 1,
        });

        expect(getByTestId('publication-list-sorting-page-size')).toHaveTextContent('10');
    });

    it('renders first item in list when sort direction is out of range', () => {
        const { getByTestId } = setup({
            sortDirection: 'abc',
        });

        expect(getByTestId('publication-list-sorting-sort-order')).toHaveTextContent('Desc');
    });

    it('updates sortBy, sortDirection and pageSize state when they change after render', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        mockUseEffect.mockImplementation(f => f());
        const { rerender, container } = setup();
        expect(container).toMatchSnapshot();

        setup(
            {
                sortBy: 'score',
                sortDirection: 'Asc',
                pageSize: 50,
                displayRecordsAs: 'image-gallery',
            },
            rerender,
        );

        expect(container).toMatchSnapshot();
        mockUseEffect.mockRestore();
    });

    it('has the correct custom sortby options in the dropdown', () => {
        const { getByTestId, getAllByRole } = setup({
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
        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-sort-by')).getByRole('combobox'));

        // Have the correct amount of elements in dropdown
        expect(getAllByRole('option').length).toEqual(3);
        // Test first and last one
        expect(getAllByRole('option')[0]).toHaveTextContent('Test Sort 1');
        expect(getAllByRole('option')[2]).toHaveTextContent('Test Sort 3');
    });

    it('renders correctly when set to true', () => {
        const data = {
            from: 1,
            to: 10,
            total: 10,
            current_page: 1,
        };
        const { container } = setup({ showDisplayAs: true, canUseExport: true, pagingData: data });
        expect(container).toMatchSnapshot();
    });

    it('renders correctly when set to false', () => {
        const data = {
            from: 0,
            to: 0,
            total: 0,
            current_page: 1,
        };
        const { container } = setup({ showDisplayAs: true, canUseExport: false, pagingData: data });
        expect(container).toMatchSnapshot();
    });

    it('has the correct display type options in the dropdown', () => {
        const { container, getAllByRole, getByTestId } = setup({ showDisplayAs: true });
        expect(container).toMatchSnapshot();
        const selectableCollectionViewType = filterCollectionViewTypes();
        fireEvent.mouseDown(within(getByTestId('publication-list-display-records-as')).getByRole('combobox'));
        expect(getAllByRole('option').length).toEqual(selectableCollectionViewType.length);
        // Have the correct amount of elements in dropdown
        selectableCollectionViewType.forEach((viewType, index) => {
            expect(getAllByRole('option')[index]).toHaveTextContent(viewType.label);
        });
    });
});
