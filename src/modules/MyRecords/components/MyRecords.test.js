import React from 'react';
import MyRecords from './MyRecords';
import { pathConfig } from 'config';
import { locale } from 'locale';
import { render, WithMemoryRouter, WithReduxStore, fireEvent, within } from 'test-utils';
import { userIsAdmin } from 'hooks';

jest.mock('../../../hooks', () => ({
    userIsAdmin: jest.fn(() => false),
    userIsResearcher: jest.fn(() => false),
    useRecordsSelector: jest.requireActual('../../../hooks').useRecordsSelector,
}));

function setup(testProps = {}, renderMethod = render) {
    const props = {
        location: {
            pathname: pathConfig.records.mine,
            state: null,
        },
        navigate: testProps.navigate || jest.fn(),
        navigationType: testProps.navigationType || 'PUSH',
        accountLoading: false,
        authorDetails: {},
        exportPublicationsLoading: false,
        localePages: locale.pages.myResearch,
        publicationsListPagingData: {},
        loadingPublicationsList: false,
        publicationsList: [],
        publicationsListFacets: {},
        // publicationsListCustomActions: [],
        ...testProps,
        actions: {
            loadAuthorPublications: jest.fn(),
            setFixRecord: jest.fn(),
            ...(testProps.actions || {}),
        },
    };
    return renderMethod(
        <WithReduxStore>
            <WithMemoryRouter>
                <MyRecords {...props} />
            </WithMemoryRouter>
        </WithReduxStore>,
    );
}

