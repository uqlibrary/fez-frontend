import MyDatasets from './MyRecords';
import { pathConfig } from 'config';
import { locale } from 'locale';
import React from 'react';
import { render, WithRouter, WithReduxStore } from 'test-utils';

function setup(testProps = {}, renderMethod = render) {
    const props = {
        actions: {
            loadAuthorPublications: jest.fn(),
            setFixRecord: jest.fn(),
        },
        location: {
            pathname: pathConfig.dataset.mine,
            state: null,
        },
        navigate: testProps.navigate || jest.fn(),
        navigationType: testProps.navigationType || '',
        accountLoading: false,
        localePages: locale.pages.myDatasets,
        publicationsListPagingData: {},
        loadingPublicationsList: false,
        publicationsList: [],
        publicationsListFacets: {},
        authorDetails: {
            is_administrator: 0,
            is_super_administrator: 0,
        },
        ...testProps,
    };
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <MyDatasets {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('myDatasets test', () => {
    it('renders loading screen while loading account data', () => {
        const { container } = setup({ accountLoading: true });
        expect(container).toMatchSnapshot();
    });

    it('renders loading screen while loading publications ', () => {
        const container = setup({ loadingPublicationsList: true });
        expect(container).toMatchSnapshot();
    });

    it('renders loading screen while loading publications while filtering', () => {
        const { container } = setup({
            loadingPublicationsList: true,
            publicationsList: [{ rek_pid: 'UQ:1', rek_title: '1' }],
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
            publicationsListPagingData: { total: 2, per_page: 20, current_page: 1, from: 1, to: 2 },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders list of publications with facets', () => {
        const { container } = setup({
            publicationsList: [{ rek_pid: 'UQ:1', rek_title: '1' }], // myRecordsList.data,
            publicationsListPagingData: { total: 2, per_page: 20, current_page: 1, from: 1, to: 2 },
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
    });

    it('renders active filters', () => {
        const { container } = setup({
            state: { activeFacets: { filters: {}, ranges: { Year: { from: 2000, to: 2010 } } } },
        });
        expect(container).toMatchSnapshot();
    });

    it('gets publications when user clicks back and state is set', () => {
        const testAction = jest.fn();
        const { container, rerender } = setup({
            accountLoading: true,
            actions: { loadAuthorPublications: testAction },
            thisUrl: pathConfig.dataset.mine,
        });

        setup(
            {
                navigationType: 'POP',
                location: { pathname: pathConfig.dataset.mine, state: { page: 2, hasPublications: true } },
            },
            rerender,
        );
        // expect(testAction).toBeCalled();
        expect(container).toMatchSnapshot();
    });

    it('gets publications when user clicks back and state is not set', () => {
        const testAction = jest.fn();
        const { container, rerender } = setup({
            accountLoading: true,
            actions: { loadAuthorPublications: testAction },
            thisUrl: pathConfig.dataset.mine,
        });

        setup(
            {
                navigationType: 'POP',
                location: { pathname: pathConfig.dataset.mine, state: null },
                loadingPublicationsList: false,
                publicationsList: [],
            },
            rerender,
        );
        // expect(testAction).toHaveBeenCalled();
        expect(container).toMatchSnapshot();
    });
});
