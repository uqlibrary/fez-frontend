import React from 'react';
import SearchComponent from './SearchComponent';
import { fireEvent, rtlRender, within } from 'test-utils';

jest.mock('config/general', () => ({
    ...jest.requireActual('config/general'),
    MAX_PUBLIC_SEARCH_TEXT_LENGTH: 20,
}));

function setup(testProps = {}, renderMethod = rtlRender) {
    const props = {
        searchQueryParams: {},

        showSearchButton: false,
        showMobileSearchButton: false,
        showAdvancedSearchButton: false,
        showPrefixIcon: false,

        isInHeader: testProps.isInHeader || false,
        isAdvancedSearch: testProps.isAdvancedSearch || false,
        isAdvancedSearchMinimised: testProps.isAdvancedSearchMinimised || false,
        isOpenAccessInAdvancedMode: testProps.isOpenAccessInAdvancedMode || false,
        isAdmin: false,
        isUnpublishedBufferPage: false,

        history: {
            push: jest.fn(),
        },
        location: {
            pathname: '',
        },
        ...testProps,
    };

    return renderMethod(<SearchComponent {...props} />);
}

describe('SearchComponent', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render in advanced search and take in consideration isOpenAccessInAdvancedMode changes', () => {
        const { container, rerender } = setup({
            isAdvancedSearch: true,
        });

        setup(
            {
                isAdvancedSearch: true,
                isOpenAccessInAdvancedMode: true,
            },
            rerender,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render with a class "header" for use in AppBar', () => {
        const { container } = setup({ isInHeader: true });
        expect(container).toMatchSnapshot();
    });

    it('should render default view with advanced search', () => {
        const { container } = setup({ isAdvancedSearch: true });
        expect(container).toMatchSnapshot();
    });

    it('should render simple search even if it says is advanced, if in header', () => {
        const { container } = setup({ isAdvancedSearch: true, isInHeader: true });
        expect(container).toMatchSnapshot();
    });

    it('should toggle search to minimised view of advanced search', () => {
        const { container, rerender } = setup();
        expect(container).toMatchSnapshot();
        setup(
            {
                searchQueryParams: {
                    all: 'i feel very lucky',
                },
                isAdvancedSearch: true,
                isAdvancedSearchMinimised: true,
                isOpenAccessInAdvancedMode: false,
            },
            rerender,
        );
        expect(container).toMatchSnapshot();
    });

    it('should minimise advanced search in mobile context', () => {
        const props = {
            history: {
                push: jest.fn(),
            },
            isMobile: true,
            isAdvancedSearch: true,
        };

        const { getByRole, rerender } = setup(props);
        setup({ ...props, isAdvancedSearchMinimised: true }, rerender);
        expect(getByRole('button', { name: 'Show advanced search' })).toBeInTheDocument();
    });

    it('should display simple search with query string', () => {
        const { container, rerender } = setup();
        expect(container).toMatchSnapshot();
        setup(
            {
                searchQueryParams: {
                    all: 'i feel very lucky',
                },
                isAdvancedSearch: false,
                isAdvancedSearchMinimised: false,
                isOpenAccessInAdvancedMode: false,
            },
            rerender,
        );
        expect(container).toMatchSnapshot();
    });

    it('should submit search for given search query params', () => {
        const testHistoryPushMethod = jest.fn();
        const { getByRole } = setup({
            history: { push: testHistoryPushMethod },
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            searchQueryParams: {
                all: 'i feel lucky',
            },
            activeFacets: {
                filters: {},
                ranges: {},
            },
        });

        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));

        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'searchQueryParams%5Ball%5D=i+feel+lucky&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
        });
    });

    it('should update search query params', () => {
        const testHistoryPushMethod = jest.fn();
        const { getByRole, rerender } = setup({
            history: { push: testHistoryPushMethod },
            searchQueryParams: {
                all: 'previous search',
            },
        });

        setup(
            {
                history: { push: testHistoryPushMethod },
                isAdvancedSearch: true,
                searchQueryParams: {
                    all: 'second search',
                },
            },
            rerender,
        );

        setup(
            {
                history: { push: testHistoryPushMethod },
                searchQueryParams: {
                    all: 'third search',
                },
            },
            rerender,
        );

        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));

        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'searchQueryParams%5Ball%5D=third+search&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
        });
    });

    it('should not search is searchQuery is empty', () => {
        const testFn = jest.fn();
        const { getByRole } = setup();
        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));
        expect(testFn).not.toBeCalled();
    });

    it('should handle advanced search', () => {
        const testHistoryPushMethod = jest.fn();
        const { getByTestId, getByRole, getByText } = setup({
            history: { push: testHistoryPushMethod },
            isAdmin: true,
            isUnpublishedBufferPage: true,
            isAdvancedSearch: true,
            searchQueryParams: {
                all: {
                    value: 'i feel lucky',
                },
                rek_title: {
                    value: 'global warming',
                },
            },
            activeFacets: {
                filters: {},
                ranges: {
                    'Year published': { from: null, to: null },
                },
            },
            isOpenAccessInAdvancedMode: true,
        });

        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));
        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/admin/unpublished',
            search:
                'page=1&pageSize=20&sortBy=score&sortDirection=Desc&activeFacets%5BshowOpenAccessOnly%5D=true' +
                '&searchQueryParams%5Ball%5D%5Bvalue%5D=i+feel+lucky&searchQueryParams%5Ball%5D%5Blabel%5D=' +
                '&searchQueryParams%5Brek_title%5D%5Bvalue%5D=global+warming' +
                '&searchQueryParams%5Brek_title%5D%5Blabel%5D=&searchMode=advanced',
        });

        // add on status
        fireEvent.click(getByTestId('advanced-search-row-add'));
        fireEvent.mouseDown(getByText('Select a field'));
        fireEvent.click(getByRole('option', { name: 'Status' }));
        fireEvent.mouseDown(getByText('Select a status'));
        fireEvent.click(getByRole('option', { name: 'In Review' }));

        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));
        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/admin/unpublished',
            search:
                'page=1&pageSize=20&sortBy=score&sortDirection=Desc&activeFacets%5BshowOpenAccessOnly%5D=true' +
                '&searchQueryParams%5Ball%5D%5Bvalue%5D=i+feel+lucky&searchQueryParams%5Ball%5D%5Blabel%5D=' +
                '&searchQueryParams%5Brek_title%5D%5Bvalue%5D=global+warming' +
                '&searchQueryParams%5Brek_title%5D%5Blabel%5D=&searchQueryParams%5Brek_status%5D%5Bvalue%5D=5' +
                '&searchQueryParams%5Brek_status%5D%5Blabel%5D=&searchMode=advanced',
        });
    });

    it(
        'should handle advanced search in unpublished page with year range, rek_status, ' +
            'rek_created_date and rek_updated_date key set for an admin',
        () => {
            const testHistoryPushMethod = jest.fn();
            const { getByRole } = setup({
                history: { push: testHistoryPushMethod },
                isAdmin: true,
                isUnpublishedBufferPage: true,
                isAdvancedSearch: true,
                page: 1,
                pageSize: 20,
                sortBy: 'score',
                sortDirection: 'Desc',
                searchQueryParams: {
                    all: {
                        value: 'i feel lucky',
                    },
                    rek_title: {
                        value: 'global warming',
                    },
                    rek_status: {
                        value: '7',
                    },
                    rek_created_date: {
                        label: '[31/12/1979 to 01/01/1985]',
                        value: '[1979-12-31T14:00:00Z TO 1985-01-01T23:59:59Z]',
                    },
                    rek_updated_date: {
                        label: '[31/12/1981 to 01/01/1985]',
                        value: '[1981-12-31T14:00:00Z TO 1985-01-01T23:59:59Z]',
                    },
                },
                activeFacets: {
                    filters: {},
                    ranges: {
                        'Created date': '[1979-12-31T14:00:00Z TO 1985-01-01T23:59:59Z]',
                        'Updated date': '[1981-12-31T14:00:00Z TO 1985-01-01T23:59:59Z]',
                        'Year published': { from: 2000, to: 2008 },
                    },
                },
            });

            fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));
            expect(testHistoryPushMethod).toHaveBeenCalledWith({
                pathname: '/admin/unpublished',
                search:
                    'page=1&pageSize=20&sortBy=score&sortDirection=Desc&activeFacets%5Branges%5D%5BCreated+date%5D=%5B1979-12-30T14%3A00%3A00Z+TO+1985-01-01T13%3A59%3A59Z%5D&activeFacets%5Branges%5D%5BUpdated+date%5D=%5B1981-12-30T14%3A00%3A00Z+TO+1985-01-01T13%3A59%3A59Z%5D&activeFacets%5Branges%5D%5BYear+published%5D%5Bfrom%5D=2000&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D=2008&searchQueryParams%5Ball%5D%5Bvalue%5D=i+feel+lucky&searchQueryParams%5Ball%5D%5Blabel%5D=&searchQueryParams%5Brek_title%5D%5Bvalue%5D=global+warming&searchQueryParams%5Brek_title%5D%5Blabel%5D=&searchQueryParams%5Brek_status%5D%5Bvalue%5D=7&searchQueryParams%5Brek_status%5D%5Blabel%5D=&searchQueryParams%5Brek_created_date%5D%5Bvalue%5D=%5B1979-12-30T14%3A00%3A00Z+TO+1985-01-01T13%3A59%3A59Z%5D&searchQueryParams%5Brek_created_date%5D%5Blabel%5D=%5B30%2F12%2F1979+to+01%2F01%2F1985%5D&searchQueryParams%5Brek_updated_date%5D%5Bvalue%5D=%5B1981-12-30T14%3A00%3A00Z+TO+1985-01-01T13%3A59%3A59Z%5D&searchQueryParams%5Brek_updated_date%5D%5Blabel%5D=%5B30%2F12%2F1981+to+01%2F01%2F1985%5D&searchMode=advanced',
            });
        },
    );

    it('should handle advanced search with work type', () => {
        const testHistoryPushMethod = jest.fn();
        const { getByRole } = setup({
            history: { push: testHistoryPushMethod },
            isAdvancedSearch: true,
            searchQueryParams: {
                rek_display_type: ['371'],
            },
        });

        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));
        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search:
                'page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Brek_display_type%5D%5B%5D=371&searchMode=advanced',
        });
    });

    it('should handle simple search', () => {
        const testHistoryPushMethod = jest.fn();
        const { getByRole, getByTestId } = setup({
            history: { push: testHistoryPushMethod },
        });

        fireEvent.change(getByTestId('simple-search-input'), { target: { value: 'i feel lucky' } });
        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));
        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'searchQueryParams%5Ball%5D=i+feel+lucky&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
        });
    });

    it('should show a snackbar error for input being too long', () => {
        const { getByTestId, getByRole } = setup({ searchQueryParams: { all: 'i feel very very lucky' } });
        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));
        expect(getByTestId('simple-search-helper-text')).toHaveTextContent('Must be 20 characters or less');
    });

    it('should toggle advanced search to minimised view', () => {
        const { container, getByTestId } = setup({ isAdvancedSearch: true });
        fireEvent.click(getByTestId('minimize-advanced-search'));
        expect(container).toMatchSnapshot();
    });

    it('should toggle to advanced search', () => {
        const { container, getByRole } = setup();
        fireEvent.click(getByRole('button', { name: 'Click to switch to Advanced search' }));
        expect(container).toMatchSnapshot();
    });

    it('should toggle open access for advanced search', () => {
        const { container, getByTestId } = setup({ isAdvancedSearch: true });
        fireEvent.click(getByTestId('advanced-search-open-access'));
        expect(container).toMatchSnapshot();
    });

    it('should toggle to simple search', () => {
        const { container, getByRole } = setup({ isAdvancedSearch: true });
        fireEvent.click(getByRole('button', { name: 'Click to return to the simple search' }));
        expect(container).toMatchSnapshot();
    });

    it('should add and remove one row for advanced search', () => {
        const { queryByText, getByTestId } = setup({
            searchQueryParams: {
                all: 'i feel lucky',
            },
            isAdvancedSearch: true,
        });
        fireEvent.click(getByTestId('advanced-search-row-add'));
        expect(queryByText('Please select a field to search')).toBeInTheDocument();
        fireEvent.click(getByTestId('delete-advanced-search-row-1'));
        expect(queryByText('Please select a field to search')).not.toBeInTheDocument();
    });

    it('should update advanced search row on search text changed', () => {
        const { container, getByTestId } = setup({
            searchQueryParams: {
                all: { value: 'i feel lucky', label: '' },
            },
            isAdvancedSearch: true,
        });

        fireEvent.change(getByTestId('any-field-input'), { target: { value: 'I feel more lucky' } });
        expect(container).toMatchSnapshot();
    });

    it('should reset advanced search', () => {
        const { container, getByTestId } = setup({
            searchQueryParams: {
                all: { value: 'i feel lucky', label: '' },
                rek_title: { value: 'global warming', label: '' },
            },
            activeFacets: { filters: {}, ranges: {} },
            isAdvancedSearch: true,
            isOpenAccessInAdvancedMode: true,
        });

        fireEvent.click(getByTestId('advanced-search-reset'));
        expect(container).toMatchSnapshot();
    });

    it('should update doc type values', () => {
        const { getByTestId, getByRole } = setup({ isAdvancedSearch: true });
        fireEvent.mouseDown(within(getByTestId('document-type-selector')).getByRole('combobox'));
        fireEvent.click(getByRole('option', { name: 'Design' }));
        fireEvent.click(getByRole('option', { name: 'Data Collection' }));
        expect(getByTestId('rek-display-type-caption')).toHaveTextContent(
            'Work typeis one ofDesign or Data Collection',
        );
    });

    it('should update year range filter', () => {
        const { getByTestId } = setup({ isAdvancedSearch: true });
        fireEvent.change(getByTestId('from'), { target: { value: 2000 } });
        fireEvent.change(getByTestId('to'), { target: { value: 2003 } });
        expect(getByTestId('facet-year-range-caption')).toHaveTextContent('Publishedbetween2000 to 2003');
    });

    it('should update date range filter', () => {
        const { getByTestId, container } = setup({
            isAdvancedSearch: true,
            isAdmin: true,
            isUnpublishedBufferPage: true,
        });
        fireEvent.change(getByTestId('created-range-from-date'), { target: { value: '01/01/2000' } });
        fireEvent.change(getByTestId('created-range-to-date'), { target: { value: '01/01/2001' } });
        expect(container).toMatchSnapshot();

        fireEvent.change(getByTestId('created-range-to-date'), { target: { value: '01/01/2005' } });
        expect(container).toMatchSnapshot();
    });

    it('search component should display validation message for PID input', () => {
        const { getByTestId, getByText, queryByTestId } = setup({ history: {} });

        fireEvent.click(getByTestId('show-advanced-search'));
        fireEvent.mouseDown(getByTestId('field-type-select'));
        fireEvent.click(getByText('PID'));

        const invalidPIDs = ['abcd', '_uq:123', 'UQ: 12', 'uq:'];

        invalidPIDs.forEach(invalidInput => {
            fireEvent.change(getByTestId('rek-pid-input'), { target: { value: '' } });
            fireEvent.change(getByTestId('rek-pid-input'), { target: { value: invalidInput } });
            expect(getByText('Please provide a valid PID (e.g. UQ:129af6)')).toBeInTheDocument();
            expect(getByTestId('advanced-search')).toHaveAttribute('disabled');
        });

        fireEvent.change(getByTestId('rek-pid-input'), { target: { value: '' } });
        fireEvent.change(getByTestId('rek-pid-input'), { target: { value: 'UQ:123' } });

        expect(queryByTestId('rek-pid-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('advanced-search')).not.toHaveAttribute('disabled');
    });

    describe('getFieldRowsFromSearchQuery', () => {
        it('should process empty search query', () => {
            const { container } = setup({
                isAdmin: false,
                isUnpublishedBufferPage: true,
                searchQueryParams: {
                    rek_status: '',
                    rek_updated_date: '',
                },
            });
            expect(container).toMatchSnapshot();
        });

        it('should process missing label', () => {
            const { container } = setup({
                isAdmin: true,
                isUnpublishedBufferPage: true,
                searchQueryParams: {
                    rek_created_date: {
                        value: '[1979-12-31T14:00:00Z TO 1985-01-01T23:59:59Z]',
                    },
                },
            });
            expect(container).toMatchSnapshot();
        });
    });
});
