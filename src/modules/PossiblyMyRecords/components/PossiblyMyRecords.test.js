import React from 'react';
import PossiblyMyRecords from './PossiblyMyRecords';
import { pathConfig } from 'config';
import { render, WithReduxStore, WithRouter, fireEvent, within } from 'test-utils';

function setup(testProps = {}, renderMethod = render) {
    const props = {
        possiblePublicationsList: testProps.possiblePublicationsList || [],
        possiblePublicationsFacets: testProps.possiblePublicationsFacets || {},
        possibleCounts: testProps.possibleCounts || 0,
        loadingPossiblePublicationsList: testProps.loadingPossiblePublicationsList || false,
        loadingPossibleCounts: testProps.loadingPossibleCounts || false,
        hidePublicationLoading: testProps.hidePublicationLoading || false,
        accountLoading: testProps.accountLoading || false,
        actions: {
            searchPossiblyYourPublications: jest.fn(),
            setClaimPublication: jest.fn(),
            hideRecordErrorReset: jest.fn(),
        },
        location: {
            pathname: pathConfig.records.possible,
            state: null,
        },
        navigate: testProps.navigate || jest.fn(),
        navigationType: testProps.navigationType || 'PUSH',
        ...testProps,
    };
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <PossiblyMyRecords {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component PossiblyMyRecords', () => {
    it('renders nothing while account is loading', () => {
        const { container } = setup({ accountLoading: true });
        expect(container).toMatchSnapshot();
    });

    it('renders no results', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('renders loading component while loading publication data', () => {
        const { container } = setup({ loadingPossiblePublicationsList: true, loadingPossibleCounts: false });
        expect(container).toMatchSnapshot();
    });

    it('renders loading screen while loading publication counts', () => {
        const { container } = setup({ loadingPossibleCounts: true, loadingPossiblePublicationsList: false });
        expect(container).toMatchSnapshot();
    });

    it('renders list of publications and counts and facets', () => {
        const searchFn = jest.fn();
        const { container, getByTestId } = setup({
            actions: {
                searchPossiblyYourPublications: searchFn,
                setClaimPublication: jest.fn(),
                hideRecordErrorReset: jest.fn(),
            },
            possibleCounts: 5,
            possiblePublicationsList: [
                { rek_pid: 'UQ:1', rek_title: '1' },
                { rek_pid: 'UQ:2', rek_title: '2' },
                { rek_pid: 'UQ:3', rek_title: '3' },
            ],
            possiblePublicationsFacets: {
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

        // change facet should redo search
        fireEvent.click(getByTestId('clickable-facet-category-display-type'));
        fireEvent.click(getByTestId('facet-filter-nested-item-display-type-book'));
        expect(searchFn).toBeCalledTimes(2);
    });

    it('renders alert when the hide pub api fails', () => {
        const { container } = setup({
            hidePublicationFailed: true,
            hidePublicationFailedErrorMessage: 'Test error message',
        });
        expect(container).toMatchSnapshot();
    });

    it('should select publication for claiming', () => {
        const claimFunction = jest.fn();
        const searchFunction = jest.fn();

        const { getByRole } = setup({
            possibleCounts: 1,
            possiblePublicationsList: [{ rek_pid: 'UQ:11111' }],
            actions: {
                setClaimPublication: claimFunction,
                searchPossiblyYourPublications: searchFunction,
                hideRecordErrorReset: jest.fn(),
            },
        });
        expect(searchFunction).toHaveBeenCalled();
        fireEvent.click(getByRole('button', { name: 'Claim this work' }));
        expect(claimFunction).toHaveBeenCalled();
    });

    it('calls hide publication', () => {
        const actionFunction = jest.fn();
        const { getByRole } = setup({
            possibleCounts: 1,
            possiblePublicationsList: [{ rek_pid: 'UQ:11111' }],
            actions: {
                hideRecord: actionFunction,
                hideRecordErrorReset: jest.fn(),
                searchPossiblyYourPublications: jest.fn(),
            },
        });

        fireEvent.click(getByRole('button', { name: 'Not mine' }));
        expect(actionFunction).not.toBeCalled();
        fireEvent.click(getByRole('button', { name: 'Yes' }));
        expect(actionFunction).toBeCalled();
    });

    it('renders active filters', () => {
        const { container } = setup({
            location: {
                state: {
                    hasPublications: true,
                    activeFacets: {
                        filters: {},
                        ranges: {
                            Year: {
                                from: 2000,
                                to: 2010,
                            },
                        },
                    },
                },
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('gets publications when user clicks back and state is set', () => {
        const testAction = jest.fn();
        setup({
            actions: {
                hideRecordErrorReset: jest.fn(),
                searchPossiblyYourPublications: testAction,
            },
            navigationType: 'POP',
            location: {
                pathname: pathConfig.records.possible,
                state: {
                    hasPublications: true,
                    activeFacets: {
                        filters: {},
                        ranges: {
                            Year: {
                                from: 2000,
                                to: 2010,
                            },
                        },
                    },
                },
            },
        });

        expect(testAction).toBeCalled();
    });

    it('gets publications when user clicks back with no location state', () => {
        const testAction = jest.fn();
        setup({
            actions: {
                hideRecordErrorReset: jest.fn(),
                searchPossiblyYourPublications: testAction,
            },
            navigationType: 'POP',
            location: {
                pathname: pathConfig.records.possible,
                state: null,
            },
        });

        expect(testAction).toBeCalled();
    });

    it('should handle larger number of pubs than page size', () => {
        const { getByTestId, getByRole } = setup({
            hasPublications: true,
            accountLoading: false,
            possibleCounts: 21,
            loadingPossibleCounts: false,
            possiblePublicationsList: [
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
            possiblePublicationsPagingData: {
                from: 1,
                to: 1,
                total: 21,
                per_page: 1,
                current_page: 1,
            },
            loadingPossiblePublicationsList: false,
        });
        expect(getByTestId('possibly-my-records-paging-top')).toBeInTheDocument();
        expect(getByTestId('possibly-my-records-paging-bottom')).toBeInTheDocument();
        expect(getByTestId('publication-list-sorting-sort-by')).toBeInTheDocument();

        // change page
        fireEvent.click(getByTestId('possibly-my-records-paging-top-select-page-3'));

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

    // coverage
    it('should show loader when user is filtering/paging', () => {
        const { getByText, getByRole } = setup({
            hasPublications: true,
            accountLoading: false,
            possibleCounts: 21,
            loadingPossibleCounts: false,
            possiblePublicationsList: [{ rek_pid: 'UQ:1' }],
            loadingPossiblePublicationsList: true,
        });

        expect(getByRole('progressbar')).toBeInTheDocument();
        expect(getByText('Searching for possibly your works')).toBeInTheDocument();
    });
});