describe('MyRecords test', () => {
    it('renders loading screen while loading account data', () => {
        const { container } = setup({ accountLoading: true });
        expect(container).toMatchSnapshot();
    });

    it('renders loading screen while loading publications ', () => {
        const { container } = setup({ loadingPublicationsList: true });
        expect(container).toMatchSnapshot();
    });

    it('renders loading screen while loading publications while filtering', () => {
        const { container, rerender } = setup({
            publicationsList: [{ rek_pid: 'UQ:1' }, { rek_pid: 'UQ:2' }, { rek_pid: 'UQ:2' }],
        });
        setup(
            {
                loadingPublicationsList: true,
            },
            rerender,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders loading screen while export publications loading', () => {
        const { container } = setup({
            publicationsList: [{ rek_pid: 'UQ:1', rek_title: '1' }],
            exportPublicationsLoading: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('renders loading screen while pub loading', () => {
        const { container } = setup({
            hasPublications: true,
            publicationsList: [],
            loadingPublicationsList: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('renders no results', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('renders list of publications no facets', () => {
        const { container } = setup({
            publicationsList: [{ rek_pid: 'UQ:1', rek_title: '1' }], // myRecordsList.data,
            publicationsListPagingData: { total: 147, per_page: 20, current_page: 1, from: 1, to: 20 },
        });
        expect(container).toMatchSnapshot();
    });
    it('renders list of publications with custom actions', () => {
        const { container } = setup({
            publicationsList: [{ rek_pid: 'UQ:1', rek_title: '1' }],
            publicationsListPagingData: { total: 147, per_page: 20, current_page: 1, from: 1, to: 20 },
            publicationsListCustomActions: [
                {
                    label: 'Test',
                    handleAction: () => {},
                    primary: false,
                },
            ],
        });
        expect(container).toMatchSnapshot();
    });

    it('renders list of publications with facets', () => {
        const loadFn = jest.fn();
        const { container, getByTestId } = setup({
            actions: {
                loadAuthorPublications: loadFn,
            },
            publicationsList: [{ rek_pid: 'UQ:1', rek_title: '1' }], // myRecordsList.data,
            publicationsListPagingData: { total: 147, per_page: 20, current_page: 1, from: 1, to: 20 },
            publicationsListFacets: {
                'Display type': {
                    doc_count_error_upper_bound: 0,
                    sum_other_doc_count: 3,
                    buckets: [
                        { key: 179, doc_count: 95 },
                        { key: 130, doc_count: 34 },
                        {
                            key: 177,
                            doc_count: 2,
                        },
                        { key: 183, doc_count: 2 },
                        { key: 174, doc_count: 1 },
                    ],
                },
                Keywords: {
                    doc_count_error_upper_bound: 0,
                    sum_other_doc_count: 641,
                    buckets: [
                        { key: 'Brca1', doc_count: 15 },
                        {
                            key: 'Oncology',
                            doc_count: 15,
                        },
                        { key: 'Breast cancer', doc_count: 13 },
                        {
                            key: 'Genetics & Heredity',
                            doc_count: 12,
                        },
                        { key: 'Biochemistry & Molecular Biology', doc_count: 10 },
                    ],
                },
            },
        });
        expect(container).toMatchSnapshot();

        expect(loadFn).toBeCalledTimes(1);
        // change facet should make api call
        fireEvent.click(getByTestId('clickable-facet-category-display-type'));
        fireEvent.click(getByTestId('facet-filter-nested-item-display-type-book'));
        expect(loadFn).toBeCalledTimes(2);
    });

    it('should handle larger number of pubs than page size', () => {
        const { getByTestId, getByRole } = setup({
            publicationsList: [
                { rek_pid: 'UQ:1', rek_title: '1' },
                { rek_pid: 'UQ:2', rek_title: '2' },
                { rek_pid: 'UQ:3', rek_title: '3' },
                { rek_pid: 'UQ:4', rek_title: '4' },
                { rek_pid: 'UQ:5', rek_title: '5' },
                { rek_pid: 'UQ:6', rek_title: '6' },
                { rek_pid: 'UQ:7', rek_title: '7' },
                { rek_pid: 'UQ:8', rek_title: '8' },
                { rek_pid: 'UQ:9', rek_title: '9' },
                { rek_pid: 'UQ:10', rek_title: '10' },
                { rek_pid: 'UQ:11', rek_title: '11' },
                { rek_pid: 'UQ:12', rek_title: '12' },
                { rek_pid: 'UQ:13', rek_title: '13' },
                { rek_pid: 'UQ:14', rek_title: '14' },
                { rek_pid: 'UQ:15', rek_title: '15' },
                { rek_pid: 'UQ:16', rek_title: '16' },
                { rek_pid: 'UQ:17', rek_title: '17' },
                { rek_pid: 'UQ:18', rek_title: '18' },
                { rek_pid: 'UQ:19', rek_title: '19' },
                { rek_pid: 'UQ:20', rek_title: '20' },
                { rek_pid: 'UQ:21', rek_title: '21' },
            ],
            publicationsListPagingData: {
                from: 1,
                to: 1,
                total: 21,
                per_page: 1,
                current_page: 1,
            },
        });

        expect(getByTestId('my-records-paging-top')).toBeInTheDocument();
        expect(getByTestId('my-records-paging-bottom')).toBeInTheDocument();
        expect(getByTestId('publication-list-sorting-sort-by')).toBeInTheDocument();

        // change page
        fireEvent.click(getByTestId('my-records-paging-bottom-select-page-3'));

        // change sortby
        let element = getByTestId('publication-list-sorting-sort-by');
        fireEvent.mouseDown(within(element).getByRole('combobox'));
        expect(getByRole('listbox')).not.toEqual(null);

        fireEvent.click(getByRole('option', { name: 'Title' }));
        expect(getByTestId('publication-list-sorting-sort-by')).toHaveTextContent('Title');

        // change page size
        element = getByTestId('publication-list-sorting-page-size');
        fireEvent.mouseDown(within(element).getByRole('combobox'));
        fireEvent.click(getByRole('option', { name: '50' }));
        expect(getByTestId('publication-list-sorting-page-size')).toHaveTextContent('50');
    });

    it('renders active filters', () => {
        const { container } = setup({
            location: { state: { activeFacets: { filters: {}, ranges: { Year: { from: 2000, to: 2010 } } } } },
        });
        expect(container).toMatchSnapshot();
    });

    it('gets publications when user clicks back and state is set', () => {
        const testAction = jest.fn();
        const { container, rerender } = setup({
            accountLoading: true,
            thisUrl: pathConfig.records.mine,
        });

        setup(
            {
                navigationType: 'POP',
                actions: { loadAuthorPublications: testAction },
                location: { pathname: pathConfig.records.mine, state: { page: 2, hasPublications: true } },
            },
            rerender,
        );
        expect(testAction).toBeCalled();
        expect(container).toMatchSnapshot();
    });

    it('gets publications when user clicks back and state is not set', () => {
        const testAction = jest.fn();
        const { container, rerender } = setup({
            accountLoading: true,

            thisUrl: pathConfig.records.mine,
        });
        setup(
            {
                navigationType: 'POP',
                actions: { loadAuthorPublications: testAction },
                location: { pathname: pathConfig.records.mine, state: null },
                loadingPublicationsList: false,
                publicationsList: [],
            },
            rerender,
        );
        expect(testAction).toHaveBeenCalled();
        expect(container).toMatchSnapshot();
    });

    it("doesn't retrieve data from history if user navigates to next page", () => {
        const testAction = jest.fn();
        const { rerender } = setup({ accountLoading: true, actions: { loadAuthorPublications: testAction } });

        setup(
            {
                navigationType: 'PUSH',
                location: { pathname: pathConfig.records.mine },
                mine: {
                    loadingPublicationsList: false,
                    publicationsList: [],
                },
            },
            rerender,
        );
        expect(testAction).not.toHaveBeenCalled();
    });

    it('should handle export publications', () => {
        const exportAuthorPublicationsFn = jest.fn();
        const { getByRole, getByTestId } = setup({
            canUseExport: true,
            actions: {
                exportAuthorPublications: exportAuthorPublicationsFn,
                loadAuthorPublications: jest.fn(),
            },
            publicationsList: [
                { rek_pid: 'UQ:1', rek_title: '1' },
                { rek_pid: 'UQ:2', rek_title: '2' },
                { rek_pid: 'UQ:3', rek_title: '3' },
            ], // myRecordsList.data,
            publicationsListPagingData: { total: 147, per_page: 500, current_page: 1, from: 1, to: 20 },
        });

        expect(getByTestId('export-publications-format')).toBeInTheDocument();
        const element = getByTestId('export-publications-format');
        fireEvent.mouseDown(within(element).getByRole('combobox'));
        expect(getByRole('listbox')).not.toEqual(null);

        fireEvent.click(getByRole('option', { name: 'Excel File' }));
        expect(exportAuthorPublicationsFn).toHaveBeenCalled();
    });

    it('should handle export publications with export page size', () => {
        userIsAdmin.mockImplementation(() => true);
        const exportAuthorPublicationsFn = jest.fn();
        const { getByRole, getByTestId } = setup({
            canUseExport: true,
            actions: {
                exportAuthorPublications: exportAuthorPublicationsFn,
                loadAuthorPublications: jest.fn(),
            },
            publicationsList: [
                { rek_pid: 'UQ:1', rek_title: '1' },
                { rek_pid: 'UQ:2', rek_title: '2' },
                { rek_pid: 'UQ:3', rek_title: '3' },
            ], // myRecordsList.data,
            publicationsListPagingData: { total: 147, per_page: 500, current_page: 1, from: 1, to: 20 },
        });

        // change page size to export page size
        let element = getByTestId('publication-list-sorting-page-size');
        fireEvent.mouseDown(within(element).getByRole('combobox'));
        fireEvent.click(getByRole('option', { name: '1000' }));
        expect(getByTestId('publication-list-sorting-page-size')).toHaveTextContent('1000');

        element = getByTestId('export-publications-format');
        fireEvent.mouseDown(within(element).getByRole('combobox'));
        expect(getByRole('listbox')).not.toEqual(null);

        fireEvent.click(getByRole('option', { name: 'Excel File' }));
        expect(exportAuthorPublicationsFn).toHaveBeenCalled();
    });
});
